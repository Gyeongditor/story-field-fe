import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS } from '../../shared/lib/constants';
import type { ApiResponse } from '../../shared/types/api';
import type { 
  LoginCredentials, 
  SignupData, 
  AuthResponse, 
  User,
  AuthTokens 
} from './user.types';

// 로그인 서비스
export const loginUser = async (credentials: LoginCredentials): Promise<{
  tokens: AuthTokens;
  user: User;
}> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.LOGIN, 
    credentials
  );
  
  if (!data?.data) {
    throw new Error('로그인 응답 데이터가 없습니다.');
  }
  
  const { Authorization, "Refresh-Token": RefreshToken, userUUID } = data.data;
  
  const accessToken = Authorization?.[0];
  const refreshToken = RefreshToken?.[0];
  const uuid = userUUID?.[0];
  
  if (!accessToken || !refreshToken || !uuid) {
    throw new Error('필수 인증 정보가 누락되었습니다.');
  }
  
  return {
    tokens: {
      accessToken,
      refreshToken
    },
    user: {
      uuid
    }
  };
};

// 회원가입 서비스
export const signupUser = async (signupData: SignupData): Promise<void> => {
  const { data } = await apiClient.post<ApiResponse<any>>(
    API_ENDPOINTS.SIGNUP, 
    signupData
  );
  
  if (!data?.success) {
    throw new Error('회원가입에 실패했습니다.');
  }
};

// 로그아웃 서비스
export const logoutUser = async (refreshToken: string): Promise<void> => {
  try {
    await apiClient.post(API_ENDPOINTS.LOGOUT, { refreshToken });
  } catch (error) {
    // 로그아웃은 실패해도 로컬 상태는 정리
    console.warn('로그아웃 API 실패:', error);
  }
};

// 토큰 갱신 서비스
export const refreshUserToken = async (refreshToken: string): Promise<AuthTokens> => {
  const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
    API_ENDPOINTS.REFRESH_TOKEN, 
    { refreshToken }
  );
  
  if (!data?.data) {
    throw new Error('토큰 갱신 응답 데이터가 없습니다.');
  }
  
  const { Authorization, "Refresh-Token": RefreshToken } = data.data;
  
  const accessToken = Authorization?.[0];
  const newRefreshToken = RefreshToken?.[0];
  
  if (!accessToken || !newRefreshToken) {
    throw new Error('토큰 갱신에 실패했습니다.');
  }
  
  return {
    accessToken,
    refreshToken: newRefreshToken
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
