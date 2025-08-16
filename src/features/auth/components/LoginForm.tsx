import React, { useState, useMemo } from 'react';
import styled from '@emotion/native';
import { loginUser, type LoginCredentials } from '../../../entities/user';
import { authActions } from '../../../shared/stores/authStore';
import { Input, Title, LinkText, ErrorText } from '../../../shared/ui';
import Button from '../../../shared/ui/Button';

const Container = styled.View`
  width: 100%;
`;

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onSignupPress?: () => void;
  onGuestBrowse?: () => void;
}

export default function LoginForm({ 
  onLoginSuccess, 
  onSignupPress, 
  onGuestBrowse 
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = useMemo(() => !!email && !!password, [email, password]);

  const handleLogin = async () => {
    if (!isValid || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const credentials: LoginCredentials = { email, password };
      const { tokens, user } = await loginUser(credentials);
      
      // Zustand Store에 저장
      authActions.login(tokens.accessToken, tokens.refreshToken, user);
      
      // 성공 콜백 호출
      onLoginSuccess?.();
      
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      
      console.error('로그인 실패:', error);
      
      // 사용자 친화적 에러 메시지
      if (status === 401) {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      } else if (status === 422) {
        setError('입력 정보를 확인해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title level={2}>로그인</Title>
      
      {error && <ErrorText>{error}</ErrorText>}
      
      <Input
        placeholder="이메일"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isSubmitting}
        variant={error ? 'error' : 'default'}
      />
      
      <Input
        placeholder="비밀번호"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
        secureTextEntry
        disabled={isSubmitting}
        variant={error ? 'error' : 'default'}
      />
      
      <Button 
        title="로그인"
        onPress={handleLogin} 
        disabled={!isValid || isSubmitting}
        loading={isSubmitting}
        variant="primary"
        size="lg"
      />
      
      <LinkText onPress={onSignupPress}>
        계정이 없으신가요? 회원가입
      </LinkText>

      <Button
        title="둘러보기 (로그인 없이)"
        onPress={onGuestBrowse}
        variant="ghost"
        size="md"
      />
    </Container>
  );
}
