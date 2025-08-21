import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export const useCreatePage = () => {
  const router = useRouter();

  const handleCreateOption = (type: string) => {
    if (type === '텍스트') {
      router.push('/create/text');
      return;
    }
    if (type === '음성') {
      router.push('/create/voice');
      return;
    }
    Alert.alert('준비중', `${type} 생성 기능이 준비중입니다.`);
  };

  return {
    handleCreateOption
  };
};
