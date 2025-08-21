/**
 * HTTP 헤더 파싱 유틸리티
 * API 응답 헤더에서 인증 관련 정보를 추출하는 함수들
 */

/**
 * Set-Cookie 헤더에서 특정 쿠키 값을 추출
 * @param setCookieHeader - Set-Cookie 헤더 문자열
 * @param cookieName - 추출할 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export const extractCookieValue = (setCookieHeader: string, cookieName: string): string | null => {
  if (!setCookieHeader || !cookieName) {
    return null;
  }

  // 쿠키 패턴: cookieName=value; 또는 cookieName=value
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  const match = setCookieHeader.match(regex);
  
  return match ? match[1].trim() : null;
};

/**
 * Set-Cookie 헤더 배열에서 refreshToken 추출
 * @param setCookieHeaders - Set-Cookie 헤더 문자열 또는 배열
 * @returns refreshToken 값 또는 null
 */
export const extractRefreshToken = (setCookieHeaders: string | string[]): string | null => {
  if (!setCookieHeaders) {
    return null;
  }

  // 문자열이면 배열로 변환
  const headers = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  
  for (const header of headers) {
    const refreshToken = extractCookieValue(header, 'refreshToken');
    if (refreshToken) {
      return refreshToken;
    }
  }
  
  return null;
};

/**
 * 응답 헤더에서 인증 관련 정보 추출
 * @param headers - axios 응답 헤더 객체
 * @returns 추출된 인증 정보
 */
export const extractAuthFromHeaders = (headers: any): {
  accessToken: string | null;
  refreshToken: string | null;
  userUuid: string | null;
} => {
  const result = {
    accessToken: null as string | null,
    refreshToken: null as string | null,
    userUuid: null as string | null,
  };

  if (!headers) {
    return result;
  }

  // Authorization 헤더에서 access token 추출
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (authHeader) {
    result.accessToken = authHeader;
  }

  // Set-Cookie 헤더에서 refresh token 추출
  const setCookieHeader = headers['set-cookie'] || headers['Set-Cookie'];
  if (setCookieHeader) {
    result.refreshToken = extractRefreshToken(setCookieHeader);
  }

  // UserUUID 헤더 추출
  const userUuidHeader = headers['useruuid'] || headers['UserUUID'] || headers['userUUID'];
  if (userUuidHeader) {
    result.userUuid = userUuidHeader;
  }

  return result;
};
