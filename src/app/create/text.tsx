import React from 'react';
import styled from '@emotion/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import StoryForm, { StoryFormData } from '../../features/storyCreation/components/StoryForm';

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

  const handleCancel = () => {
    router.back();
  };

  const handleComplete = (storyData: StoryFormData) => {
    console.log('✅ 동화 생성 요청 데이터:', storyData);
    
    // storyData를 generating 화면으로 전달
    router.push({
      pathname: '/create/generating',
      params: {
        storyData: JSON.stringify(storyData)
      }
    });
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
      />
    </Container>
  );
}


