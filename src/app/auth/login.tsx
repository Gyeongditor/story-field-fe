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

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // TODO: 실제 로그인 로직 구현
    if (email && password) {
      Alert.alert('로그인 성공', '환영합니다!');
      router.push('/stories');
    } else {
      Alert.alert('오류', '이메일과 비밀번호를 입력해주세요.');
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
      
      <Button onPress={handleLogin}>
        <ButtonText>로그인</ButtonText>
      </Button>
      
      <LinkText onPress={() => router.push('/auth/signup')}>
        계정이 없으신가요? 회원가입
      </LinkText>
    </Container>
  );
} 