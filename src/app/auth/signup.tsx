import { View, Alert } from 'react-native';
import styled from '@emotion/native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

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

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = () => {
    // TODO: 실제 회원가입 로직 구현
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('오류', '모든 필드를 입력해주세요.');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('오류', '비밀번호가 일치하지 않습니다.');
      return;
    }
    
    Alert.alert('회원가입 성공', '계정이 생성되었습니다!');
    router.push('/auth/login');
  };

  return (
    <Container>
      <Title>회원가입</Title>
      
      <Input
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      
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
      
      <Input
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <Button onPress={handleSignUp}>
        <ButtonText>회원가입</ButtonText>
      </Button>
      
      <LinkText onPress={() => router.push('/auth/login')}>
        이미 계정이 있으신가요? 로그인
      </LinkText>
    </Container>
  );
} 