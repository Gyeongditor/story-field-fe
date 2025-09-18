import React from 'react';
import { View, Text, ActivityIndicator, TextInput, Alert } from 'react-native';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  background-color: #ffffff;
  padding: 16px;
  padding-top: 56px;
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const BackIcon = styled.Text`
  font-size: 18px;
  color: #007aff;
`;

const HeaderTitle = styled.Text`
  color: #1c1c1e;
  font-size: 22px;
  font-weight: bold;
  flex: 1;
  text-align: center;
  margin-right: 42px; /* 뒤로가기 버튼 공간만큼 오프셋 */
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const Section = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 16px;
`;

const Card = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const ProfileImageSection = styled.View`
  align-items: center;
  padding: 24px;
`;

const ProfileImageContainer = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: #f2f2f7;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

const ProfileImageText = styled.Text`
  font-size: 32px;
  color: #8e8e93;
`;

const ChangePhotoButton = styled.TouchableOpacity`
  padding: 8px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: #007aff;
`;

const ChangePhotoText = styled.Text`
  color: #007aff;
  font-size: 14px;
  font-weight: 500;
`;

const FormField = styled.View`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f2f7;
`;

const FieldLabel = styled.Text<{ error?: boolean }>`
  font-size: 14px;
  color: ${props => props.error ? '#ff3b30' : '#8e8e93'};
  margin-bottom: 8px;
`;

const FieldInput = styled.TextInput<{ error?: boolean }>`
  font-size: 16px;
  color: #1c1c1e;
  padding: 0;
  min-height: 20px;
  border-width: ${props => props.error ? '1px' : '0px'};
  border-color: ${props => props.error ? '#ff3b30' : 'transparent'};
  border-radius: ${props => props.error ? '4px' : '0px'};
  padding: ${props => props.error ? '8px' : '0px'};
`;

const SaveButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#ccc' : '#007aff'};
  margin: 16px;
  padding: 16px;
  border-radius: 16px;
  align-items: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const DeleteAccountButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#ccc' : '#ff3b30'};
  margin: 16px;
  margin-top: 8px;
  padding: 16px;
  border-radius: 16px;
  align-items: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const DeleteAccountText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  color: #8e8e93;
  font-size: 16px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const ErrorText = styled.Text`
  color: #ff3b30;
  font-size: 16px;
  text-align: center;
  margin-bottom: 16px;
`;

const RetryButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 12px 24px;
  border-radius: 8px;
`;

const RetryButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

interface ProfilePageProps {
  // 데이터
  profile: {
    email: string;
    username: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  
  // 폼 상태
  formData: {
    email: string;
    username: string;
    password: string;
    passwordConfirm: string;
  };
  
  // 액션 상태
  isSaving: boolean;
  isDeleting: boolean;
  hasChanges: boolean;
  
  // 핸들러
  onBack: () => void;
  onFormChange: (field: 'email' | 'username' | 'password' | 'passwordConfirm', value: string) => void;
  onSave: () => void;
  onDeleteAccount: () => void;
  onRetry: () => void;
  onChangePhoto: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  isLoading,
  error,
  formData,
  isSaving,
  isDeleting,
  hasChanges,
  onBack,
  onFormChange,
  onSave,
  onDeleteAccount,
  onRetry,
  onChangePhoto
}) => {
  // 로딩 상태
  if (isLoading) {
    return (
      <Container>
        <Header>
          <BackButton onPress={onBack}>
            <BackIcon>‹</BackIcon>
          </BackButton>
          <HeaderTitle>프로필 관리</HeaderTitle>
        </Header>
        <LoadingContainer>
          <ActivityIndicator size="large" color="#007aff" />
          <LoadingText>프로필 정보를 불러오는 중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onPress={onBack}>
            <BackIcon>‹</BackIcon>
          </BackButton>
          <HeaderTitle>프로필 관리</HeaderTitle>
        </Header>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onPress={onRetry}>
            <RetryButtonText>다시 시도</RetryButtonText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <BackIcon>‹</BackIcon>
        </BackButton>
        <HeaderTitle>프로필 관리</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        {/* 프로필 이미지 섹션 */}
        <Section>
          <Card>
            <ProfileImageSection>
              <ProfileImageContainer>
                <ProfileImageText>👤</ProfileImageText>
              </ProfileImageContainer>
              <ChangePhotoButton onPress={onChangePhoto}>
                <ChangePhotoText>사진 변경</ChangePhotoText>
              </ChangePhotoButton>
            </ProfileImageSection>
          </Card>
        </Section>

        {/* 계정 정보 섹션 */}
        <Section>
          <SectionTitle>계정 정보</SectionTitle>
          <Card>
            <FormField>
              <FieldLabel>이메일</FieldLabel>
              <FieldInput
                value={formData.email}
                onChangeText={(value) => onFormChange('email', value)}
                placeholder="이메일을 입력하세요"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </FormField>
            
            <FormField>
              <FieldLabel>사용자명</FieldLabel>
              <FieldInput
                value={formData.username}
                onChangeText={(value) => onFormChange('username', value)}
                placeholder="사용자명을 입력하세요"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </FormField>
            
            <FormField>
              <FieldLabel>새 비밀번호 (선택사항)</FieldLabel>
              <FieldInput
                value={formData.password}
                onChangeText={(value) => onFormChange('password', value)}
                placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </FormField>
            
            <FormField style={{ borderBottomWidth: 0 }}>
              <FieldLabel 
                error={
                  formData.password.length > 0 && 
                  formData.passwordConfirm.length > 0 && 
                  formData.password !== formData.passwordConfirm
                }
              >
                비밀번호 확인
                {formData.password.length > 0 && formData.passwordConfirm.length > 0 && (
                  formData.password === formData.passwordConfirm ? ' ✓' : ' ✗'
                )}
              </FieldLabel>
              <FieldInput
                value={formData.passwordConfirm}
                onChangeText={(value) => onFormChange('passwordConfirm', value)}
                placeholder="비밀번호를 다시 입력하세요"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={formData.password.length > 0}
                error={
                  formData.password.length > 0 && 
                  formData.passwordConfirm.length > 0 && 
                  formData.password !== formData.passwordConfirm
                }
                style={{ 
                  opacity: formData.password.length > 0 ? 1 : 0.5 
                }}
              />
            </FormField>
          </Card>
        </Section>

        {/* 저장 버튼 */}
        <SaveButton 
          onPress={isSaving ? undefined : onSave} 
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <SaveButtonText>변경사항 저장</SaveButtonText>
          )}
        </SaveButton>

        {/* 계정 삭제 버튼 */}
        <DeleteAccountButton 
          onPress={isDeleting ? undefined : onDeleteAccount} 
          disabled={isDeleting || isSaving}
        >
          {isDeleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <DeleteAccountText>회원 탈퇴</DeleteAccountText>
          )}
        </DeleteAccountButton>
      </Content>
    </Container>
  );
};
