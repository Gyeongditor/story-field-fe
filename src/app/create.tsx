import React from 'react';
import { View, Text, Alert } from 'react-native';
import styled from '@emotion/native';
import BottomNavigation from '../shared/ui/BottomNavigation';
import { useRouter } from 'expo-router';

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
`;

const HeaderTitle = styled.Text`
  color: #1c1c1e;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const CreateCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 32px 24px;
  margin-bottom: 16px;
  width: 100%;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const CreateIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const CreateTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 8px;
  text-align: center;
`;

const CreateSubtitle = styled.Text`
  font-size: 14px;
  color: #8e8e93;
  text-align: center;
`;

export default function CreateScreen() {
  const router = useRouter();
  const handleCreateOption = (type: string) => {
    if (type === '텍스트') {
      router.push('/create/text');
      return;
    }
    if (type === '음성') {
      router.push('/create/voice');
      return;
    }
    Alert.alert('준비중', `${type} 생성 기능이 준비중입니다.`);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>새 동화 만들기</HeaderTitle>
      </Header>

      <Content>
        <CreateCard onPress={() => handleCreateOption('텍스트')}>
          <CreateIcon>📝</CreateIcon>
          <CreateTitle>텍스트로 만들기</CreateTitle>
          <CreateSubtitle>키워드나 문장으로{'\n'}동화를 생성해보세요</CreateSubtitle>
        </CreateCard>

        <CreateCard onPress={() => handleCreateOption('음성')}>
          <CreateIcon>🎤</CreateIcon>
          <CreateTitle>음성으로 만들기</CreateTitle>
          <CreateSubtitle>목소리로 이야기하면{'\n'}동화로 만들어드려요</CreateSubtitle>
        </CreateCard>
      </Content>

      <BottomNavigation />
    </Container>
  );
}
