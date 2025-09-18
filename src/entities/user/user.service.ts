import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS } from '../../shared/lib/constants';
import { extractAuthFromHeaders } from '../../shared/lib/headerUtils';
import type { ApiResponse } from '../../shared/types/api';
import type { 
  LoginCredentials, 
  SignupData, 
  AuthResponse, 
  User,
  AuthTokens,
  UserProfileGetResponse,
  UserProfileUpdateRequest,
  UserProfileUpdateResponse,
  UserDeleteResponse
} from './user.types';

// 로그인 서비스
export const loginUser = async (credentials: LoginCredentials): Promise<{
  tokens: AuthTokens;
  user: User;
}> => {
  const response = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.LOGIN, 
    credentials
  );
  
  // 응답 헤더에서 인증 정보 추출
  const { accessToken, refreshToken, userUuid } = extractAuthFromHeaders(response.headers);
  
  if (!accessToken || !userUuid) {
    throw new Error('필수 인증 정보가 누락되었습니다.');
  }
  
  return {
    tokens: {
      accessToken,
      refreshToken: refreshToken || '' // RefreshToken은 쿠키에 저장되므로 선택적
    },
    user: {
      uuid: userUuid
    }
  };
};

// 회원가입 서비스
export const signupUser = async (signupData: SignupData): Promise<void> => {
  console.log('🚀 [회원가입] 요청 시작 - 원본 데이터:', signupData);
  console.log('🔍 [회원가입] 요청 URL:', `${API_ENDPOINTS.SIGNUP}`);
  console.log('🔍 [회원가입] 데이터 유효성:', {
    hasEmail: !!signupData.email,
    hasPassword: !!signupData.password,
    hasName: !!signupData.name,
    emailLength: signupData.email?.length,
    passwordLength: signupData.password?.length,
    nameLength: signupData.name?.length
  });
  
  // 서버가 기대하는 형식으로 변환 (name -> username)
  const serverSignupData = {
    email: signupData.email,
    password: signupData.password,
    username: signupData.name // name을 username으로 변환
  };
  
  console.log('🔄 [회원가입] 서버 전송 데이터 (필드명 변환):', serverSignupData);
  
  const { data } = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.SIGNUP, 
    serverSignupData
  );
  
  console.log('✅ [회원가입] 서버 응답:', data);
  
  // 스웨거 문서에 따르면 성공 시 status: 201, code: "USER_201_001"
  if (data?.status === 201 && data?.code === "USER_201_001") {
    console.log('🎉 [회원가입] 성공:', data.message);
    console.log('📝 [회원가입] 등록된 사용자:', data.data);
  } else if (!data?.data) {
    console.error('❌ [회원가입] 응답 데이터가 없습니다:', data);
    throw new Error('회원가입에 실패했습니다.');
  }
};

// 로그아웃 서비스 (헤더 방식 시도 후 쿠키 방식으로 폴백)
export const logoutUser = async (refreshToken?: string): Promise<{ success: boolean; message?: string }> => {
  try {
    // 서버에 로그아웃 요청
    try {
      // RefreshToken 가져오기
      const { storage } = await import('../../shared/lib/storage');
      const { STORAGE_KEYS } = await import('../../shared/lib/constants');
      const storedRefreshToken = refreshToken || await storage.get(STORAGE_KEYS.REFRESH_TOKEN);
      
      // JWT 토큰 구조 및 만료 시간 확인
      if (storedRefreshToken) {
        try {
          const tokenParts = (storedRefreshToken as string).split('.');
          
          // JWT payload 디코딩 (만료 시간 확인)
          if (tokenParts[1]) {
            try {
              const payloadBase64 = tokenParts[1];
              const payloadDecoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
              const payload = JSON.parse(payloadDecoded);
              
              const now = Math.floor(Date.now() / 1000);
              const isExpired = payload.exp && payload.exp < now;
              
              if (isExpired) {
                console.error('RefreshToken이 만료되었습니다.');
              }
            } catch (decodeError) {
              // JWT 디코딩 실패는 무시
            }
          }
        } catch (jwtError) {
          // JWT 파싱 오류는 무시
        }
      }
      
      if (!storedRefreshToken) {
        // RefreshToken이 없어도 로컬 정리는 진행
      } else {
        const { default: axios } = await import('axios');
        const { apiClient } = await import('../../shared/lib/apiClient');
        
        try {
          // Authorization과 Refresh-Token 헤더 둘 다 필요
          const { storage } = await import('../../shared/lib/storage');
          const { STORAGE_KEYS } = await import('../../shared/lib/constants');
          const accessToken = await storage.get(STORAGE_KEYS.ACCESS_TOKEN);
          
          const logoutClient = axios.create({
            baseURL: apiClient.defaults.baseURL,
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': accessToken as string,
              'Refresh-Token': storedRefreshToken as string
            }
          });
          
          await logoutClient.delete(API_ENDPOINTS.LOGOUT);
          
        } catch (deleteError: any) {
          // 서버 로그아웃 실패해도 로컬 정리는 진행
        }
      }
    } catch (error: any) {
      // 어느 경우든 로컬 정리는 진행 (사용자 안전)
    }
    
    // 로컬 저장소에서 모든 토큰과 사용자 정보 삭제
    const { storage } = await import('../../shared/lib/storage');
    const { STORAGE_KEYS } = await import('../../shared/lib/constants');
    
    const keysToRemove = [
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_UUID,
      STORAGE_KEYS.USER_PROFILE,
      'auth-storage', // Zustand persist 스토리지도 삭제
    ].filter(key => key && typeof key === 'string');
    
    await Promise.all(keysToRemove.map(key => storage.remove(key)));
    
    return {
      success: true,
      message: '로그아웃이 완료되었습니다.'
    };
    
  } catch (error) {
    // 에러가 발생해도 로컬 정리는 시도
    try {
      const { storage } = await import('../../shared/lib/storage');
      const { STORAGE_KEYS } = await import('../../shared/lib/constants');
      
      const keysToRemove = [
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_UUID,
        STORAGE_KEYS.USER_PROFILE,
        'auth-storage',
      ].filter(key => key && typeof key === 'string');
      
      await Promise.all(keysToRemove.map(key => storage.remove(key)));
    } catch (cleanupError) {
      // 로컬 정리 실패는 무시
    }
    
    return {
      success: false,
      message: '로그아웃 처리 중 문제가 발생했지만 로그아웃되었습니다.'
    };
  }
};

// 토큰 갱신 서비스 (쿠키 기반)
export const refreshUserToken = async (): Promise<AuthTokens> => {
  const response = await apiClient.post(API_ENDPOINTS.REISSUE_TOKEN, {}, {
    withCredentials: true, // 쿠키 자동 전송
  });
  
  // 응답 헤더에서 새로운 토큰 정보 추출
  const { accessToken, refreshToken: newRefreshToken } = extractAuthFromHeaders(response.headers);
  
  if (!accessToken) {
    throw new Error('AccessToken 재발급에 실패했습니다.');
  }
  
  return {
    accessToken,
    refreshToken: newRefreshToken || ''
  };
};

// 사용자 프로필 조회
export const getUserProfile = async (): Promise<User> => {
  const { data } = await apiClient.get<ApiResponse<User>>(
    API_ENDPOINTS.USER_PROFILE
  );
  
  if (!data?.data) {
    throw new Error('사용자 프로필을 가져올 수 없습니다.');
  }
  
  return data.data;
};

// 프로필 관리 API 서비스 함수들

// 회원 정보 조회
export const getMyProfile = async (): Promise<UserProfileGetResponse> => {
  console.log('🔍 [getMyProfile] API 호출 시작');
  try {
    // API 스펙에 따라 Authorization을 query parameter로 보내는 방식으로 시도
    const { useAuthStore } = await import('../../shared/stores/authStore');
    const token = useAuthStore.getState().accessToken;
    
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }
    
    const response = await apiClient.get('/api/user/me', {
      params: {
        Authorization: token
      }
    });
    console.log('✅ [getMyProfile] 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [getMyProfile] 실패:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message
    });
    throw error;
  }
};

// 회원 정보 수정
export const updateMyProfile = async (updateData: UserProfileUpdateRequest): Promise<UserProfileUpdateResponse> => {
  console.log('🔍 [updateMyProfile] API 호출 시작:', updateData);
  try {
    // API 스펙에 따라 Authorization을 query parameter로 보내는 방식으로 시도
    const { useAuthStore } = await import('../../shared/stores/authStore');
    const token = useAuthStore.getState().accessToken;
    
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }
    
    const response = await apiClient.put('/api/user/me', updateData, {
      params: {
        Authorization: token
      }
    });
    console.log('✅ [updateMyProfile] 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [updateMyProfile] 실패:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
      requestData: updateData
    });
    throw error;
  }
};

// 회원 탈퇴
export const deleteMyAccount = async (): Promise<UserDeleteResponse> => {
  console.log('🔍 [deleteMyAccount] API 호출 시작');
  try {
    // API 스펙에 따라 Authorization을 query parameter로 보내는 방식으로 시도
    const { useAuthStore } = await import('../../shared/stores/authStore');
    const token = useAuthStore.getState().accessToken;
    
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }
    
    const response = await apiClient.delete('/api/user/me', {
      params: {
        Authorization: token
      }
    });
    console.log('✅ [deleteMyAccount] 성공:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ [deleteMyAccount] 실패:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message
    });
    throw error;
  }
};


