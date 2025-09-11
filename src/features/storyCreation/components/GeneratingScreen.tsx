import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import styled from '@emotion/native';
import { generateStoryFromText } from '../api/storyApi';
import { StoryFormData } from './StoryForm';
import { GenerateStoryFromTextRequest } from '../../../shared/types/api';

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
    if (!storyData) {
      onError();
      return;
    }

    // StoryFormData를 API 요청 형식으로 변환
    const convertToApiRequest = (data: StoryFormData): GenerateStoryFromTextRequest => {
      // 키워드는 주인공만 사용 (단일 키워드)
      const keyword = data.protagonist;
      
      // 플롯은 제목, 내용, 분위기, 그림체, 사투리를 모두 포함
      const plot = data.title 
        ? `${data.title}\n\n${data.content}\n\n분위기: ${data.mood}, 그림체: ${data.artStyle}, 사투리: ${data.dialect}`
        : `${data.content}\n\n분위기: ${data.mood}, 그림체: ${data.artStyle}, 사투리: ${data.dialect}`;
      
      return {
        keyword,
        plot
      };
    };

    const generateStory = async () => {
      try {
        const apiRequest = convertToApiRequest(storyData);
        console.log('✅ 동화 생성 API 요청:', apiRequest);
        
        const response = await generateStoryFromText(apiRequest);
        console.log('✅ 동화 생성 성공:', response);
        
        // 프로그레스바를 100%로 설정
        setProgress(100);
        
        // 완료 후 리더 화면으로 이동
        setTimeout(() => {
          onComplete(response.story_id);
        }, 500);
        
      } catch (error: any) {
        console.error('❌ 동화 생성 실패:', error);
        Alert.alert('생성 실패', error.message || '동화 생성 중 오류가 발생했습니다.');
        onError();
      }
    };

    // 프로그레스바 애니메이션 (실제 API 호출과 함께 진행)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { // 90%까지만 프로그레스바로 진행
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);

    // 로딩 도트 애니메이션
    const dotsInterval = setInterval(() => {
      setLoadingDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    // API 호출 시작
    generateStory();

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
    };
  }, [storyData, onComplete, onError]);


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
