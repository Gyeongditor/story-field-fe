import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { loginUser, logoutUser, getUserProfile, type LoginCredentials } from '../../../entities/user';
import { useAuthStore, authActions } from '../../../shared/stores/authStore';

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
    mutationFn: async (credentials: LoginCredentials) => {
      return await loginUser(credentials);
    },
    onSuccess: ({ tokens, user }) => {
      // Zustand Store에 저장
      authActions.login(tokens.accessToken, tokens.refreshToken, user);
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
    mutationFn: async () => {
      return await logoutUser(); // 쿠키 기반이므로 refreshToken 매개변수 불필요
    },
    onSuccess: () => {
      // Zustand Store 정리
      authActions.logout();
      
      // React Query 캐시 정리
      queryClient.clear();
      
      // 로그인 화면으로 이동 
      setTimeout(() => {
        router.push('/auth/login');
      }, 100);
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
      return await getUserProfile();
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
    // react-query v5: queryFn은 반드시 값을 반환해야 함
    queryFn: async () => {
      await restoreAuth();
      return true; // 복원 완료 신호 반환
    },
    staleTime: Infinity, // 한 번만 실행
    gcTime: 0, // 캐시하지 않음 (React Query v5에서 cacheTime -> gcTime)
  });
};
