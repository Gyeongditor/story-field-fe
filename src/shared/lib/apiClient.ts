import axios, { AxiosInstance } from "axios";

/**
 * 공용 Axios 인스턴스
 * - 기본 baseURL 설정 (환경 변수 기반)
 * - 인증 토큰 자동 추가 (추후 토큰 스토리지 연동)
 * - 공통 에러 처리
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "https://example.com/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: 인증 토큰 자동 추가
apiClient.interceptors.request.use(
  async (config) => {
    // TODO: SecureStore 또는 Zustand 등에서 토큰 가져오기
    const token = ""; // ex) await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("apiClient 요청 에러:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 공통 에러 처리
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("apiClient 응답 에러:", error);
    if (error.response?.status === 401) {
      console.log("401 Unauthorized - 로그인 필요");
      // TODO: 로그아웃 처리 or 토큰 갱신 로직 추가
    }
    return Promise.reject(error);
  }
);
