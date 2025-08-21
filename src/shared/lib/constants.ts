/** API 관련 엔드포인트 */
export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REISSUE_TOKEN: "/api/auth/reissue",
  SIGNUP: "/api/user/signup",
  VERIFY_EMAIL: "/api/user/verify",
  USER_PROFILE: "/api/auth/profile",
  STORIES: "/api/stories",
};

/** 앱 공통 레이아웃 */
export const APP_LAYOUT = {
  HEADER_HEIGHT: 56,
  TABBAR_HEIGHT: 60,
};

/** 스토리지 키 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_UUID: "userUUID",
  USER_PROFILE: "userProfile",
};

/** 앱 기본 정보 */
export const APP_INFO = {
  NAME: "Story Field",
  VERSION: "1.0.0",
};

/** 외부 링크 */
export const EXTERNAL_LINKS = {
  TERMS: "https://example.com/terms",
  PRIVACY: "https://example.com/privacy",
};
