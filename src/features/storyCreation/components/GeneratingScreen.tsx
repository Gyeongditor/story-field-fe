import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import styled from '@emotion/native';
// import { apiClient } from '../../../shared/lib/apiClient';
import { StoryFormData } from './StoryForm';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const Content = styled.View`
  align-items: center;
  width: 100%;
  max-width: 320px;
`;

const StoryImage = styled.View`
  width: 200px;
  height: 200px;
  border-radius: 16px;
  background-color: #f3f4f6;
  margin-bottom: 32px;
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const PlaceholderIcon = styled.Text`
  font-size: 64px;
  color: #9ca3af;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: #1f1f1f;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 40px;
  line-height: 24px;
`;

const ProgressContainer = styled.View`
  width: 100%;
  margin-bottom: 16px;
`;

const ProgressBackground = styled.View`
  width: 100%;
  height: 8px;
  background-color: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.View<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #3b82f6;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const ProgressText = styled.Text`
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
`;

const LoadingDots = styled.Text`
  font-size: 16px;
  color: #3b82f6;
  text-align: center;
`;

interface GeneratingScreenProps {
  storyData?: StoryFormData;
  onComplete: (storyId: string) => void;
  onError: () => void;
}

export default function GeneratingScreen({ storyData, onComplete, onError }: GeneratingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    // TODO: 실제 동화 생성 API 호출
    // const generateStory = async () => {
    //   try {
    //     const response = await apiClient.post('/api/stories/generate', storyData);
    //     const storyId = response.data.id;
    //     onComplete(storyId);
    //   } catch (error) {
    //     console.error('동화 생성 실패:', error);
    //     Alert.alert('생성 실패', '동화 생성 중 오류가 발생했습니다.');
    //     onError();
    //   }
    // };

    // 프로그레스바 애니메이션 (10초 동안) - 목업용
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // 완료 후 리더 화면으로 이동 (목업 데이터)
          setTimeout(() => {
            onComplete('1'); // 임시 ID - 실제로는 생성된 스토리 ID 사용
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 100); // 10초 = 10000ms / 100단계 = 100ms 간격

    // 로딩 도트 애니메이션
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [storyData, onComplete, onError]);

  // 실제 API 연동 시 사용할 로그
  useEffect(() => {
    if (storyData) {
      console.log('✅ 동화 생성 요청 데이터:', storyData);
    }
  }, [storyData]);

  return (
    <Container>
      <Content>
        <StoryImage>
          <PlaceholderIcon>📚</PlaceholderIcon>
        </StoryImage>

        <Title>동화를 생성하고 있어요</Title>
        <Subtitle>
          AI가 당신만의 특별한 동화를{'\n'}
          만들고 있습니다
        </Subtitle>

        <ProgressContainer>
          <ProgressBackground>
            <ProgressBar progress={progress} />
          </ProgressBackground>
          <ProgressText>{progress}% 완료</ProgressText>
        </ProgressContainer>

        <LoadingDots>생성 중{loadingDots}</LoadingDots>
      </Content>
    </Container>
  );
}
