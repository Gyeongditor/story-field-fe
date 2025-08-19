import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * 공용 Axios 인스턴스
 * - 기본 baseURL 설정 (환경 변수 기반)
 * - 인증 토큰 자동 추가 (추후 토큰 스토리지 연동)
 * - 공통 에러 처리
 */

const resolveBaseUrl = (): string => {
  try {
    // Constants가 없을 수도 있으므로 안전하게 처리
    const isDevice = Constants?.isDevice ?? false;
    const platform = Platform?.OS ?? 'unknown';
    const executionEnvironment = Constants?.executionEnvironment ?? 'unknown';
    

    
    // iOS 시뮬레이터 감지 (여러 조건 체크)
    const isIOSSimulator = (
      platform === 'ios' && 
      (!isDevice || String(executionEnvironment).includes('simulator'))
    );
    
    if (isIOSSimulator) {
      return "http://localhost:9080";
    } 
    
    // 실제 기기 감지
    if (isDevice && platform === 'ios') {
      return "http://192.168.200.196:9080";
    }
    
    // Android 처리
    if (platform === 'android') {
      if (isDevice) {
        return "http://192.168.200.196:9080";
      } else {
        return "http://10.0.2.2:9080"; // Android 에뮬레이터 전용
      }
    }
    
    // 기본값: localhost
    return "http://localhost:9080";
    
  } catch (error) {
    return "http://localhost:9080";
  }
};

const BASE_URL = resolveBaseUrl();

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터: 인증 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Zustand Store에서 액세스 토큰 가져오기 (빠름)
    try {
      // 동적 import로 순환 참조 방지
      const { useAuthStore } = await import('../../shared/stores/authStore');
      const token = useAuthStore.getState().accessToken;
      
      if (token) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set('Authorization', token); // 이미 "Bearer " 포함된 상태로 저장됨
      } else {
        // fallback: AsyncStorage에서 가져오기
        const { storage } = await import('./storage');
        const { STORAGE_KEYS } = await import('./constants');
        const fallbackToken = await storage.get(STORAGE_KEYS.ACCESS_TOKEN);
        
        if (fallbackToken && !config.headers?.get('Authorization')) {
          if (!config.headers) {
            config.headers = new AxiosHeaders();
          }
          config.headers.set('Authorization', fallbackToken as string);
        }
      }
    } catch (error) {
      // 토큰 로드 실패 무시
    }
    

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 공통 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      
      try {
        // 백엔드 시스템: 로그아웃 후 AT가 블랙리스트에 추가되어 접근 불가
        // 또는 AT가 만료되어 재발급이 필요한 상황
        if (error.config && !error.config._retry) {
          error.config._retry = true; // 무한 재시도 방지
          
          // 쿠키 기반 토큰 재발급 요청 (별도 인스턴스 사용으로 무한루프 방지)
          try {
            const refreshClient = axios.create({
              baseURL: BASE_URL,
              timeout: 10000,
              withCredentials: true, // 쿠키 자동 전송
            });
            
            const refreshResponse = await refreshClient.post('/auth/reissue');
            
            // 응답 헤더에서 새로운 토큰 정보 추출
            const { extractAuthFromHeaders } = await import('./headerUtils');
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = extractAuthFromHeaders(refreshResponse.headers);
            
            if (newAccessToken) {
              // Zustand Store 업데이트
              const { authActions } = await import('../../shared/stores/authStore');
              authActions.refreshToken(newAccessToken);
              
              // 새 refreshToken이 있으면 업데이트 (쿠키는 자동으로 설정되지만 로컬에도 저장)
              if (newRefreshToken) {
                const { storage } = await import('./storage');
                const { STORAGE_KEYS } = await import('./constants');
                await storage.set(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
              }
              
              if (!error.config.headers) {
                error.config.headers = new AxiosHeaders();
              }
              error.config.headers.set('Authorization', newAccessToken as string);
              return apiClient(error.config); // 원래 요청 재시도
            }
          } catch (refreshError) {
            // 갱신 실패 시 로그아웃 처리
            try {
              const { authActions } = await import('../../shared/stores/authStore');
              authActions.logout();
            } catch (logoutError) {
              // 최후의 수단으로 직접 정리
              const { storage } = await import('./storage');
              const { STORAGE_KEYS } = await import('./constants');
              await storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
              await storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
              await storage.remove(STORAGE_KEYS.USER_UUID);
            }
          }
        } else {
          // 토큰이 없으면 로컬 정리만 수행
          try {
            const { authActions } = await import('../../shared/stores/authStore');
            authActions.logout();
          } catch (logoutError) {
            // 로그아웃 실패 무시
          }
        }
      } catch (storageError) {
        // 스토리지 접근 실패 무시
      }
    }
    
    return Promise.reject(error);
  }
);

