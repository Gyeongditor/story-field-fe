import React, { useState } from 'react';
import styled from '@emotion/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import StoryForm, { StoryFormData } from '../../features/storyCreation/components/StoryForm';
import { generateStoryFromText } from '../../features/storyCreation/api/storyApi';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  padding-top: 56px; /* 7 x 8 */
  padding-bottom: 8px; /* 1 x 8 */
  padding-horizontal: 16px; /* 2 x 8 */
  border-bottom-width: 1px;
  border-bottom-color: #e5e5e5;
  flex-direction: row;
  align-items: center;
  gap: 8px; /* 1 x 8 */
`;

const BackButton = styled.TouchableOpacity`
  width: 32px; /* 4 x 8 */
  height: 32px; /* 4 x 8 */
  align-items: center;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

export default function CreateTextPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ audioFile?: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    router.back();
  };

  const handleComplete = async (storyData: StoryFormData) => {
    console.log('✅ 동화 생성 요청 데이터:', storyData);
    
    try {
      setIsLoading(true);
      
      // API 스펙에 맞게 데이터 변환
      // keyword: 동화 제목, 주인공, 분위기, 그림체, 사투리 조합
      // plot: 스토리 내용
      const keyword = `${storyData.title || 'AI 생성 제목'}, ${storyData.protagonist}, ${storyData.mood}, ${storyData.artStyle}, ${storyData.dialect}`;
      const plot = storyData.content;
      
      console.log('📤 API 요청 데이터:', { keyword, plot });
      
      // 텍스트로 동화 생성 API 호출
      const response = await generateStoryFromText({
        keyword,
        plot
      });
      
      console.log('✅ 텍스트로 동화 생성 성공:', response);
      
      // 생성된 동화로 바로 이동
      router.replace(`/stories/${response.story_id}`);
      
    } catch (error: any) {
      console.error('❌ 텍스트로 동화 생성 실패:', error);
      Alert.alert('생성 실패', error.message || '동화 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioComplete = (storyId: string) => {
    console.log('✅ 음성 파일로 동화 생성 성공:', storyId);
    // 생성된 동화로 바로 이동
    router.replace(`/stories/${storyId}`);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={handleCancel}>
          <Title>{'‹'}</Title>
        </BackButton>
        <Title>새 동화 만들기</Title>
      </Header>

      <StoryForm
        audioFile={params.audioFile}
        onCancel={handleCancel}
        onComplete={handleComplete}
        onAudioComplete={handleAudioComplete}
        isLoading={isLoading}
      />
    </Container>
  );
}


