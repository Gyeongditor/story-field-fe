import { Alert, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../shared/lib/constants';
import { storage } from '../../shared/lib/storage';
import type { ApiResponse } from '../../shared/types/api';
import type { LoginRequestBody, LoginSuccessData } from '../../shared/types/auth';

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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const isValid = useMemo(() => !!email && !!password, [email, password]);

  const handleLogin = async (): Promise<void> => {
    if (!isValid) {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
      return;
    }
    try {
      setIsSubmitting(true);
      const body: LoginRequestBody = { email, password };
      const { data, status } = await apiClient.post<ApiResponse<LoginSuccessData> | LoginSuccessData>(API_ENDPOINTS.LOGIN, body);
      const accessToken = (data as ApiResponse<LoginSuccessData>)?.data?.accessToken ?? (data as LoginSuccessData)?.accessToken;
      const userProfile = (data as ApiResponse<LoginSuccessData>)?.data?.user ?? (data as LoginSuccessData)?.user;
      if (accessToken) await storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (userProfile) await storage.set(STORAGE_KEYS.USER_PROFILE, userProfile);
      if (status >= 200 && status < 300) {
        router.replace('/stories');
        return;
      }
      Alert.alert('에러', '로그인 처리 중 문제가 발생했어요.');
    } catch (error: unknown) {
      const res = (typeof error === 'object' && error !== null && (error as Record<string, unknown> & { response?: { status?: number, data?: { message?: string } } }).response) || undefined;
      const status = res?.status;
      const serverMessage = res?.data?.message;
      const fallback = '로그인에 실패했어요. 정보를 확인해 주세요.';
      if (status === 401) {
        Alert.alert('인증 실패', serverMessage ?? '아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (status === 403) {
        Alert.alert('계정 비활성화', serverMessage ?? '계정이 아직 활성화되지 않았습니다. 이메일 인증을 완료해주세요.');
      } else if (status === 404) {
        Alert.alert('계정 없음', serverMessage ?? '해당 계정을 찾을 수 없습니다.');
      } else if (status === 423) {
        Alert.alert('계정 잠금', serverMessage ?? '계정이 잠겨 있습니다. 관리자에게 문의하세요.');
      } else {
        Alert.alert('에러', serverMessage ?? fallback);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>로그인</Title>
      
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
      
      <Button onPress={isSubmitting ? undefined : handleLogin} disabled={!isValid || isSubmitting}>
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ButtonText>로그인</ButtonText>
        )}
      </Button>
      
      <LinkText onPress={() => router.push('/auth/signup')}>
        계정이 없으신가요? 회원가입
      </LinkText>
    </Container>
  );
} 