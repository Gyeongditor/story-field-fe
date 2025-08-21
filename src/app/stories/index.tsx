import { View, ScrollView, Alert, Text } from 'react-native';
import styled from '@emotion/native';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import BottomNavigation from '../../shared/ui/BottomNavigation';
import { useAuthStatus } from '../../features/auth';

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  background-color: #ffffff;
  padding: 16px; /* 2 x 8 */
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
  padding: 16px; /* 2 x 8 */
`;

const FilterBar = styled.View`
  flex-direction: row;
  gap: 8px; /* 1 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px; /* 1 x 8, 2 x 8 */
  background-color: ${props => (props.active ? '#007AFF' : '#ffffff')};
  border-width: 1px;
  border-color: ${props => (props.active ? '#007AFF' : '#e5e5e5')};
  border-radius: 16px; /* 2 x 8 */
`;

const FilterText = styled.Text<{ active: boolean }>`
  color: ${props => (props.active ? '#ffffff' : '#1c1c1e')};
  font-weight: 600;
`;

const Grid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 16px; /* 2 x 8 */
`;

const StoryCard = styled.TouchableOpacity`
  width: 48%;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: #e5e5e5;
`;

const Badge = styled.View`
  position: absolute;
  top: 8px; /* 1 x 8 */
  left: 8px; /* 1 x 8 */
  background-color: #f2f2f7;
  padding: 4px 8px; /* 0.5 x 8, 1 x 8 */
  border-radius: 8px; /* 1 x 8 */
`;

const BadgeText = styled.Text`
  font-size: 12px;
  color: #6b7280;
`;

const Cover = styled.View`
  background-color: #f3f4f6;
  height: 128px; /* 16 x 8 */
  align-items: center;
  justify-content: center;
`;

const CoverText = styled.Text`
  color: #9ca3af;
`;

const CardBody = styled.View`
  padding: 12px; /* 1.5 x 8 */
  gap: 8px; /* 1 x 8 */
`;

const StoryTitle = styled.Text`
  font-weight: 600;
  color: #1f2937;
`;

const StoryDate = styled.Text`
  color: #6b7280;
  font-size: 12px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 8px; /* 1 x 8 */
`;

const EmptyText = styled.Text`
  margin-top: 32px; /* 4 x 8 */
  text-align: center;
  color: #9ca3af;
`;

// 목업 데이터 (스크린샷과 유사한 형태)
const mockStories = [
  { id: '1', title: '나의 첫 동화', date: '2023-09-01', cover: '동화 표지 1', tag: '즐겨찾기' },
  { id: '2', title: '두 번째 동화', date: '2023-08-20', cover: '동화 표지 2', tag: '공유' },
  { id: '3', title: '셋째 동화', date: '2023-07-15', cover: '동화 표지 3', tag: '즐겨찾기' },
  { id: '4', title: '넷째 동화', date: '2023-06-05', cover: '동화 표지 4', tag: '공유' },
];

type Filter = '전체' | '즐겨찾기' | '공유';

export default function StoriesIndex() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [filter, setFilter] = useState<Filter>('전체');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  const filtered = useMemo(() => {
    if (filter === '전체') return mockStories;
    return mockStories.filter(s => s.tag === filter);
  }, [filter]);

  if (!isLoading && !isAuthenticated) {
    return null;
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>내 동화</HeaderTitle>
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
        <FilterBar>
          {(['전체', '즐겨찾기', '공유'] as Filter[]).map(key => (
            <FilterChip key={key} active={filter === key} onPress={() => setFilter(key)}>
              <FilterText active={filter === key}>{key}</FilterText>
            </FilterChip>
          ))}
        </FilterBar>

        {filtered.length === 0 ? (
          <EmptyText>아직 만든 동화가 없어요</EmptyText>
        ) : (
          <Grid>
            {filtered.map((story) => (
              <StoryCard key={story.id} onPress={() => router.push(`/stories/${story.id}`)}>
                <View>
                  <Cover>
                    <CoverText>{story.cover}</CoverText>
                  </Cover>
                  <Badge>
                    <BadgeText>{story.tag}</BadgeText>
                  </Badge>
                </View>
                <CardBody>
                  <StoryTitle>{story.title}</StoryTitle>
                  <StoryDate>{story.date}</StoryDate>
                  <Row>
                    <Text>⭐</Text>
                    <Text>✏️</Text>
                    <Text>🔗</Text>
                  </Row>
                </CardBody>
              </StoryCard>
            ))}
          </Grid>
        )}
      </Content>

      <BottomNavigation />
    </Container>
  );
}