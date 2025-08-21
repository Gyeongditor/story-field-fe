import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthStatus } from '../../../features/auth';

export const useHomePage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const params = useLocalSearchParams<{ guest?: string }>();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && params.guest !== '1') {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, params.guest]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new_text':
        Alert.alert('준비중', '새 동화 만들기 기능 준비중입니다.');
        break;
      case 'new_voice':
        Alert.alert('준비중', '새 동화 음성 기능 준비중입니다.');
        break;
      case 'my_stories':
        router.push('/stories');
        break;
      case 'my_voices':
        Alert.alert('준비중', '내 음성(보이스) 기능 준비중입니다.');
        break;
      case 'recent':
        Alert.alert('준비중', '최근 읽은 동화 기능 준비중입니다.');
        break;
      default:
        break;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    handleQuickAction,
    shouldShowPage: isLoading || isAuthenticated || params.guest === '1'
  };
};
