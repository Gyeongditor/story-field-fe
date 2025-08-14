import { View, ScrollView, Alert, Text } from 'react-native';
import styled from '@emotion/native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { BottomNavigation } from '../../shared/ui/BottomNavigation';

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
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  color: #1c1c1e;
  font-size: 22px;
  font-weight: bold;
`;

const HeaderIcons = styled.View`
  flex-direction: row;
  gap: 8px;
`;

const HeaderIcon = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: #f2f2f7;
  align-items: center;
  justify-content: center;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const QuickActionsSection = styled.View`
  margin-bottom: 24px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 16px;
`;

const QuickActionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const QuickActionCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px 16px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const QuickActionIcon = styled.Text`
  font-size: 32px;
  margin-bottom: 8px;
`;

const QuickActionTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1c1c1e;
  text-align: center;
  margin-bottom: 4px;
`;

const QuickActionSubtitle = styled.Text`
  font-size: 12px;
  color: #8e8e93;
  text-align: center;
`;

const FullWidthCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px 16px;
  align-items: center;
  margin: 16px 0;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const RecommendationSection = styled.View`
  margin-bottom: 24px;
`;

const CategoryCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px;
  margin-right: 12px;
  width: 120px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const CategoryIcon = styled.Text`
  font-size: 24px;
  margin-bottom: 8px;
`;

const CategoryTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #1c1c1e;
  text-align: center;
`;

const CategoryScrollView = styled.ScrollView`
  padding-left: 16px;
`;

// 목업 데이터
const mockStories = [
  {
    id: '1',
    title: '용감한 토끼의 모험',
    description: '숲속에서 길을 잃은 토끼가 집으로 돌아가는 이야기',
    createdAt: '2024-01-15',
    category: '모험',
  },
  {
    id: '2',
    title: '마법의 나무',
    description: '소원을 들어주는 신비한 나무를 찾는 소녀의 이야기',
    createdAt: '2024-01-14',
    category: '판타지',
  },
  {
    id: '3',
    title: '친구가 된 고양이와 강아지',
    description: '서로 다른 두 동물이 친구가 되어가는 따뜻한 이야기',
    createdAt: '2024-01-13',
    category: '우정',
  },
];

// 카테고리 데이터
const categories = [
  { id: 'adventure', icon: '🗺️', title: '모험' },
  { id: 'fantasy', icon: '🧚', title: '판타지' },
  { id: 'friendship', icon: '🤝', title: '우정' },
  { id: 'animal', icon: '🐻', title: '동물' },
];

export default function StoriesIndex() {
  const router = useRouter();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new_text':
        Alert.alert('준비중', '새 동화 만들기 기능 준비중입니다.');
        break;
      case 'new_voice':
        Alert.alert('준비중', '새 동화 음성 기능 준비중입니다.');
        break;
      case 'my_stories':
        Alert.alert('준비중', '내 동화(북마크) 기능 준비중입니다.');
        break;
      case 'my_voices':
        Alert.alert('준비중', '내 음성(보이스) 기능 준비중입니다.');
        break;
      case 'recent':
        Alert.alert('준비중', '최근 읽은 동화 기능 준비중입니다.');
        break;
      default:
        break;
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    Alert.alert('카테고리', `${categoryId} 카테고리 동화 목록으로 이동합니다.`);
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>AI 동화</HeaderTitle>
        <HeaderIcons>
         
                     <HeaderIcon onPress={() => Alert.alert('메뉴', '메뉴가 열립니다.')}>
             <Text>☰</Text>
           </HeaderIcon>
          <HeaderIcon onPress={() => Alert.alert('알림', '알림 기능 준비중입니다.')}>
            <Text>🔔</Text>
          </HeaderIcon>
        </HeaderIcons>
      </Header>

      <Content showsVerticalScrollIndicator={false}>
        <QuickActionsSection>
          <SectionTitle>Quick Actions</SectionTitle>
          <QuickActionsGrid>
            <QuickActionCard onPress={() => handleQuickAction('new_text')}>
              <QuickActionIcon>📝</QuickActionIcon>
              <QuickActionTitle>새 동화 텍스트</QuickActionTitle>
              <QuickActionSubtitle>새 동화(텍스트)</QuickActionSubtitle>
            </QuickActionCard>
            
            <QuickActionCard onPress={() => handleQuickAction('new_voice')}>
              <QuickActionIcon>🎤</QuickActionIcon>
              <QuickActionTitle>새 동화 음성</QuickActionTitle>
              <QuickActionSubtitle>새 동화(음성)</QuickActionSubtitle>
            </QuickActionCard>
            
            <QuickActionCard onPress={() => handleQuickAction('my_stories')}>
              <QuickActionIcon>🔖</QuickActionIcon>
              <QuickActionTitle>내 동화</QuickActionTitle>
              <QuickActionSubtitle>내 동화(북마크)</QuickActionSubtitle>
            </QuickActionCard>
            
            <QuickActionCard onPress={() => handleQuickAction('my_voices')}>
              <QuickActionIcon>🎵</QuickActionIcon>
              <QuickActionTitle>내 음성</QuickActionTitle>
              <QuickActionSubtitle>내 동화(보이스)</QuickActionSubtitle>
            </QuickActionCard>
          </QuickActionsGrid>
          
          <FullWidthCard onPress={() => handleQuickAction('recent')}>
            <QuickActionIcon>📖</QuickActionIcon>
            <QuickActionTitle>최근 읽은 동화</QuickActionTitle>
          </FullWidthCard>
        </QuickActionsSection>

        <RecommendationSection>
          <SectionTitle>추천 카테고리</SectionTitle>
          <CategoryScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                onPress={() => handleCategoryPress(category.id)}
              >
                <CategoryIcon>{category.icon}</CategoryIcon>
                <CategoryTitle>{category.title}</CategoryTitle>
              </CategoryCard>
            ))}
          </CategoryScrollView>
        </RecommendationSection>
      </Content>

      <BottomNavigation />
    </Container>
  );
} 