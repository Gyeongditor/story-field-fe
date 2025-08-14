import axios, { AxiosInstance } from "axios";
import Constants from "expo-constants";

/**
 * 공용 Axios 인스턴스
 * - 기본 baseURL 설정 (환경 변수 기반)
 * - 인증 토큰 자동 추가 (추후 토큰 스토리지 연동)
 * - 공통 에러 처리
 */

const resolveBaseUrl = (): string => {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  const extraUnknown: unknown = Constants?.expoConfig?.extra;
  const extra = (typeof extraUnknown === "object" && extraUnknown !== null
    ? (extraUnknown as Record<string, unknown>)
    : {}) as Record<string, unknown>;
  const fromExtra = typeof extra["API_URL"] === "string" ? (extra["API_URL"] as string) : undefined;
  const urlRaw = fromEnv ?? fromExtra ?? "https://example.com/api";
  const url = typeof urlRaw === "string" ? urlRaw.replace(/\/+$/, "") : "https://example.com/api";
  if (url === "https://example.com/api") {
    // 개발 편의를 위한 경고 로그
    // eslint-disable-next-line no-console
    console.warn(
      "[apiClient] EXPO_PUBLIC_API_URL이 설정되지 않았습니다. 기본 URL(https://example.com/api)을 사용합니다. .env.development에 EXPO_PUBLIC_API_URL을 설정하세요."
    );
  }
  return url;
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
  async (config) => {
    // TODO: SecureStore 또는 Zustand 등에서 토큰 가져오기
    const token = ""; // ex) await SecureStore.getItemAsync('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // 개발 편의를 위한 요청 로그
    try {
      const method = (config.method || 'GET').toUpperCase();
      const path = typeof config.url === 'string' ? config.url : '';
      // eslint-disable-next-line no-console
      console.log(`[HTTP] ${method} ${config.baseURL}${path}`);
    } catch {}
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
