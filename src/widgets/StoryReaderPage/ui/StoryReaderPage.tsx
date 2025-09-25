import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import styled from '@emotion/native';
// @ts-ignore - 복사한 PageFlipper 컴포넌트 사용
import PageFlipper from '../../../shared/components/PageFlipper/index';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #000000;
`;

const Header = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  padding-top: 56px;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
`;

const BackButtonText = styled.Text`
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
`;

const PageIndicator = styled.View`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
`;

const PageIndicatorText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
`;



const SwipeHint = styled.View`
  position: absolute;
  top: 50%;
  left: 16px;
  right: 16px;
  align-items: center;
  opacity: 0.6;
`;

const SwipeHintText = styled.Text`
  color: #ffffff;
  font-size: 14px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 8px 16px;
  border-radius: 20px;
`;

interface StoryPageData {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
}

interface StoryReaderPageProps {
  pages: StoryPageData[];
  initialPage?: number;
  onBack: () => void;
  onPageChange?: (pageIndex: number) => void;
}

export const StoryReaderPage: React.FC<StoryReaderPageProps> = ({
  pages,
  initialPage = 0,
  onBack,
  onPageChange,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // 첫 페이지에서만 스와이프 힌트를 2초간 보여주기
  useEffect(() => {
    if (currentPageIndex === 0) {
      setShowSwipeHint(true);
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowSwipeHint(false);
    }
  }, [currentPageIndex]);

  const handlePageChange = (pageIndex: number) => {
    setCurrentPageIndex(pageIndex);
    onPageChange?.(pageIndex);
  };

  const renderStoryPage = (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return null;

    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#000000',
      }}>
        {/* 왼쪽 절반 - 이미지 */}
        <View style={{
          flex: 1,
          backgroundColor: '#1a1a1a',
        }}>
          <Image 
            source={{ uri: page.imageUrl }} 
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'cover',
            }}
          />
        </View>

        {/* 오른쪽 절반 - 텍스트 */}
        <View style={{
          flex: 1,
          backgroundColor: '#000000',
          padding: 40,
          justifyContent: 'center',
        }}>
          <Text style={{
            color: '#ffffff',
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 24,
            textAlign: 'center',
            lineHeight: 32,
          }}>
            {page.title}
          </Text>
          <Text style={{
            color: '#ffffff',
            fontSize: 16,
            lineHeight: 24,
            textAlign: 'justify',
            opacity: 0.95,
          }}>
            {page.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <BackButtonText>←</BackButtonText>
        </BackButton>
        <PageIndicator>
          <PageIndicatorText>{currentPageIndex + 1} / {pages.length}</PageIndicatorText>
        </PageIndicator>
      </Header>

      <View style={{ flex: 1, width: screenWidth, height: screenHeight }}>
        <PageFlipper
          data={pages.map(page => page.id)}
          pageSize={{ width: screenWidth, height: screenHeight }}
          contentContainerStyle={{ 
            flex: 1,
            width: screenWidth,
            height: screenHeight,
            backgroundColor: '#000000',
          }}
          singleImageMode={false}
          portrait={false}
          onFlippedEnd={handlePageChange}
          renderPage={renderStoryPage}
        />
      </View>

      {pages.length > 1 && showSwipeHint && (
        <SwipeHint>
          <SwipeHintText>좌우로 스와이프하여 페이지를 넘기세요</SwipeHintText>
        </SwipeHint>
      )}
    </Container>
  );
};
