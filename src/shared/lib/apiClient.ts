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
    
    console.log("[apiClient] 🔍 환경 상세 정보:", { 
      isDevice, 
      platform, 
      executionEnvironment,
      constantsExists: !!Constants,
      platformExists: !!Platform 
    });
    
    // iOS 시뮬레이터 감지 (여러 조건 체크)
    const isIOSSimulator = (
      platform === 'ios' && 
      (!isDevice || String(executionEnvironment).includes('simulator'))
    );
    
    if (isIOSSimulator) {
      console.log("[apiClient] ✅ iOS 시뮬레이터 감지 - localhost 사용");
      return "http://localhost:9080";
    } 
    
    // 실제 기기 감지
    if (isDevice && platform === 'ios') {
      console.log("[apiClient] ✅ 실제 iPhone 감지 - IP 주소 사용");
      return "http://192.168.200.196:9080";
    }
    
    // Android 처리
    if (platform === 'android') {
      if (isDevice) {
        console.log("[apiClient] ✅ 실제 Android 기기 - IP 주소 사용");
        return "http://192.168.200.196:9080";
      } else {
        console.log("[apiClient] ✅ Android 에뮬레이터 - 특수 IP 사용");
        return "http://10.0.2.2:9080"; // Android 에뮬레이터 전용
      }
    }
    
    // 기본값: localhost
    console.log("[apiClient] ⚠️ 기본값 사용 - localhost");
    return "http://localhost:9080";
    
  } catch (error) {
    console.error("[apiClient] 🚨 환경 감지 실패:", error);
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
      console.error('토큰 로드 실패:', error);
    }
    
    // HTTP 요청 로그 (상세)
    if (__DEV__) {
      try {
        const method = (config.method || 'GET').toUpperCase();
        const path = typeof config.url === 'string' ? config.url : '';
        console.log(`🌐 [HTTP REQUEST] ${method} ${config.baseURL}${path}`);
        console.log('📤 Headers:', JSON.stringify(config.headers, null, 2));
        console.log('📤 Data:', config.data);
      } catch {}
    }
    return config;
  },
  (error) => {
    console.error("apiClient 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 공통 에러 처리 및 토큰 갱신
apiClient.interceptors.response.use(
  (response) => {
    // 성공 응답 로그
    if (__DEV__) {
      console.log(`✅ [HTTP RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
      console.log('📥 Response Data:', response.data);
    }
    return response;
  },
  async (error) => {
    // 에러 응답 상세 로그
    if (__DEV__) {
      console.error(`❌ [HTTP ERROR] ${error.response?.status || 'Network'} ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
      console.error('📥 Error Response:', error.response?.data);
      console.error('📥 Error Headers:', error.response?.headers);
    }
    console.error("apiClient 응답 에러:", error);
    
    if (error.response?.status === 401) {
      
      try {
        const { storage } = await import('./storage');
        const { STORAGE_KEYS } = await import('./constants');
        const refreshToken = await storage.get(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken && error.config && !error.config._retry) {
          error.config._retry = true; // 무한 재시도 방지
          
          // 리프레시 토큰으로 새 액세스 토큰 요청 (별도 인스턴스 사용으로 무한루프 방지)
          try {
            const refreshClient = axios.create({
              baseURL: BASE_URL,
              timeout: 10000
            });
            
            const refreshResponse = await refreshClient.post('/auth/refresh', {
              refreshToken: refreshToken
            });
            
            const newAccessToken = refreshResponse.data?.data?.Authorization?.[0];
            if (newAccessToken) {
              // Zustand Store 업데이트
              const { authActions } = await import('../../shared/stores/authStore');
              authActions.refreshToken(newAccessToken);
              
              if (!error.config.headers) {
                error.config.headers = new AxiosHeaders();
              }
              error.config.headers.set('Authorization', newAccessToken as string);
              return apiClient(error.config); // 원래 요청 재시도
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
            // 갱신 실패 시 로그아웃 처리
            try {
              const { authActions } = await import('../../shared/stores/authStore');
              authActions.logout();
            } catch (logoutError) {
              console.error('자동 로그아웃 실패:', logoutError);
              // 최후의 수단으로 직접 정리
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
            console.error('자동 로그아웃 실패:', logoutError);
          }
        }
      } catch (storageError) {
        console.error('스토리지 접근 실패:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

