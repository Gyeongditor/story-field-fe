import React from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import styled from '@emotion/native';
import { useLibraryPage, Filter, SortOption as SortOptionType, Genre, Story } from '../model/useLibraryPage';
import { StoryCard as StoryCardComponent } from '../../StoryCard';
import BottomNavigation from '../../../shared/ui/BottomNavigation';

const Container = styled.View`
  flex: 1;
  background-color: #f8f9fa;
`;

const Header = styled.View`
  background-color: #ffffff;
  padding: 16px;
  padding-top: 56px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  color: #1a1a1a;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const HeaderIcons = styled.View`
  flex-direction: row;
  gap: 12px;
`;

const HeaderIcon = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #f8f9fa;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: #e9ecef;
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const FilterSection = styled.View`
  background-color: #ffffff;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
`;

const FilterTabs = styled.ScrollView`
  margin-bottom: 16px;
`;

const FilterTab = styled.TouchableOpacity<{ active: boolean }>`
  padding: 16px 24px;
  background-color: ${props => (props.active ? '#f3f4f6' : '#ffffff')};
  border-width: 1px;
  border-color: ${props => (props.active ? '#d1d5db' : '#e5e7eb')};
  border-radius: 8px;
  margin-right: 16px;
  min-width: 100px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const FilterTabText = styled.Text<{ active: boolean }>`
  color: ${props => (props.active ? '#374151' : '#6b7280')};
  font-weight: 600;
  font-size: 16px;
`;

const SortSection = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SortLabel = styled.Text`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
`;

const SortOptions = styled.View`
  flex-direction: row;
`;

const SortOptionButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 12px;
  background-color: ${props => (props.active ? '#f3f4f6' : '#ffffff')};
  border-width: 1px;
  border-color: ${props => (props.active ? '#d1d5db' : '#e5e7eb')};
  border-radius: 8px;
  margin-right: 8px;
`;

const SortOptionText = styled.Text<{ active: boolean }>`
  color: ${props => (props.active ? '#374151' : '#6b7280')};
  font-size: 12px;
  font-weight: 500;
`;

const FilterChips = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 6px 12px;
  background-color: ${props => (props.active ? '#dbeafe' : '#f3f4f6')};
  border-width: 1px;
  border-color: ${props => (props.active ? '#3b82f6' : '#e5e7eb')};
  border-radius: 16px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const FilterChipText = styled.Text<{ active: boolean }>`
  color: ${props => (props.active ? '#1e40af' : '#6b7280')};
  font-size: 12px;
  font-weight: 500;
`;

const StoriesSection = styled.View`
  padding: 16px;
  background-color: #f8f9fa;
`;

const StoriesGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;



const EmptyState = styled.View`
  align-items: center;
  padding: 64px 32px;
`;

const EmptyIcon = styled.Text`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.Text`
  color: #6b7280;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
`;

const EmptySubtitle = styled.Text`
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  line-height: 20px;
`;

const LoadMoreButton = styled.TouchableOpacity`
  background-color: #f3f4f6;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin: 16px;
  border-width: 1px;
  border-color: #e5e7eb;
`;

const LoadMoreText = styled.Text`
  color: #6b7280;
  font-weight: 500;
`;

interface LibraryPageProps {
  onStoryPress: (storyId: string) => void;
  onFavoriteToggle: (storyId: string) => void;
  onFilterChange: (filter: Filter) => void;
  onSortChange: (sort: SortOptionType) => void;
  onGenreFilterChange: (genre: Genre) => void;
  onMoodFilterChange: (mood: string) => void;
  onLoadMore: () => void;
  onRefresh: () => void;
  onEditModeToggle: () => void;
  onStoryDelete: (storyId: string) => void;
  filter: Filter;
  sortOption: SortOptionType;
  selectedGenres: Genre[];
  selectedMoods: string[];
  stories: Story[];
  hasMore: boolean;
  isLoading: boolean;
  isEditMode: boolean;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onStoryPress,
  onFavoriteToggle,
  onFilterChange,
  onSortChange,
  onGenreFilterChange,
  onMoodFilterChange,
  onLoadMore,
  onRefresh,
  onEditModeToggle,
  onStoryDelete,
  filter,
  sortOption,
  selectedGenres,
  selectedMoods,
  stories,
  hasMore,
  isLoading,
  isEditMode,
}) => {
  const genres: Genre[] = ['모험', '판타지', '일상', '공포', '로맨스', '액션'];
  const moods = ['신나는', '신비로운', '따뜻한', '긴장감 있는', '로맨틱한'];

  const handleEditPress = () => {
    onEditModeToggle();
  };

  const handleNotificationPress = () => {
    Alert.alert('알림', '알림 기능 준비중입니다.');
  };

  return (
    <Container>
      <Header>
        <HeaderTitle>내 동화</HeaderTitle>
        <HeaderIcons>
          <HeaderIcon onPress={handleEditPress}>
            <Text style={{ fontSize: 18 }}>{isEditMode ? '✓' : '✏️'}</Text>
          </HeaderIcon>
          <HeaderIcon onPress={handleNotificationPress}>
            <Text>🔔</Text>
          </HeaderIcon>
        </HeaderIcons>
      </Header>

      <Content
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <FilterSection>
          <FilterTabs horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16 }}>
            {(['전체', '즐겨찾기'] as Filter[]).map((filterOption) => (
              <FilterTab
                key={filterOption}
                active={filter === filterOption}
                onPress={() => onFilterChange(filterOption)}
              >
                <Text style={{ marginRight: 8, fontSize: 18 }}>
                  {filterOption === '전체' ? '🔄' : '⭐'}
                </Text>
                <FilterTabText active={filter === filterOption}>
                  {filterOption}
                </FilterTabText>
              </FilterTab>
            ))}
          </FilterTabs>

          <SortSection>
            <SortLabel>정렬</SortLabel>
            <SortOptions>
              {(['최신순', '오래된순', '제목순'] as SortOptionType[]).map((sort) => (
                <SortOptionButton
                  key={sort}
                  active={sortOption === sort}
                  onPress={() => onSortChange(sort)}
                >
                  <SortOptionText active={sortOption === sort}>
                    {sort}
                  </SortOptionText>
                </SortOptionButton>
              ))}
            </SortOptions>
          </SortSection>

          <View>
            <Text style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
              장르
            </Text>
            <FilterChips>
              {genres.map((genre) => (
                <FilterChip
                  key={genre}
                  active={selectedGenres.includes(genre)}
                  onPress={() => onGenreFilterChange(genre)}
                >
                  <FilterChipText active={selectedGenres.includes(genre)}>
                    {genre}
                  </FilterChipText>
                </FilterChip>
              ))}
            </FilterChips>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={{ color: '#6b7280', fontSize: 12, fontWeight: 500, marginBottom: 8 }}>
              분위기
            </Text>
            <FilterChips>
              {moods.map((mood) => (
                <FilterChip
                  key={mood}
                  active={selectedMoods.includes(mood)}
                  onPress={() => onMoodFilterChange(mood)}
                >
                  <FilterChipText active={selectedMoods.includes(mood)}>
                    {mood}
                  </FilterChipText>
                </FilterChip>
              ))}
            </FilterChips>
          </View>
        </FilterSection>

        <StoriesSection>
          {stories.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📚</EmptyIcon>
              <EmptyTitle>아직 만든 동화가 없어요</EmptyTitle>
              <EmptySubtitle>
                첫 번째 동화를 만들어보세요!{'\n'}
                AI가 여러분의 상상력을 현실로 만들어드릴 거예요.
              </EmptySubtitle>
            </EmptyState>
          ) : (
            <>
              <StoriesGrid>
                {stories.map((story) => (
                  <StoryCardComponent
                    key={story.id}
                    id={story.id}
                    title={story.title}
                    date={story.date}
                    genre={story.isFavorite ? '즐겨찾기' : '공유'}
                    mood={story.mood}
                    isFavorite={story.isFavorite}
                    cover={story.cover}
                    onPress={onStoryPress}
                    onFavoriteToggle={onFavoriteToggle}
                    isEditMode={isEditMode}
                    onDelete={onStoryDelete}
                  />
                ))}
              </StoriesGrid>

              {hasMore && (
                <LoadMoreButton onPress={onLoadMore}>
                  <LoadMoreText>더 보기</LoadMoreText>
                </LoadMoreButton>
              )}
            </>
          )}
        </StoriesSection>
      </Content>

      <BottomNavigation />
    </Container>
  );
};
