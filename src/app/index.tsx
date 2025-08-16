import { View, ScrollView, Alert, Text } from 'react-native';
import styled from '@emotion/native';
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import BottomNavigation from "../shared/ui/BottomNavigation";
import { useAuthStatus } from '../shared/hooks/useAuth';

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  background-color: #ffffff;
  padding: 16px;
  padding-top: 56px; /* 7 x 8 */
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
  gap: 8px; /* 1 x 8 */
`;

const HeaderIcon = styled.TouchableOpacity`
  width: 32px; /* 4 x 8 */
  height: 32px; /* 4 x 8 */
  border-radius: 16px; /* 2 x 8 */
  background-color: #f2f2f7;
  align-items: center;
  justify-content: center;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 16px; /* 2 x 8 */
`;

const QuickActionsSection = styled.View`
  margin-bottom: 24px; /* 3 x 8 */
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1c1c1e;
  margin-bottom: 16px; /* 2 x 8 */
`;

const QuickActionsGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px; /* 1 x 8 */
`;

const QuickActionCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #ffffff;
  border-radius: 16px; /* 2 x 8 */
  padding: 24px 16px; /* 3 x 8 , 2 x 8 */
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const QuickActionIcon = styled.Text`
  font-size: 32px; /* 4 x 8 */
  margin-bottom: 8px; /* 1 x 8 */
`;

const QuickActionTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #1c1c1e;
  text-align: center;
  margin-bottom: 8px; /* 1 x 8 */
`;

const QuickActionSubtitle = styled.Text`
  font-size: 12px;
  color: #8e8e93;
  text-align: center;
`;

const FullWidthCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 16px; /* 2 x 8 */
  padding: 24px 16px; /* 3 x 8 , 2 x 8 */
  align-items: center;
  margin: 16px 0; /* 2 x 8 */
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const RecommendationSection = styled.View`
  margin-bottom: 24px; /* 3 x 8 */
`;

const CategoryCard = styled.TouchableOpacity`
  background-color: #ffffff;
  border-radius: 16px; /* 2 x 8 */
  padding: 16px; /* 2 x 8 */
  margin-right: 16px; /* 2 x 8 */
  width: 128px; /* 16 x 8 */
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 4px;
  elevation: 2;
`;

const CategoryIcon = styled.Text`
  font-size: 24px;
  margin-bottom: 8px; /* 1 x 8 */
`;

const CategoryTitle = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: #1c1c1e;
  text-align: center;
`;

const CategoryScrollView = styled.ScrollView`
  padding-left: 16px; /* 2 x 8 */
`;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const params = useLocalSearchParams<{ guest?: string }>();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && params.guest !== '1') {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, params.guest]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new_text':
        Alert.alert('준비중', '새 동화 만들기 기능 준비중입니다.');
        break;
      case 'new_voice':
        Alert.alert('준비중', '새 동화 음성 기능 준비중입니다.');
        break;
      case 'my_stories':
        router.push('/stories');
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

  if (!isLoading && !isAuthenticated && params.guest !== '1') {
    return null;
  }

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
            {[
              { id: 'adventure', icon: '🗺️', title: '모험' },
              { id: 'fantasy', icon: '🧚', title: '판타지' },
              { id: 'friendship', icon: '🤝', title: '우정' },
              { id: 'animal', icon: '🐻', title: '동물' },
            ].map((category) => (
              <CategoryCard
                key={category.id}
                onPress={() => Alert.alert('카테고리', `${category.id} 카테고리 동화 목록으로 이동합니다.`)}
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
