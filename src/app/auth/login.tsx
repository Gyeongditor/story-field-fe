import React from 'react';
import styled from '@emotion/native';
import { useRouter } from 'expo-router';
import { LoginForm } from '../../features/auth/components';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
`;

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/');
  };

  const handleSignupPress = () => {
    router.push('/auth/signup');
  };

  const handleGuestBrowse = () => {
    router.replace('/?guest=1');
  };

  return (
    <Container>
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onSignupPress={handleSignupPress}
        onGuestBrowse={handleGuestBrowse}
      />
    </Container>
  );
} 