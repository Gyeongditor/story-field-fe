import { useEffect, useState } from 'react';
import styled from '@emotion/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { apiClient } from '../../../shared/lib/apiClient';
import { API_ENDPOINTS } from '../../../shared/lib/constants';
import type { ApiResponse } from '../../../shared/types/api';
import type { VerifyResponseData } from '../../../shared/types/auth';
import { ActivityIndicator, Alert } from 'react-native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-size: 22px;
  font-weight: 700;
  color: #333333;
  margin-bottom: 12px;
`;

const Desc = styled.Text`
  font-size: 16px;
  color: #666666;
  text-align: center;
`;

export default function VerifyEmail() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const run = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const { data } = await apiClient.get<ApiResponse<VerifyResponseData> | VerifyResponseData>(`${API_ENDPOINTS.VERIFY_EMAIL}/${token}`);
        const payload = (data as ApiResponse<VerifyResponseData>)?.data ?? (data as VerifyResponseData);
        setSuccess(true);
        setUsername(payload?.username || '');
        setEmail(payload?.email || '');
        setTimeout(() => router.replace('/auth/login'), 1500);
      } catch (error: unknown) {
        setSuccess(false);
        const message =
          (typeof error === 'object' && error !== null &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (error as Record<string, unknown>)?.hasOwnProperty('response') &&
            (error as Record<string, unknown> & { response?: { data?: { message?: string } } })?.response?.data?.message) ||
          '인증에 실패했어요. 링크가 만료되었을 수 있어요.';
        Alert.alert('인증 실패', message, [
          { text: '확인', onPress: () => router.replace('/auth/login') },
        ]);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token]);

  return (
    <Container>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#007aff" />
          <Desc>인증 중입니다...</Desc>
        </>
      ) : success ? (
        <>
          <Title>이메일 인증 완료</Title>
          <Desc>{username ? `${username}님,` : ''} 계정이 활성화되었습니다. 잠시 후 로그인 화면으로 이동합니다.</Desc>
        </>
      ) : (
        <>
          <Title>인증 실패</Title>
          <Desc>토큰이 유효하지 않거나 만료되었습니다.</Desc>
        </>
      )}
    </Container>
  );
}


