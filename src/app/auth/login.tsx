import { ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { useMemo, useState } from 'react';
import { Link, useRouter } from 'expo-router';

import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS, STORAGE_KEYS } from '../../shared/lib/constants';
import { storage } from '../../shared/lib/storage';
import { authActions } from '../../shared/stores/authStore';
import type { ApiResponse } from '../../shared/types/api';
import type { LoginRequestBody, LoginResponseData } from '../../shared/types/auth';

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

const GhostButton = styled.TouchableOpacity`
  margin-top: 16px; /* 2 x 8 */
  padding: 12px 16px; /* 1.5 x 8, 2 x 8 */
  align-items: center;
`;

const GhostText = styled.Text`
  color: #6b7280;
  font-size: 14px;
`;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const isValid = useMemo(() => !!email && !!password, [email, password]);

  const handleLogin = async () => {
    if (!isValid) return;
    
    try {
      setIsSubmitting(true);
      const credentials: LoginRequestBody = { email, password };
      
      const { data } = await apiClient.post<ApiResponse<LoginResponseData>>(
        API_ENDPOINTS.LOGIN, 
        credentials
      );
      
      if (data?.data) {
        const { Authorization, "Refresh-Token": RefreshToken, userUUID } = data.data;
        
        const accessToken = Authorization?.[0];
        const refreshToken = RefreshToken?.[0];
        const uuid = userUUID?.[0];
        
        if (accessToken && refreshToken && uuid) {
          // Zustand Store에 저장
          authActions.login(accessToken, refreshToken, { uuid });
          
          // 성공 후 홈으로 이동
          router.replace('/');
        }
      }
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      
      console.error('로그인 실패:', error);
      // 에러 처리는 사용자에게 표시하지 않고 콘솔만
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
      
      <Button 
        onPress={isSubmitting ? undefined : handleLogin} 
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ButtonText>로그인</ButtonText>
        )}
      </Button>
      
      <LinkText onPress={() => router.push('/auth/signup')}>
        계정이 없으신가요? 회원가입
      </LinkText>

      <GhostButton onPress={() => router.replace('/?guest=1')}>
        <GhostText>둘러보기 (로그인 없이)</GhostText>
      </GhostButton>
    </Container>
  );
} 