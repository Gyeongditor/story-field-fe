import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { Dimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

export interface StoryPage {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

// 목업 데이터 - 5개의 동화 페이지
const mockStoryPages: StoryPage[] = [
  {
    id: '1',
    title: '마법의 숲으로의 여행',
    content: '한 아이가 마법의 숲을 발견했습니다. 나무들은 빛을 내며 말을 걸어왔고, 꽃들은 노래를 불렀습니다. 아이는 이 신비로운 세계에 깊이 빠져들었습니다. 숲 속에는 작은 요정들이 살고 있었고, 그들은 아이에게 마법의 열쇠를 주었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '2',
    title: '구름 위의 성',
    content: '하늘 높이 떠 있는 구름 위에 아름다운 성이 있었습니다. 그곳에는 날개 달린 사람들이 살고 있었고, 항상 행복한 노래가 울려 퍼졌습니다. 아이는 구름을 타고 성에 도착했고, 하늘의 비밀을 알게 되었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '3',
    title: '바다 속 보물',
    content: '깊은 바다 속에는 신비로운 보물들이 숨어있었습니다. 물고기들은 친구가 되어 아이를 안내했고, 함께 보물을 찾아 나섰습니다. 바다의 깊은 곳에는 고대 문명의 흔적도 남아있었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '4',
    title: '달나라 토끼',
    content: '달에는 흰 토끼가 살고 있었습니다. 토끼는 떡을 만들며 아이들에게 꿈을 선물했고, 밤하늘을 밝게 비추었습니다. 달나라에는 별들이 꽃처럼 피어있었고, 아이는 그곳에서 평화를 찾았습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c2e4a9c2?w=800&h=600&fit=crop&crop=center'
  },
  {
    id: '5',
    title: '시간의 문',
    content: '마지막 페이지에서 아이는 시간의 문을 발견했습니다. 그 문을 열면 새로운 모험이 시작되고, 또 다른 동화가 펼쳐질 것입니다. 아이는 이제 자신만의 이야기를 만들어갈 준비가 되었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
  }
];

export const useStoryReaderPage = (storyId: string) => {
  const router = useRouter();
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);

  // 화면 방향 감지
  useEffect(() => {
    const checkOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setIsLandscape(width > height);
    };

    // 초기 방향 체크
    checkOrientation();

    // 화면 방향 변경 감지
    const subscription = Dimensions.addEventListener('change', checkOrientation);

    return () => {
      subscription?.remove();
    };
  }, []);

  // 가로 모드로 강제 전환
  useEffect(() => {
    const lockToLandscape = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.log('화면 방향 변경 실패:', error);
      }
    };

    lockToLandscape();

    // 컴포넌트 언마운트 시 세로 모드로 복원
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const currentPage = mockStoryPages[currentPageIndex];
  const totalPages = mockStoryPages.length;

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handlePrevious = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  }, [currentPageIndex]);

  const handleNext = useCallback(() => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  }, [currentPageIndex, totalPages]);

  const canGoPrevious = currentPageIndex > 0;
  const canGoNext = currentPageIndex < totalPages - 1;

  return {
    currentPage,
    currentPageIndex: currentPageIndex + 1, // 1부터 시작하는 페이지 번호
    totalPages,
    isLandscape,
    handleBack,
    handlePrevious,
    handleNext,
    canGoPrevious,
    canGoNext,
  };
};
