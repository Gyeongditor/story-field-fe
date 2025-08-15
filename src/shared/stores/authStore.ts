import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '../lib/storage';
import { STORAGE_KEYS } from '../lib/constants';

// 인증 상태 타입 정의
interface User {
  uuid: string;
  email?: string;
  username?: string;
}

interface AuthState {
  // 상태
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;

  // 액션
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  restoreAuth: () => Promise<void>;
  updateAccessToken: (newToken: string) => void;
}

// Zustand Store 생성
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      user: null,
      isLoading: true,

      // 토큰 설정 (로그인 성공 시)
      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // AsyncStorage에도 별도 저장 (API 클라이언트에서 직접 접근용)
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      },

      // 사용자 정보 설정
      setUser: (user: User) => {
        set({ user });
        storage.set(STORAGE_KEYS.USER_UUID, user.uuid);
        if (user.email || user.username) {
          storage.set(STORAGE_KEYS.USER_PROFILE, user);
        }
      },

      // 인증 정보 초기화 (로그아웃)
      clearAuth: () => {
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          user: null,
          isLoading: false,
        });
        
        // AsyncStorage 정리
        storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
        storage.remove(STORAGE_KEYS.USER_UUID);
        storage.remove(STORAGE_KEYS.USER_PROFILE);
      },

      // 앱 시작 시 저장된 인증 정보 복원
      restoreAuth: async () => {
        try {
          const [accessToken, refreshToken, userUUID] = await Promise.all([
            storage.get(STORAGE_KEYS.ACCESS_TOKEN),
            storage.get(STORAGE_KEYS.REFRESH_TOKEN),
            storage.get(STORAGE_KEYS.USER_UUID),
          ]);

          if (accessToken && refreshToken && userUUID) {
            set({
              accessToken: accessToken as string,
              refreshToken: refreshToken as string,
              user: { uuid: userUUID as string },
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({ isLoading: false });
          }
        } catch (error) {
          console.error('인증 정보 복원 실패:', error);
          set({ isLoading: false });
        }
      },

      // 액세스 토큰만 업데이트 (리프레시 시)
      updateAccessToken: (newToken: string) => {
        set({ accessToken: newToken });
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, newToken);
      },
    }),
    {
      name: 'auth-storage', // AsyncStorage 키
      storage: createJSONStorage(() => AsyncStorage),
      // 민감한 토큰은 Zustand persist에서 제외 (보안상 별도 관리)
      partialize: (state) => ({
        user: state.user,
        // 토큰은 제외 (보안상 별도 관리)
      }),
    }
  )
);

// 편의 함수들
export const authActions = {
  login: (accessToken: string, refreshToken: string, user: User) => {
    const store = useAuthStore.getState();
    store.setTokens(accessToken, refreshToken);
    store.setUser(user);
  },
  
  logout: () => {
    const store = useAuthStore.getState();
    store.clearAuth();
  },
  
  refreshToken: (newAccessToken: string) => {
    const store = useAuthStore.getState();
    store.updateAccessToken(newAccessToken);
  },
};
