import { Alert, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { useMemo, useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS } from '../../shared/lib/constants';
import type { ApiResponse } from '../../shared/types/api';
import type { SignupRequestBody } from '../../shared/types/auth';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: #333333;
`;

const Input = styled.TextInput`
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  font-size: 16px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ButtonText = styled.Text`
  color: white;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;

const LinkText = styled.Text`
  color: #007AFF;
  text-align: center;
  margin-top: 20px;
`;

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const isValid = useMemo(() => {
    if (!username || !email || !password || !confirmPassword) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [username, email, password, confirmPassword]);

  const handleSignUp = async (): Promise<void> => {
    if (!isValid) {
      Alert.alert('오류', '입력값을 다시 확인해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: SignupRequestBody = { email, password, username };
      await apiClient.post<ApiResponse<unknown>>(API_ENDPOINTS.SIGNUP, payload);

      Alert.alert(
        '회원가입 완료',
        '입력하신 이메일로 인증 링크를 보냈어요. 메일함에서 인증을 완료해 주세요.',
        [
          {
            text: '확인',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error: unknown) {
      const message =
        (typeof error === 'object' && error !== null &&
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (error as Record<string, unknown>)?.hasOwnProperty('response') &&
          (error as Record<string, unknown> & { response?: { data?: { message?: string } } })?.response?.data?.message) ||
        '회원가입에 실패했어요. 잠시 후 다시 시도해주세요.';
      Alert.alert('에러', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>

      <Input
        placeholder="사용자명"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      
      <Input
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <Input
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Input
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <Button onPress={isSubmitting ? undefined : handleSignUp} disabled={!isValid || isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ButtonText>회원가입</ButtonText>
        )}
      </Button>

      <LinkText onPress={() => router.push('/auth/login')}>
        이미 계정이 있으신가요? 로그인
      </LinkText>
    </Container>
  );
} 