import React from 'react';
import { View, Text, Alert } from 'react-native';
import styled from '@emotion/native';
import { BottomNavigation } from '../shared/ui/BottomNavigation';

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

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const SettingSection = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 16px;
`;

const SettingCard = styled.View`
  background-color: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const SettingItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f2f2f7;
`;

const SettingIcon = styled.Text`
  font-size: 20px;
  margin-right: 16px;
  width: 24px;
  text-align: center;
`;

const SettingTextContainer = styled.View`
  flex: 1;
`;

const SettingTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #1c1c1e;
  margin-bottom: 2px;
`;

const SettingSubtitle = styled.Text`
  font-size: 14px;
  color: #8e8e93;
`;

const SettingArrow = styled.Text`
  font-size: 16px;
  color: #c7c7cc;
`;

const LogoutButton = styled.TouchableOpacity`
  background-color: #ff3b30;
  margin: 16px;
  padding: 16px;
  border-radius: 16px;
  align-items: center;
`;

const LogoutText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

export default function SettingsScreen() {
  const handleSettingPress = (setting: string) => {
    Alert.alert('준비중', `${setting} 설정 기능이 준비중입니다.`);
  };

  const handleLogout = () => {
    Alert.alert(
      '로그아웃',
      '정말 로그아웃하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '로그아웃', 
          style: 'destructive',
          onPress: () => Alert.alert('로그아웃', '로그아웃되었습니다.')
        },
      ]
    );
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>설정</HeaderTitle>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <SettingSection>
          <SectionTitle>계정</SectionTitle>
          <SettingCard>
            <SettingItem onPress={() => handleSettingPress('프로필')}>
              <SettingIcon>👤</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>프로필 관리</SettingTitle>
                <SettingSubtitle>이름, 프로필 사진 변경</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>
          </SettingCard>
        </SettingSection>

        <SettingSection>
          <SectionTitle>앱 설정</SectionTitle>
          <SettingCard>
            <SettingItem onPress={() => handleSettingPress('알림')}>
              <SettingIcon>🔔</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>알림 설정</SettingTitle>
                <SettingSubtitle>푸시 알림 관리</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>
            
            <SettingItem onPress={() => handleSettingPress('테마')}>
              <SettingIcon>🎨</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>테마 설정</SettingTitle>
                <SettingSubtitle>다크모드, 컬러 테마</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>

            <SettingItem onPress={() => handleSettingPress('언어')}>
              <SettingIcon>🌐</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>언어 설정</SettingTitle>
                <SettingSubtitle>한국어, English</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>
          </SettingCard>
        </SettingSection>

        <SettingSection>
          <SectionTitle>고객 지원</SectionTitle>
          <SettingCard>
            <SettingItem onPress={() => handleSettingPress('도움말')}>
              <SettingIcon>❓</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>도움말</SettingTitle>
                <SettingSubtitle>자주 묻는 질문</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>

            <SettingItem onPress={() => handleSettingPress('문의')}>
              <SettingIcon>📧</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>문의하기</SettingTitle>
                <SettingSubtitle>고객센터 연락</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>

            <SettingItem onPress={() => handleSettingPress('버전')}>
              <SettingIcon>ℹ️</SettingIcon>
              <SettingTextContainer>
                <SettingTitle>앱 정보</SettingTitle>
                <SettingSubtitle>버전 1.0.0</SettingSubtitle>
              </SettingTextContainer>
              <SettingArrow>›</SettingArrow>
            </SettingItem>
          </SettingCard>
        </SettingSection>

        <LogoutButton onPress={handleLogout}>
          <LogoutText>로그아웃</LogoutText>
        </LogoutButton>
      </Content>

      <BottomNavigation />
    </Container>
  );
}
