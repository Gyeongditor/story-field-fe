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
  const params = useLocalSearchParams<{ voiceText?: string }>();

  const handleCancel = () => {
    router.back();
  };

  const handleComplete = (storyData: StoryFormData) => {
    console.log('✅ 동화 생성 요청 데이터:', storyData);
    
    // TODO: 실제 API 연동 시 데이터 전달
    // router.push({
    //   pathname: '/create/generating',
    //   params: storyData
    // });
    
    // 목업용 - 폼 데이터 없이 로딩 화면 이동
    router.push('/create/generating');
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
        initialVoiceText={params.voiceText}
        onCancel={handleCancel}
        onComplete={handleComplete}
      />
    </Container>
  );
}


