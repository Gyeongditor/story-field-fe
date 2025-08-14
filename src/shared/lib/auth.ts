import { apiClient } from './apiClient';
import { storage } from './storage';
import { API_ENDPOINTS, STORAGE_KEYS } from './constants';

/**
 * 로그아웃 함수
 * - Refresh Token을 헤더에 포함하여 서버에 로그아웃 요청
 * - 성공/실패 여부와 관계없이 로컬 토큰들 모두 삭제
 * - 에러 발생 시에도 로컬 정리는 수행
 */
export const logout = async (): Promise<{ success: boolean; message?: string }> => {
  try {
    // 저장된 리프레시 토큰 가져오기
    const refreshToken = await storage.get(STORAGE_KEYS.REFRESH_TOKEN);
    
    if (refreshToken) {
      try {
        // 서버에 로그아웃 요청 (리프레시 토큰을 헤더에 포함)
        await apiClient.delete(API_ENDPOINTS.LOGOUT, {
          headers: {
            'Refresh-Token': refreshToken as string
          }
        });
        
      } catch (logoutError) {
        console.error('서버 로그아웃 실패:', logoutError);
        // 서버 로그아웃 실패해도 로컬 정리는 진행
      }
    }
    
    // 로컬 저장소에서 모든 토큰과 사용자 정보 삭제
    const keysToRemove = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_UUID,
      STORAGE_KEYS.USER_PROFILE,
      'auth-storage', // Zustand persist 스토리지도 삭제
    ].filter(key => key && typeof key === 'string'); // undefined 키 필터링
    
    await Promise.all(keysToRemove.map(key => storage.remove(key)));
    
    return {
      success: true,
      message: '로그아웃이 완료되었습니다.'
    };
    
  } catch (error) {
    console.error('❌ 로그아웃 처리 중 오류:', error);
    
    // 에러가 발생해도 로컬 정리는 시도
    try {
      const keysToRemove = [
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_UUID,
        STORAGE_KEYS.USER_PROFILE,
        'auth-storage', // Zustand persist 스토리지도 삭제
      ].filter(key => key && typeof key === 'string'); // undefined 키 필터링
      
      await Promise.all(keysToRemove.map(key => storage.remove(key)));
    } catch (cleanupError) {
      console.error('❌ 로컬 정리마저 실패:', cleanupError);
    }
    
    return {
      success: false,
      message: '로그아웃 처리 중 문제가 발생했지만 로그아웃되었습니다.'
    };
  }
};

/**
 * 로그인 상태 확인 함수
 */
export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const accessToken = await storage.get(STORAGE_KEYS.ACCESS_TOKEN);
    return !!accessToken;
  } catch {
    return false;
  }
};

/**
 * 현재 사용자 UUID 가져오기
 */
export const getCurrentUserUUID = async (): Promise<string | null> => {
  try {
    const userUUID = await storage.get(STORAGE_KEYS.USER_UUID);
    return typeof userUUID === 'string' ? userUUID : null;
  } catch {
    return null;
  }
};
