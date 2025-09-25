import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useAuthStatus } from '../../../features/auth';
import { fetchMainStories } from '../../../entities/story/story.service';
import type { MainStoryItem } from '../../../entities/story/story.types';

export type Filter = '전체' | '즐겨찾기';
export type SortOption = '최신순' | '오래된순' | '제목순';
export type Genre = '모험' | '판타지' | '일상' | '공포' | '로맨스' | '액션';

export interface Story {
  id: string;
  title: string;
  date: string;
  genre: Genre;
  mood: string;
  isFavorite: boolean;
  cover: string;
}

// 목데이터
const mockStories: Story[] = [
  {
    id: '1',
    title: '너의 특별한 하루',
    date: '2024-01-15',
    genre: '일상',
    mood: '따뜻한',
    isFavorite: true,
    cover: 'https://picsum.photos/300/400?random=1'
  },
  {
    id: '2',
    title: '마법의 숲 모험',
    date: '2024-01-10',
    genre: '판타지',
    mood: '신나는',
    isFavorite: false,
    cover: 'https://picsum.photos/300/400?random=2'
  },
  {
    id: '3',
    title: '용감한 기사의 이야기',
    date: '2024-01-05',
    genre: '모험',
    mood: '긴장감 있는',
    isFavorite: true,
    cover: 'https://picsum.photos/300/400?random=3'
  },
  {
    id: '4',
    title: '바닷가의 작은 집',
    date: '2023-12-28',
    genre: '일상',
    mood: '따뜻한',
    isFavorite: false,
    cover: 'https://picsum.photos/300/400?random=4'
  },
  {
    id: '5',
    title: '별빛 아래의 약속',
    date: '2023-12-20',
    genre: '로맨스',
    mood: '로맨틱한',
    isFavorite: true,
    cover: 'https://picsum.photos/300/400?random=5'
  }
];

// API 응답을 UI 모델로 변환하는 함수
const mapApiStoryToUiStory = (apiStory: MainStoryItem): Story => ({
  id: apiStory.storyId,
  title: apiStory.storyTitle,
  date: new Date().toISOString().split('T')[0], // 임시로 현재 날짜 사용
  genre: '판타지', // 기본값 설정
  mood: '신나는', // 기본값 설정
  isFavorite: false, // 기본값 설정
  cover: apiStory.thumbnailUrl || '기본 표지'
});

export const useLibraryPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const [filter, setFilter] = useState<Filter>('전체');
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // 임시로 목데이터 사용 (추후 API 연동 시 주석 해제)
  const [isLoading, setIsLoading] = useState(false);
  
  // 스토리 목록 쿼리 (API 연동 시 사용)
  /*
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: storiesLoading,
    refetch
  } = useInfiniteQuery<Story[], Error>({
    queryKey: ['stories', 'main'],
    queryFn: async ({ pageParam }) => {
      const stories = await fetchMainStories(pageParam as number);
      return stories.map(mapApiStoryToUiStory);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: Story[], allPages: Story[][]) => {
      return lastPage.length === 0 ? undefined : allPages.length;
    },
    enabled: isAuthenticated,
  });
  */

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, authLoading]);

  // 모든 스토리 목록 (목데이터 사용)
  const allStories = useMemo(() => {
    return mockStories;
  }, []);

  // 필터링된 스토리 목록
  const filteredStories = useMemo(() => {
    let filtered = allStories;

    // 즐겨찾기 필터
    if (filter === '즐겨찾기') {
      filtered = filtered.filter(story => story.isFavorite);
    }

    // 장르 필터
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(story => selectedGenres.includes(story.genre));
    }

    // 분위기 필터
    if (selectedMoods.length > 0) {
      filtered = filtered.filter(story => selectedMoods.includes(story.mood));
    }

    return filtered;
  }, [allStories, filter, selectedGenres, selectedMoods]);

  // 정렬된 스토리 목록
  const sortedStories = useMemo(() => {
    const sorted = [...filteredStories];
    
    switch (sortOption) {
      case '최신순':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case '오래된순':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case '제목순':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sorted;
    }
  }, [filteredStories, sortOption]);

  // 스토리 상세 페이지로 이동
  const handleStoryPress = useCallback((storyId: string) => {
    router.push(`/stories/${storyId}`);
  }, [router]);

  // 즐겨찾기 토글 (임시 구현)
  const handleFavoriteToggle = useCallback((storyId: string) => {
    // TODO: API 연동 시 서버에 즐겨찾기 상태 업데이트
    Alert.alert('준비중', '즐겨찾기 기능은 준비중입니다.');
  }, []);

  // 필터 변경
  const handleFilterChange = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
  }, []);

  // 정렬 변경
  const handleSortChange = useCallback((newSort: SortOption) => {
    setSortOption(newSort);
  }, []);

  // 장르 필터 변경
  const handleGenreFilterChange = useCallback((genre: Genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  }, []);

  // 분위기 필터 변경
  const handleMoodFilterChange = useCallback((mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  }, []);

  // 무한 스크롤 (더 많은 데이터 로드) - 목데이터에서는 비활성화
  const handleLoadMore = useCallback(() => {
    // 목데이터 사용 중이므로 추가 로드 없음
  }, []);

  // 새로고침 - 목데이터에서는 비활성화
  const handleRefresh = useCallback(() => {
    // 목데이터 사용 중이므로 새로고침 없음
  }, []);

  // 수정 모드 토글
  const handleEditModeToggle = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  // 스토리 삭제 (임시 구현)
  const handleStoryDelete = useCallback((storyId: string) => {
    Alert.alert(
      '동화 삭제',
      '정말로 이 동화를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '삭제', 
          style: 'destructive',
          onPress: () => {
            // TODO: API 연동 시 서버에서 삭제 후 상태 업데이트
            Alert.alert('준비중', '삭제 기능은 준비중입니다.');
          }
        }
      ]
    );
  }, []);

  return {
    // 상태
    isAuthenticated,
    isLoading: authLoading || isLoading,
    filter,
    sortOption,
    selectedGenres,
    selectedMoods,
    stories: sortedStories,
    hasMore: false, // 목데이터 사용 중이므로 더 이상 로드할 데이터 없음
    isEditMode,
    
    // 핸들러
    handleStoryPress,
    handleFavoriteToggle,
    handleFilterChange,
    handleSortChange,
    handleGenreFilterChange,
    handleMoodFilterChange,
    handleLoadMore,
    handleRefresh,
    handleEditModeToggle,
    handleStoryDelete,
  };
};
