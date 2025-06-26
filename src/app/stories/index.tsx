import { View, ScrollView, Alert } from 'react-native';
import styled from '@emotion/native';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';

const Container = styled.View`
  flex: 1;
  background-color: #f5f5f5;
`;

const Header = styled.View`
  background-color: #007AFF;
  padding: 20px;
  padding-top: 60px;
`;

const HeaderTitle = styled.Text`
  color: white;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SearchContainer = styled.View`
  padding: 20px;
  background-color: white;
`;

const SearchInput = styled.TextInput`
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #333333;
  padding: 0 20px 10px;
`;

const StoryCard = styled.TouchableOpacity`
  background-color: white;
  margin: 8px 20px;
  border-radius: 12px;
  padding: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const StoryTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333333;
  margin-bottom: 8px;
`;

const StoryDescription = styled.Text`
  font-size: 14px;
  color: #666666;
  margin-bottom: 8px;
`;

const StoryMeta = styled.Text`
  font-size: 12px;
  color: #999999;
`;

const CreateButton = styled.TouchableOpacity`
  background-color: #007AFF;
  margin: 20px;
  padding: 16px;
  border-radius: 12px;
  align-items: center;
`;

const CreateButtonText = styled.Text`
  color: white;
  font-size: 18px;
  font-weight: 600;
`;

// 목업 데이터
const mockStories = [
  {
    id: '1',
    title: '용감한 토끼의 모험',
    description: '숲속에서 길을 잃은 토끼가 집으로 돌아가는 이야기',
    createdAt: '2024-01-15',
    category: '모험',
  },
  {
    id: '2',
    title: '마법의 나무',
    description: '소원을 들어주는 신비한 나무를 찾는 소녀의 이야기',
    createdAt: '2024-01-14',
    category: '판타지',
  },
  {
    id: '3',
    title: '친구가 된 고양이와 강아지',
    description: '서로 다른 두 동물이 친구가 되어가는 따뜻한 이야기',
    createdAt: '2024-01-13',
    category: '우정',
  },
];

export default function StoriesIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleStoryPress = (storyId: string) => {
    router.push(`/stories/${storyId}`);
  };

  const handleCreateStory = () => {
    Alert.alert('동화 생성', '음성으로 생성하시겠습니까?', [
      { text: '텍스트로 생성', onPress: () => Alert.alert('준비중', '텍스트 생성 기능 준비중입니다.') },
      { text: '음성으로 생성', onPress: () => Alert.alert('준비중', '음성 생성 기능 준비중입니다.') },
      { text: '취소', style: 'cancel' },
    ]);
  };

  const filteredStories = mockStories.filter(story =>
    story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    story.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>스토리 라이브러리</HeaderTitle>
      </Header>

      <SearchContainer>
        <SearchInput
          placeholder="스토리 검색..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </SearchContainer>

      <ScrollView>
        <CreateButton onPress={handleCreateStory}>
          <CreateButtonText>+ 새 동화 만들기</CreateButtonText>
        </CreateButton>

        <Section>
          <SectionTitle>내 동화들</SectionTitle>
          {filteredStories.map((story) => (
            <StoryCard
              key={story.id}
              onPress={() => handleStoryPress(story.id)}
            >
              <StoryTitle>{story.title}</StoryTitle>
              <StoryDescription>{story.description}</StoryDescription>
              <StoryMeta>{story.category} • {story.createdAt}</StoryMeta>
            </StoryCard>
          ))}
        </Section>
      </ScrollView>
    </Container>
  );
} 