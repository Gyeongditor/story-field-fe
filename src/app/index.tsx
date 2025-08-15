import { View, Text } from "react-native";
import styled from "@emotion/native";
import { Link } from "expo-router";
import { Button } from "../shared/ui/button";
import { BottomNavigation } from "../shared/ui/BottomNavigation";

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #1c1c1e;
  text-align: center;
`;

const Subtitle = styled.Text`
  font-size: 18px;
  color: #8e8e93;
  margin-bottom: 48px;
  text-align: center;
  line-height: 24px;
`;

const ButtonContainer = styled.View`
  width: 100%;
  gap: 16px;
`;

const LinkButton = styled.TouchableOpacity`
  background-color: #007aff;
  padding: 16px 24px;
  border-radius: 16px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const LinkText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
`;

export default function Home() {
  return (
    <Container>
      <Content>
        <Title>🧚‍♀️ Story Field</Title>
        <Subtitle>AI가 만들어주는{'\n'}특별한 동화 이야기</Subtitle>

        <ButtonContainer>
          <Link href="/auth/login" asChild>
            <LinkButton>
              <LinkText>로그인</LinkText>
            </LinkButton>
          </Link>

          <Link href="/stories" asChild>
            <LinkButton>
              <LinkText>스토리 라이브러리 둘러보기</LinkText>
            </LinkButton>
          </Link>
        </ButtonContainer>
      </Content>
      
      <BottomNavigation />
    </Container>
  );
}
