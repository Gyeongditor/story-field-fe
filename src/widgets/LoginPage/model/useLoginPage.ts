import { useRouter } from 'expo-router';

export const useLoginPage = () => {
  const router = useRouter();

  const handleLoginSuccess = () => {
    console.log('✅ [LoginPage] 로그인 성공, 홈으로 이동');
    router.replace('/');
  };

  const handleSignupPress = () => {
    console.log('🔄 [LoginPage] 회원가입 화면으로 이동');
    router.push('/auth/signup');
  };

  const handleGuestBrowse = () => {
    console.log('🔄 [LoginPage] 게스트 모드로 홈 이동');
    router.replace('/?guest=1');
  };

  return {
    handleLoginSuccess,
    handleSignupPress,
    handleGuestBrowse,
  };
};
