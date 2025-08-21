import React from 'react';
import { LoginPage } from '../../widgets/LoginPage/ui/LoginPage';
import { useLoginPage } from '../../widgets/LoginPage/model/useLoginPage';

export default function LoginScreen() {
  const { handleLoginSuccess, handleSignupPress, handleGuestBrowse } = useLoginPage();

  return (
    <LoginPage
      onLoginSuccess={handleLoginSuccess}
      onSignupPress={handleSignupPress}
      onGuestBrowse={handleGuestBrowse}
    />
  );
} 