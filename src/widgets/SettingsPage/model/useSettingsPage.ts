import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useLogout, useAuthStatus } from '../../../features/auth';
import { useAuthStore } from '../../../shared/stores/authStore';

export const useSettingsPage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { mutate: performLogout, isPending } = useLogout();
  const authStatus = useAuthStatus();
  const { isAuthenticated: storeAuthenticated, accessToken, user } = useAuthStore();
  
  // 디버깅: 인증 상태 확인
  console.log('🔍 [SettingsPage] 인증 상태 디버깅:', {
    authStatus,
    'authStatus.isAuthenticated': authStatus.isAuthenticated,
    storeAuthenticated,
    hasAccessToken: !!accessToken,
    hasUser: !!user,
    '최종사용할값': storeAuthenticated || authStatus.isAuthenticated
  });

  const handleSettingPress = (setting: string) => {
    if (setting === '로그인') {
      // 로그인 화면으로 이동 (일관된 라우팅 방식)
      router.push('/auth/login');
    } else {
      Alert.alert('준비중', `${setting} 설정 기능이 준비중입니다.`);
    }
  };

  const handleLogout = () => {
    // 로그인 상태가 아니면 로그아웃 불가
    if (!authStatus.isAuthenticated) {
      Alert.alert(
        '알림',
        '로그인 상태가 아닙니다.',
        [{ text: '확인' }]
      );
      return;
    }

    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: () => {
            setIsLoggingOut(true);
            performLogout(undefined, {
              onSuccess: (result) => {
                setIsLoggingOut(false);
                
                // 서버 로그아웃 성공 여부와 관계없이 로컬 정리는 완료됨
                Alert.alert(
                  '로그아웃 완료', 
                  result?.message || '로그아웃되었습니다.', 
                  [{ text: '확인' }]
                );
              },
              onError: (error) => {
                setIsLoggingOut(false);
                console.error('로그아웃 완전 실패:', error);
                
                // 이 경우는 로컬 정리마저 실패한 심각한 상황
                Alert.alert(
                  '오류', 
                  '로그아웃 처리 중 문제가 발생했습니다. 앱을 재시작해주세요.',
                  [{ text: '확인' }]
                );
              }
            });
          }
        },
      ]
    );
  };

  // Zustand 스토어 값을 우선 사용 (더 신뢰성 있음)
  const finalIsAuthenticated = storeAuthenticated || authStatus.isAuthenticated || false;

  return {
    isLoggingOut: isLoggingOut || isPending,
    isAuthenticated: finalIsAuthenticated,
    handleSettingPress,
    handleLogout
  };
};
