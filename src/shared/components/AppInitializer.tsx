import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { useAuthRestore, useAuthStatus } from '../hooks/useAuth';

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa;
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: #6c757d;
`;

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * 앱 시작 시 인증 상태를 복원하는 컴포넌트
 *
 * 🔄 동작 순서:
 * 1. AsyncStorage에서 토큰 읽기
 * 2. Zustand Store에 복원
 * 3. 완료 후 실제 앱 화면 렌더링
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isLoading } = useAuthStatus();
  const authRestoreQuery = useAuthRestore();

  // 인증 복원이 완료되면 로딩 종료
  useEffect(() => {
    if (!authRestoreQuery.isLoading && !isLoading) {
      // 앱 초기화 완료
    }
  }, [authRestoreQuery.isLoading, isLoading]);

  // 로딩 중이면 스플래시 화면 표시
  if (authRestoreQuery.isLoading || isLoading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color="#007AFF" />
        <LoadingText>앱을 준비하고 있습니다...</LoadingText>
      </LoadingContainer>
    );
  }

  // 로딩 완료 후 실제 앱 렌더링
  return <>{children}</>;
};
