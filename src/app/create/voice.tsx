import React from 'react';
import styled from '@emotion/native';
import { useRouter } from 'expo-router';
import SpeechInput from '../../features/storyCreation/components/SpeechInput';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
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

  const handleComplete = (text: string) => {
    console.log('✅ STT 성공:', text);
    // 음성 → 텍스트 폼으로 이동 (2단계 폼 진행)
    router.push({
      pathname: '/create/text',
      params: { voiceText: text }
    });
    // TODO: 음성으로 바로 동화 생성하는 경우
    // router.push('/create/generating');
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
        onComplete={handleComplete}
      />
    </Container>
  );
}