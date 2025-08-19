import React from 'react';
import styled from '@emotion/native';
import { LoginForm } from '../../../features/auth/components';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: #ffffff;
`;

interface LoginPageProps {
  onLoginSuccess: () => void;
  onSignupPress: () => void;
  onGuestBrowse: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onSignupPress,
  onGuestBrowse,
}) => {
  return (
    <Container>
      <LoginForm
        onLoginSuccess={onLoginSuccess}
        onSignupPress={onSignupPress}
        onGuestBrowse={onGuestBrowse}
      />
    </Container>
  );
};
