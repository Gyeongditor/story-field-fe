import { View, ScrollView, Alert, TextInput } from 'react-native';
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

const EditButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 16px;
`;

const EditButtonText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
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

const StoryTitleInput = styled.TextInput`
  font-size: 28px;
  font-weight: 700;
  color: #1f1f1f;
  margin-bottom: 8px;
  line-height: 36px;
  border-width: 1px;
  border-color: #3b82f6;
  border-radius: 8px;
  padding: 8px;
  background-color: #f8fafc;
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

const StoryContentInput = styled.TextInput`
  font-size: 16px;
  line-height: 28px;
  color: #374151;
  margin-bottom: 32px;
  border-width: 1px;
  border-color: #3b82f6;
  border-radius: 8px;
  padding: 12px;
  background-color: #f8fafc;
  min-height: 200px;
  text-align-vertical: top;
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
  gap: 12px;
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

const VoiceOptions = styled.ScrollView`
  flex-direction: row;
`;

const VoiceOption = styled.TouchableOpacity<{ selected: boolean }>`
  background-color: ${props => props.selected ? '#3b82f6' : '#f3f4f6'};
  padding: 12px 16px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  margin-right: 8px;
  min-width: 80px;
`;

const VoiceOptionText = styled.Text<{ selected: boolean }>`
  color: ${props => props.selected ? 'white' : '#374151'};
  font-size: 14px;
  font-weight: 500;
  text-align: center;
`;

// 목업 데이터
const mockStoryData: Record<string, {
  title: string;
  category: string;
  createdAt: string;
  content: string;
}> = {
  '1': {
    title: '너의 특별한 하루',
    category: '일상 • 따뜻한',
    createdAt: '2024-01-15',
    content: `🌅 **새로운 하루의 시작**

오늘은 정말 특별한 하루가 될 것 같아요. 
아침에 일어나자마자 창문 밖으로 따뜻한 햇살이 스며들어와 마음까지 포근해졌어요.

☕ **소중한 아침 시간**
엄마가 끓여주신 따뜻한 우유 한 잔과 함께 하루를 시작했어요. 
달콤한 향기가 온 집안을 가득 채우며 행복한 기분을 만들어주었답니다.

🌸 **작은 발견들**
학교 가는 길에서 예쁜 꽃들을 발견했어요. 
작은 것들에서도 큰 기쁨을 찾을 수 있다는 걸 깨달았답니다.

👫 **소중한 사람들**
친구들과 함께 웃고 이야기하며 보낸 시간들이 얼마나 소중한지 다시 한 번 느꼈어요.

✨ **하루의 마무리**
오늘 하루도 감사한 마음으로 마무리하며, 
내일도 또 다른 특별한 하루가 되기를 기대해봅니다.`,
  },
  '2': {
    title: '마법의 숲 모험',
    category: '판타지 • 신나는',
    createdAt: '2024-01-10',
    content: `🌲 **신비로운 숲의 입구**

깊고 신비로운 마법의 숲에는 특별한 비밀이 숨겨져 있어요.
용감한 모험가만이 그 비밀을 발견할 수 있답니다.

✨ **마법의 시작**
숲속에서 반짝이는 요정들을 만났어요.
요정들은 마법의 지팡이로 길을 밝혀주었답니다.

🦄 **환상적인 만남**
무지개색 갈기를 가진 유니콘과 친구가 되었어요.
함께 하늘을 날며 구름 위를 걸어보았답니다.

🏰 **마법 성의 발견**
숲 깊숙한 곳에서 아름다운 마법 성을 발견했어요.
그곳에서 지혜로운 마법사를 만나 소중한 교훈을 배웠답니다.`,
  },
  '3': {
    title: '용감한 기사의 이야기',
    category: '모험 • 긴장감 있는',
    createdAt: '2024-01-05',
    content: `⚔️ **기사의 출발**

용감한 기사 아서는 왕국을 지키기 위해 위험한 여행을 떠났어요.
무서운 용을 물리치고 공주님을 구해야 하는 중요한 임무였답니다.

🐉 **용과의 대결**
높은 탑에서 무시무시한 용이 불을 뿜고 있었어요.
하지만 아서 기사는 용기를 잃지 않고 맞섰답니다.

👸 **공주의 구출**
지혜와 용기로 용을 물리친 아서 기사는 공주님을 무사히 구출했어요.
왕국의 모든 사람들이 기뻐하며 환영해주었답니다.

🏆 **영웅의 귀환**
용감한 기사의 이야기는 오늘날까지도 전해져 내려와
모든 이들에게 용기와 희망을 주고 있어요.`,
  },
  '4': {
    title: '바닷가의 작은 집',
    category: '일상 • 따뜻한',
    createdAt: '2023-12-28',
    content: `🏖️ **파도 소리가 들리는 집**

바닷가 언덕 위에 작고 예쁜 집이 하나 있어요.
매일 아침 파도 소리를 들으며 하루를 시작하는 특별한 집이랍니다.

🐚 **바다의 선물들**
해변을 산책하며 예쁜 조개껍데기와 반짝이는 돌멩이를 주워요.
바다가 주는 작은 선물들로 집을 꾸며보았답니다.

🌅 **아름다운 일몰**
매일 저녁 창문으로 보이는 일몰이 너무나 아름다워요.
하늘이 주황색과 분홍색으로 물들며 마법 같은 순간을 선사해줍니다.

💙 **평화로운 일상**
바닷바람과 함께하는 평범하지만 소중한 일상이
얼마나 행복한 것인지 깨닫게 되었답니다.`,
  },
  '5': {
    title: '별빛 아래의 약속',
    category: '로맨스 • 로맨틱한',
    createdAt: '2023-12-20',
    content: `⭐ **반짝이는 밤하늘**

깊은 밤, 수많은 별들이 반짝이는 하늘 아래에서
두 사람은 특별한 약속을 나누었어요.

🌙 **달빛 아래의 만남**
은은한 달빛이 두 사람을 비추며 로맨틱한 분위기를 연출했어요.
서로의 마음을 확인하는 소중한 시간이었답니다.

💫 **영원한 약속**
별똥별이 떨어지는 순간, 두 사람은 영원히 함께하겠다고 약속했어요.
그 약속은 별들이 증인이 되어주었답니다.

💕 **사랑의 시작**
별빛 아래에서 시작된 아름다운 사랑 이야기는
오늘도 계속되고 있어요.`,
  },
};

const dialectOptions = ['표준어', '경상도', '전라북도', '전라남도', '충청도', '강원도', '제주도'];

export default function StoryDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedDialect, setSelectedDialect] = useState('표준어');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');

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

  // 수정 모드 진입 시 초기값 설정
  const handleEditMode = () => {
    if (!isEditMode) {
      setEditedTitle(story.title);
      setEditedContent(story.content);
    }
    setIsEditMode(!isEditMode);
  };

  // 수정 완료
  const handleSaveEdit = () => {
    // 실제로는 API 호출로 데이터 저장
    Alert.alert('수정 완료', '동화 내용이 수정되었습니다.');
    setIsEditMode(false);
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditedTitle(story.title);
    setEditedContent(story.content);
  };

  const handleShare = () => {
    Alert.alert('공유', '동화를 공유하는 기능을 준비중입니다.');
  };

  const handleReadBook = () => {
    router.push(`/stories/${id}/read`);
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => router.back()}>
          <BackButtonText>‹</BackButtonText>
        </BackButton>
        <HeaderTitle>동화 읽기</HeaderTitle>
        <EditButton onPress={handleEditMode}>
          <EditButtonText>{isEditMode ? '✓' : '✏️'}</EditButtonText>
        </EditButton>
      </Header>

      <Content>
        <StoryImage>
          <PlaceholderIcon>🏰</PlaceholderIcon>
        </StoryImage>
        
        {isEditMode ? (
          <StoryTitleInput
            value={editedTitle}
            onChangeText={setEditedTitle}
            placeholder="동화 제목을 입력하세요"
            multiline
          />
        ) : (
          <StoryTitle>{story.title}</StoryTitle>
        )}
        
        <StoryMeta>{story.category} • {story.createdAt}</StoryMeta>
        
        {isEditMode ? (
          <StoryContentInput
            value={editedContent}
            onChangeText={setEditedContent}
            placeholder="동화 내용을 입력하세요"
            multiline
          />
        ) : (
          <StoryContent>{story.content}</StoryContent>
        )}
      </Content>

      <ControlsContainer>
        {isEditMode ? (
          <ControlRow>
            <ControlButton onPress={handleSaveEdit} style={{ backgroundColor: '#10b981' }}>
              <ControlButtonText>저장</ControlButtonText>
            </ControlButton>
            <ControlButton onPress={handleCancelEdit} style={{ backgroundColor: '#6b7280' }}>
              <ControlButtonText>취소</ControlButtonText>
            </ControlButton>
          </ControlRow>
        ) : (
          <>
            <VoiceSelector>
              <VoiceLabel>사투리 선택</VoiceLabel>
              <VoiceOptions horizontal showsHorizontalScrollIndicator={false}>
                {dialectOptions.map((dialect) => (
                  <VoiceOption
                    key={dialect}
                    selected={selectedDialect === dialect}
                    onPress={() => setSelectedDialect(dialect)}
                  >
                    <VoiceOptionText selected={selectedDialect === dialect}>
                      {dialect}
                    </VoiceOptionText>
                  </VoiceOption>
                ))}
              </VoiceOptions>
            </VoiceSelector>

            <ControlRow>
              <ControlButton onPress={handleShare}>
                <ControlButtonText>공유</ControlButtonText>
              </ControlButton>
              
              <ControlButton onPress={handleReadBook}>
                <ControlButtonText>책 읽기</ControlButtonText>
              </ControlButton>
            </ControlRow>
          </>
        )}
      </ControlsContainer>
    </Container>
  );
} 