import { useEffect, useMemo, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAuthStatus } from '../../../features/auth';

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

// 초기 목업 데이터 (향후 API로 대체)
const initialStories: Story[] = [
  { id: '1', title: '나의 첫 동화', date: '2023-09-01', genre: '모험', mood: '신나는', isFavorite: true, cover: '동화 표지 1' },
  { id: '2', title: '두 번째 동화', date: '2023-08-20', genre: '판타지', mood: '신비로운', isFavorite: false, cover: '동화 표지 2' },
  { id: '3', title: '셋째 동화', date: '2023-07-15', genre: '일상', mood: '따뜻한', isFavorite: true, cover: '동화 표지 3' },
  { id: '4', title: '넷째 동화', date: '2023-06-05', genre: '액션', mood: '긴장감 있는', isFavorite: false, cover: '동화 표지 4' },
  { id: '5', title: '다섯째 동화', date: '2023-05-12', genre: '로맨스', mood: '로맨틱한', isFavorite: true, cover: '동화 표지 5' },
  { id: '6', title: '여섯째 동화', date: '2023-04-08', genre: '공포', mood: '긴장감 있는', isFavorite: false, cover: '동화 표지 6' },
];

export const useLibraryPage = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStatus();
  const [filter, setFilter] = useState<Filter>('전체');
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [stories, setStories] = useState<Story[]>(initialStories);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading]);

  // 필터링된 스토리 목록
  const filteredStories = useMemo(() => {
    let filtered = stories;

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
  }, [stories, filter, selectedGenres, selectedMoods]);

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

  // 페이지네이션 (현재는 모든 데이터 반환, 향후 API 연동 시 수정)
  const paginatedStories = useMemo(() => {
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    return sortedStories.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedStories, page]);

  // 스토리 상세 페이지로 이동
  const handleStoryPress = useCallback((storyId: string) => {
    router.push(`/stories/${storyId}`);
  }, [router]);

  // 즐겨찾기 토글
  const handleFavoriteToggle = useCallback((storyId: string) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === storyId 
          ? { ...story, isFavorite: !story.isFavorite }
          : story
      )
    );
  }, []);

  // 필터 변경
  const handleFilterChange = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
    setPage(1); // 필터 변경 시 첫 페이지로
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
    setPage(1);
  }, []);

  // 분위기 필터 변경
  const handleMoodFilterChange = useCallback((mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
    setPage(1);
  }, []);

  // 무한 스크롤 (더 많은 데이터 로드)
  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
      // 실제 API 연동 시에는 여기서 데이터 로드
      if (page >= 3) { // 목업 데이터 제한
        setHasMore(false);
      }
    }
  }, [hasMore, page]);

  // 새로고침
  const handleRefresh = useCallback(() => {
    setPage(1);
    setHasMore(true);
    // 실제 API 연동 시에는 여기서 데이터 새로고침
  }, []);

  // 수정 모드 토글
  const handleEditModeToggle = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  // 스토리 삭제
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
            // 상태에서 삭제
            setStories(prevStories => prevStories.filter(story => story.id !== storyId));
            // 실제 API 연동 시에는 여기서 삭제 API 호출 후 상태 업데이트
            Alert.alert('삭제 완료', '동화가 삭제되었습니다.');
          }
        }
      ]
    );
  }, []);

  return {
    // 상태
    isAuthenticated,
    isLoading,
    filter,
    sortOption,
    selectedGenres,
    selectedMoods,
    stories: paginatedStories,
    hasMore,
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
