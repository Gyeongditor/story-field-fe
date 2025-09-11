import React from 'react';
import styled from '@emotion/native';
import { useRouter } from 'expo-router';
import SpeechInput from '../../features/storyCreation/components/SpeechInput';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
  padding-bottom: 34px; /* iPhone 하단 안전 영역 */
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  padding-top: 60px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
`;

export default function VoiceCreationPage() {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  const handleNext = (audioFile: string) => {
    console.log('✅ 녹음 완료, 다음 단계로:', audioFile);
    // 음성 파일과 함께 텍스트 폼으로 이동
    router.push({
      pathname: '/create/text',
      params: { 
        audioFile: audioFile // 음성 파일 경로 전달
      }
    });
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={handleCancel}>
          <Title>{'‹'}</Title>
        </BackButton>
        <Title>음성으로 만들기</Title>
      </Header>

      <SpeechInput
        onCancel={handleCancel}
        onNext={handleNext}
      />
    </Container>
  );
}