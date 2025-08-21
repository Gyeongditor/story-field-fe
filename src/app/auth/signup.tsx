import React from 'react';
import styled from '@emotion/native';
import { useRouter } from 'expo-router';
import { SignupForm } from '../../features/auth/components';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
`;

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    router.replace('/auth/login');
  };

  const handleLoginPress = () => {
    router.push('/auth/login');
  };

  return (
    <Container>
      <SignupForm
        onSignupSuccess={handleSignupSuccess}
        onLoginPress={handleLoginPress}
      />
    </Container>
  );
} 