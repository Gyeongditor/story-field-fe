import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { logout } from '../../../shared/lib/auth';
import { authActions } from '../../../shared/stores/authStore';

export const useSettingsPage = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleSettingPress = (setting: string) => {
    Alert.alert('준비중', `${setting} 설정 기능이 준비중입니다.`);
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: performLogout
        },
      ]
    );
  };

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      const result = await logout();
      
      // Zustand Store 정리
      authActions.logout();
      
      if (result.success) {
        Alert.alert(
          '로그아웃 완료', 
          result.message || '로그아웃되었습니다.', 
          [
            { 
              text: '확인', 
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
      } else {
        Alert.alert(
          '로그아웃', 
          result.message || '로그아웃 처리 중 문제가 발생했지만 로그아웃되었습니다.',
          [
            { 
              text: '확인', 
              onPress: () => router.replace('/auth/login')
            }
          ]
        );
      }
    } catch (error) {
      console.error('로그아웃 예외 발생:', error);
      Alert.alert(
        '오류', 
        '로그아웃 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
        [
          { text: '확인' }
        ]
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    isLoggingOut,
    handleSettingPress,
    handleLogout
  };
};
