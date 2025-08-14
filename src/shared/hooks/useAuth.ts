import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { apiClient } from '../lib/apiClient';
import { API_ENDPOINTS } from '../lib/constants';
import { useAuthStore, authActions } from '../stores/authStore';
import { logout as logoutService } from '../lib/auth';
import type { LoginRequestBody, LoginResponseData } from '../types/auth';
import type { ApiResponse } from '../types/api';

// Query Keys
export const AUTH_QUERY_KEYS = {
  profile: ['auth', 'profile'] as const,
  status: ['auth', 'status'] as const,
} as const;

/**
 * 로그인 Hook
 */
export const useLogin = () => {
  const router = useRouter();
  
  return useMutation({
    mutationFn: async (credentials: LoginRequestBody) => {
      const { data } = await apiClient.post<ApiResponse<LoginResponseData>>(
        API_ENDPOINTS.LOGIN, 
        credentials
      );
      return data;
    },
    onSuccess: (data) => {
      if (data?.data) {
        const { Authorization, "Refresh-Token": RefreshToken, userUUID } = data.data;
        
        const accessToken = Authorization?.[0];
        const refreshToken = RefreshToken?.[0];
        const uuid = userUUID?.[0];
        
        if (accessToken && refreshToken && uuid) {
          // Zustand Store에 저장
          authActions.login(accessToken, refreshToken, { uuid });
          
          // 성공 메시지와 함께 이동
          Alert.alert('로그인 성공', data.message || '환영합니다!', [
            { text: '확인', onPress: () => router.replace('/stories') }
          ]);
        }
      }
    },
    onError: (error: any) => {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      
      if (status === 401) {
        Alert.alert('로그인 실패', message || '이메일 또는 비밀번호가 올바르지 않습니다.');
      } else {
        Alert.alert('오류', message || '로그인 중 문제가 발생했습니다.');
      }
    },
  });
};

/**
 * 로그아웃 Hook
 */
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      // Zustand Store 정리
      authActions.logout();
      
      // React Query 캐시 정리
      queryClient.clear();
      
      // 로그인 화면으로 이동
      router.replace('/auth/login');
    },
  });
};

/**
 * 사용자 프로필 조회 Hook
 */
export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.profile,
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.PROFILE);
      return data;
    },
    enabled: isAuthenticated, // 로그인된 경우에만 실행
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
  });
};

/**
 * 인증 상태 Hook
 */
export const useAuthStatus = () => {
  const authState = useAuthStore();
  
  return {
    ...authState,
    // 편의 프로퍼티들
    isLoggedIn: authState.isAuthenticated && !!authState.accessToken,
    hasValidTokens: !!(authState.accessToken && authState.refreshToken),
  };
};

/**
 * 앱 시작 시 인증 상태 복원 Hook
 */
export const useAuthRestore = () => {
  const restoreAuth = useAuthStore(state => state.restoreAuth);
  
  return useQuery({
    queryKey: ['auth', 'restore'],
    queryFn: restoreAuth,
    staleTime: Infinity, // 한 번만 실행
    gcTime: 0, // 캐시하지 않음 (React Query v5에서 cacheTime -> gcTime)
  });
};
