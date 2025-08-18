import React, { useState, useMemo } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { signupUser, type SignupData } from '../../../entities/user';

const Container = styled.View`
  width: 100%;
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

const Button = styled.TouchableOpacity<{ disabled?: boolean }>`
  background-color: ${props => props.disabled ? '#cccccc' : '#007AFF'};
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const ButtonText = styled.Text<{ disabled?: boolean }>`
  color: ${props => props.disabled ? '#666666' : 'white'};
  text-align: center;
  font-size: 18px;
  font-weight: 600;
`;

const LinkText = styled.Text`
  color: #007AFF;
  text-align: center;
  margin-top: 20px;
`;

const ErrorText = styled.Text`
  color: #ef4444;
  text-align: center;
  margin-bottom: 16px;
  font-size: 14px;
`;

const PasswordMatchText = styled.Text<{ isMatch: boolean }>`
  color: ${props => props.isMatch ? '#10b981' : '#ef4444'};
  font-size: 12px;
  margin-top: -12px;
  margin-bottom: 16px;
  text-align: right;
`;

interface SignupFormProps {
  onSignupSuccess?: () => void;
  onLoginPress?: () => void;
}

export default function SignupForm({ onSignupSuccess, onLoginPress }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMatch = password === confirmPassword;
  const isValid = useMemo(() => {
    if (!name || !email || !password || !confirmPassword) return false;
    if (!passwordsMatch) return false;
    if (password.length < 6) return false;
    return true;
  }, [name, email, password, confirmPassword, passwordsMatch]);

  const handleSignUp = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const signupData: SignupData = { 
        email, 
        password, 
        name 
      };
      
      await signupUser(signupData);

      Alert.alert(
        '회원가입 완료',
        '입력하신 이메일로 인증 링크를 보냈어요. 메일함에서 인증을 완료해 주세요.',
        [
          {
            text: '확인',
            onPress: onSignupSuccess,
          },
        ]
      );
    } catch (error: any) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message;
      
      console.error('회원가입 실패:', error);
      
      // 사용자 친화적 에러 메시지
      if (status === 409) {
        setError('이미 존재하는 이메일입니다.');
      } else if (status === 422) {
        setError('입력 정보를 확인해주세요.');
      } else {
        setError('회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>회원가입</Title>

      {error && <ErrorText>{error}</ErrorText>}

      <Input
        placeholder="사용자명"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setError(null);
        }}
        autoCapitalize="none"
        editable={!isSubmitting}
      />
      
      <Input
        placeholder="이메일"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(null);
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isSubmitting}
      />
      
      <Input
        placeholder="비밀번호 (최소 6자)"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(null);
        }}
        secureTextEntry
        editable={!isSubmitting}
      />
      
      <Input
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          setError(null);
        }}
        secureTextEntry
        editable={!isSubmitting}
      />
      
      {confirmPassword && (
        <PasswordMatchText isMatch={passwordsMatch}>
          {passwordsMatch ? '✓ 비밀번호가 일치합니다' : '✗ 비밀번호가 일치하지 않습니다'}
        </PasswordMatchText>
      )}
      
      <Button 
        onPress={handleSignUp} 
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <ButtonText disabled={!isValid}>회원가입</ButtonText>
        )}
      </Button>

      <LinkText onPress={onLoginPress}>
        이미 계정이 있으신가요? 로그인
      </LinkText>
    </Container>
  );
}
