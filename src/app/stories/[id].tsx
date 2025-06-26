import { View, ScrollView, Alert } from 'react-native';
import styled from '@emotion/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Header = styled.View`
  background-color: #007AFF;
  padding: 20px;
  padding-top: 60px;
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 15px;
`;

const BackButtonText = styled.Text`
  color: white;
  font-size: 18px;
`;

const HeaderTitle = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
`;

const Content = styled.ScrollView`
  padding: 20px;
`;

const StoryTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 10px;
`;

const StoryMeta = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-bottom: 20px;
`;

const StoryContent = styled.Text`
  font-size: 16px;
  line-height: 24px;
  color: #333333;
  margin-bottom: 30px;
`;

const ControlsContainer = styled.View`
  background-color: #f8f8f8;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

const ControlRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ControlButton = styled.TouchableOpacity`
  background-color: #007AFF;
  padding: 12px 20px;
  border-radius: 8px;
  flex: 1;
  margin: 0 5px;
`;

const ControlButtonText = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
`;

const VoiceSelector = styled.View`
  margin-bottom: 15px;
`;

const VoiceLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 10px;
`;

const VoiceOptions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const VoiceOption = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#007AFF' : '#e0e0e0'};
  padding: 8px 12px;
  border-radius: 6px;
  margin: 4px;
`;

const VoiceOptionText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : '#333333'};
  font-size: 14px;
`;

// 목업 데이터
const mockStoryData: Record<string, {
  title: string;
  category: string;
  createdAt: string;
  content: string;
}> = {
  '1': {
    title: '용감한 토끼의 모험',
    category: '모험',
    createdAt: '2024-01-15',
    content: `옛날 옛적 깊은 숲속에 작은 토끼 한 마리가 살고 있었습니다.

토끼의 이름은 초롱이였어요. 초롱이는 매일 숲속을 뛰어다니며 놀기를 좋아했습니다.

어느 날, 초롱이는 평소보다 더 멀리 나가서 놀다가 길을 잃어버렸습니다. 해가 지기 시작하자 초롱이는 무서워하기 시작했어요.

"엄마, 아빠... 어디에 계세요?" 초롱이는 울먹이며 말했습니다.

그때 한 마리의 지혜로운 부엉이가 나타났습니다.

"어린 토끼야, 왜 울고 있니?" 부엉이가 물었습니다.

"집으로 가는 길을 잃어버렸어요." 초롱이가 대답했습니다.

부엉이는 친절하게 초롱이에게 집으로 가는 길을 알려주었고, 초롱이는 무사히 가족들과 만날 수 있었습니다.

그날 이후 초롱이는 더 이상 너무 멀리 나가지 않았고, 항상 부모님께 어디로 가는지 말씀드렸답니다.`,
  },
};

const voiceOptions = ['기본 음성', '엄마 목소리', '아빠 목소리', '할머니 목소리', '동화 음성'];

export default function StoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedVoice, setSelectedVoice] = useState('기본 음성');
  const [isPlaying, setIsPlaying] = useState(false);

  const story = mockStoryData[id as string];

  if (!story) {
    return (
      <Container>
        <Header>
          <BackButton onPress={() => router.back()}>
            <BackButtonText>← 뒤로</BackButtonText>
          </BackButton>
          <HeaderTitle>스토리를 찾을 수 없습니다</HeaderTitle>
        </Header>
      </Container>
    );
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    Alert.alert(
      isPlaying ? '일시정지' : '재생',
      `${selectedVoice}로 동화를 ${isPlaying ? '일시정지' : '재생'}합니다.`
    );
  };

  const handleShare = () => {
    Alert.alert('공유', '동화를 공유하는 기능을 준비중입니다.');
  };

  const handleBookmark = () => {
    Alert.alert('북마크', '북마크에 추가되었습니다.');
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <BackButtonText>← 뒤로</BackButtonText>
        </BackButton>
        <HeaderTitle>동화 읽기</HeaderTitle>
      </Header>

      <Content>
        <StoryTitle>{story.title}</StoryTitle>
        <StoryMeta>{story.category} • {story.createdAt}</StoryMeta>
        <StoryContent>{story.content}</StoryContent>
      </Content>

      <ControlsContainer>
        <VoiceSelector>
          <VoiceLabel>음성 선택</VoiceLabel>
          <VoiceOptions>
            {voiceOptions.map((voice) => (
              <VoiceOption
                key={voice}
                selected={selectedVoice === voice}
                onPress={() => setSelectedVoice(voice)}
              >
                <VoiceOptionText selected={selectedVoice === voice}>
                  {voice}
                </VoiceOptionText>
              </VoiceOption>
            ))}
          </VoiceOptions>
        </VoiceSelector>

        <ControlRow>
          <ControlButton onPress={handlePlayPause}>
            <ControlButtonText>
              {isPlaying ? '일시정지' : '재생'}
            </ControlButtonText>
          </ControlButton>
          
          <ControlButton onPress={handleBookmark}>
            <ControlButtonText>북마크</ControlButtonText>
          </ControlButton>
          
          <ControlButton onPress={handleShare}>
            <ControlButtonText>공유</ControlButtonText>
          </ControlButton>
        </ControlRow>
      </ControlsContainer>
    </Container>
  );
} 