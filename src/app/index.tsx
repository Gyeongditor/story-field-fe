import { View, Text } from 'react-native';
import styled from '@emotion/native';
import { Link } from 'expo-router';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333333;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #666666;
  margin-bottom: 30px;
  text-align: center;
`;

const LinkButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 12px 24px;
  border-radius: 8px;
  margin: 8px;
`;

const LinkText = styled.Text`
  color: white;
  font-weight: 600;
`;

export default function Home() {
  return (
    <Container>
      <Title>Story Field</Title>
      <Subtitle>AI 기반 동화 생성 및 읽기 앱</Subtitle>
      
      <Link href="/auth/login" asChild>
        <LinkButton>
          <LinkText>로그인</LinkText>
        </LinkButton>
      </Link>
      
      <Link href="/stories" asChild>
        <LinkButton>
          <LinkText>스토리 라이브러리</LinkText>
        </LinkButton>
      </Link>
    </Container>
  );
} 