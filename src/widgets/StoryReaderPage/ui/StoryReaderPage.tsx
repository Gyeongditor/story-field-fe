import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from '@emotion/native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
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

const ContentContainer = styled.View`
  flex: 1;
  flex-direction: row;
`;

const ImageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
`;

const StoryImage = styled.Image`
  width: 100%;
  height: 100%;
  resize-mode: contain;
`;

const ImageLoadingContainer = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: #1a1a1a;
`;

const StoryContainer = styled.View`
  flex: 1;
  padding: 32px;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

const StoryTitle = styled.Text`
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
  line-height: 36px;
`;

const StoryContent = styled.Text`
  color: #ffffff;
  font-size: 18px;
  line-height: 28px;
  text-align: center;
  opacity: 0.9;
`;

const NavigationContainer = styled.View`
  position: absolute;
  bottom: 32px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
`;

const NavButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${props => props.disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'};
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.5 : 1};
  backdrop-filter: blur(10px);
`;

const NavButtonText = styled.Text`
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
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

interface StoryReaderPageProps {
  currentPage: number;
  totalPages: number;
  storyTitle: string;
  storyContent: string;
  imageUrl: string;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const StoryReaderPage: React.FC<StoryReaderPageProps> = ({
  currentPage,
  totalPages,
  storyTitle,
  storyContent,
  imageUrl,
  onBack,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // 첫 페이지에서만 스와이프 힌트를 2초간 보여주기
  useEffect(() => {
    if (currentPage === 1) {
      setShowSwipeHint(true);
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setShowSwipeHint(false);
    }
  }, [currentPage]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context: any) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      
      // 스와이프 중일 때 투명도 조절
      const progress = Math.abs(event.translationX) / (screenWidth * 0.3);
      opacity.value = interpolate(progress, [0, 1], [1, 0.7], Extrapolate.CLAMP);
    },
    onEnd: (event) => {
      const threshold = screenWidth * 0.3;
      
      if (event.translationX > threshold && canGoPrevious) {
        runOnJS(onPrevious)();
      } else if (event.translationX < -threshold && canGoNext) {
        runOnJS(onNext)();
      }
      
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={onBack}>
          <BackButtonText>←</BackButtonText>
        </BackButton>
        <PageIndicator>
          <PageIndicatorText>{currentPage} / {totalPages}</PageIndicatorText>
        </PageIndicator>
      </Header>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
          <ContentContainer>
            <ImageContainer>
              <StoryImage 
                source={{ uri: imageUrl }} 
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {imageLoading && (
                <ImageLoadingContainer>
                  <ActivityIndicator size="large" color="#ffffff" />
                </ImageLoadingContainer>
              )}
            </ImageContainer>
            <StoryContainer>
              <StoryTitle>{storyTitle}</StoryTitle>
              <StoryContent>{storyContent}</StoryContent>
            </StoryContainer>
          </ContentContainer>
        </Animated.View>
      </PanGestureHandler>

      <NavigationContainer>
        <NavButton onPress={onPrevious} disabled={!canGoPrevious}>
          <NavButtonText>‹</NavButtonText>
        </NavButton>
        <NavButton onPress={onNext} disabled={!canGoNext}>
          <NavButtonText>›</NavButtonText>
        </NavButton>
      </NavigationContainer>

      {totalPages > 1 && showSwipeHint && (
        <SwipeHint>
          <SwipeHintText>좌우로 스와이프하여 페이지를 넘기세요</SwipeHintText>
        </SwipeHint>
      )}
    </Container>
  );
};
