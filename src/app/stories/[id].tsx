import { View, ScrollView, Alert } from 'react-native';
import styled from '@emotion/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

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

const BackButtonText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
  flex: 1;
`;

const Content = styled.ScrollView`
  padding: 24px;
`;

const StoryImage = styled.View`
  width: 100%;
  height: 240px;
  border-radius: 16px;
  background-color: #f3f4f6;
  margin-bottom: 24px;
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

const StoryTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 8px;
  line-height: 36px;
`;

const StoryMeta = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
`;

const StoryContent = styled.Text`
  font-size: 16px;
  line-height: 28px;
  color: #374151;
  margin-bottom: 32px;
`;

const ControlsContainer = styled.View`
  background-color: #f9fafb;
  padding: 24px;
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  border-top-width: 1px;
  border-top-color: #f0f0f0;
`;

const ControlRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const ControlButton = styled.TouchableOpacity`
  background-color: #3b82f6;
  padding: 16px;
  border-radius: 8px;
  flex: 1;
  align-items: center;
`;

const ControlButtonText = styled.Text`
  color: white;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
`;

const VoiceSelector = styled.View`
  margin-bottom: 24px;
`;

const VoiceLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 12px;
`;

const VoiceOptions = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const VoiceOption = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#3b82f6' : '#f3f4f6'};
  padding: 12px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
`;

const VoiceOptionText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : '#374151'};
  font-size: 14px;
  font-weight: 500;
`;

// 목업 데이터
const mockStoryData: Record<string, {
  title: string;
  category: string;
  createdAt: string;
  content: string;
}> = {
  '1': {
    title: '방금 생성된 나만의 동화',
    category: '새로 만든 이야기',
    createdAt: new Date().toLocaleDateString('ko-KR'),
    content: `🎭 **여러분만의 특별한 동화가 완성되었습니다!**

방금 전 입력해주신 내용을 바탕으로 AI가 창작한 동화입니다.

📖 **이야기의 시작**
여러분이 선택한 주인공과 함께 떠나는 특별한 모험이 시작됩니다. 

선택하신 분위기와 그림체, 그리고 사투리가 어우러져 더욱 생동감 넘치는 이야기가 되었어요.

🌟 **마법 같은 순간들**
이 동화에는 여러분의 상상력과 따뜻한 마음이 가득 담겨 있습니다. 

매 페이지마다 새로운 발견과 감동이 기다리고 있어요.

🎨 **나만의 스타일**
입력해주신 모든 요소들이 하나의 완성된 작품으로 탄생했습니다.

✨ **여러분만의 특별한 동화 여행이 지금 시작됩니다!**

언제든지 새로운 동화를 만들어 더 많은 상상의 세계를 탐험해 보세요!`,
  },
  '2': {
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
            <BackButtonText>‹</BackButtonText>
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
          <BackButtonText>‹</BackButtonText>
        </BackButton>
        <HeaderTitle>동화 읽기</HeaderTitle>
      </Header>

      <Content>
        <StoryImage>
          <PlaceholderIcon>🏰</PlaceholderIcon>
        </StoryImage>
        
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