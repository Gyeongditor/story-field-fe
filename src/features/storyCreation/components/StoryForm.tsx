import React, { useMemo, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from '@emotion/native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { generateStoryFromAudio } from '../api/storyApi';

const Container = styled.View`
  flex: 1;
  background-color: #ffffff;
`;

const Content = styled(ScrollView)`
  flex: 1;
  padding: 16px; /* 2 x 8 */
`;

const Label = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px; /* 1 x 8 */
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-color: #e5e7eb;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 12px; /* 1.5 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
  height: 48px; /* 6 x 8 - 일정한 높이 */
`;

const StepIndicator = styled.View`
  flex-direction: row;
  gap: 8px; /* 1 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
`;

const Dot = styled.View<{ active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${p => (p.active ? '#111827' : '#e5e7eb')};
`;

const Card = styled.View`
  border-width: 1px;
  border-color: #e5e7eb;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 16px; /* 2 x 8 */
`;

const SectionTitle = styled.Text`
  font-weight: 600;
  color: #111827;
  margin-bottom: 12px; /* 1.5 x 8 */
`;

const ChipRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px; /* 1 x 8 */
`;

const Chip = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 16px; /* 1 x 8, 2 x 8 */
  border-radius: 16px; /* 2 x 8 */
  border-width: 1px;
  border-color: ${p => (p.active ? '#111827' : '#e5e7eb')};
  background-color: ${p => (p.active ? '#111827' : '#ffffff')};
`;

const ChipText = styled.Text<{ active: boolean }>`
  color: ${p => (p.active ? '#ffffff' : '#111827')};
  font-weight: 600;
`;

// 제목 생성 방식 선택을 위한 새로운 스타일 컴포넌트들
const TitleMethodSelector = styled.View`
  margin-bottom: 16px; /* 2 x 8 */
`;

const MethodLabel = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px; /* 1 x 8 */
`;

const MethodButtons = styled.View`
  flex-direction: row;
  gap: 8px; /* 1 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
`;

const MethodButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: 12px 16px; /* 1.5 x 8, 2 x 8 */
  border-radius: 12px;
  border-width: 1px;
  border-color: ${props => props.active ? '#3b82f6' : '#e5e7eb'};
  background-color: ${props => props.active ? '#3b82f6' : '#ffffff'};
  align-items: center;
  flex-direction: row;
  justify-content: center;
  gap: 6px; /* 0.75 x 8 */
`;

const MethodButtonText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.active ? '#ffffff' : '#374151'};
`;

const MethodIcon = styled.Text`
  font-size: 16px;
`;

const TitleInputContainer = styled.View`
  margin-bottom: 16px; /* 2 x 8 */
  min-height: 48px; /* 6 x 8 - 일정한 높이 유지 */
`;



const GeneratedTitleCard = styled.View`
  background-color: #f0f9ff;
  border-width: 1px;
  border-color: #0ea5e9;
  border-radius: 12px;
  padding: 16px; /* 2 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
`;

const GeneratedTitleLabel = styled.Text`
  font-size: 12px;
  color: #0369a1;
  margin-bottom: 8px; /* 1 x 8 */
  font-weight: 500;
`;

const GeneratedTitleText = styled.Text`
  font-size: 16px;
  color: #0c4a6e;
  font-weight: 600;
  line-height: 24px;
`;



const Footer = styled.View`
  flex-direction: row;
  gap: 16px; /* 2 x 8 */
  padding: 16px; /* 2 x 8 */
  border-top-width: 1px;
  border-top-color: #e5e7eb;
  background-color: #ffffff;
`;

const GhostButton = styled.TouchableOpacity`
  flex: 1;
  padding: 14px; /* ~1.75 x 8 */
  border-radius: 12px;
  border-width: 1px;
  border-color: #111827;
  align-items: center;
`;

const GhostText = styled.Text`
  color: #111827;
  font-weight: 600;
`;

const PrimaryButton = styled.TouchableOpacity`
  flex: 1;
  padding: 14px;
  border-radius: 12px;
  background-color: #111827;
  align-items: center;
`;

const PrimaryText = styled.Text`
  color: #ffffff;
  font-weight: 600;
`;

interface StoryFormProps {
  audioFile?: string;
  onCancel: () => void;
  onComplete: (data: StoryFormData) => void;
  onAudioComplete?: (storyId: string) => void;
}

export interface StoryFormData {
  title: string;
  protagonist: string;
  content: string;
  mood: string;
  artStyle: string;
  dialect: string;
}

export default function StoryForm({ audioFile, onCancel, onComplete, onAudioComplete }: StoryFormProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [titleMethod, setTitleMethod] = useState<'manual' | 'ai'>('manual');
  const [title, setTitle] = useState('');
  const [protagonist, setProtagonist] = useState('');
  const [body, setBody] = useState('');

  // Step 2
  const moods = ['따뜻한', '모험적인', '신비로운', '코믹한'];
  const styles = ['수채화', '크레파스', '연필 스케치', '만화'];
  const dialects = ['표준어', '경상', '전라', '충청'];
  const [mood, setMood] = useState<string>('따뜻한');
  const [artStyle, setArtStyle] = useState<string>('수채화');
  const [dialect, setDialect] = useState<string>('표준어');

  // AI 생성 선택 시 제목은 자동으로 처리되므로 검증에서 제외
  const currentTitle = titleMethod === 'ai' ? 'AI가 생성할 예정' : title;

  const canNext = useMemo(() => {
    // AI 생성 선택 시에는 제목 검증 제외, 직접 입력 시에는 제목 필수
    const titleValid = titleMethod === 'ai' || (titleMethod === 'manual' && !!title.trim());
    // 음성 파일이 있을 때는 내용 검증 제외
    const contentValid = audioFile || !!body.trim();
    return titleValid && !!protagonist.trim() && contentValid;
  }, [titleMethod, title, protagonist, body, audioFile]);

  const goNext = async () => {
    if (step === 1) {
      if (!canNext) {
        Alert.alert('확인', '제목, 주인공, 내용을 모두 입력해주세요.');
        return;
      }
      setStep(2);
      return;
    }
    
    // 음성 파일이 있는 경우 바로 API 호출
    if (audioFile && onAudioComplete) {
      try {
        // 파일 존재 확인
        const fileInfo = await FileSystem.getInfoAsync(audioFile);
        if (!fileInfo.exists) {
          throw new Error('음성 파일을 찾을 수 없습니다.');
        }

        console.log('📄 파일 경로:', audioFile);
        
        // React Native에서는 파일 URI를 직접 사용
        console.log('📖 React Native 파일 처리 방식 사용');
        
        // React Native에서 FormData에 사용할 파일 객체
        // 하지만 이번에는 실제 파일 내용을 읽어서 전달
        const audioFileForUpload = {
          uri: audioFile,
          type: 'audio/mp4',
          name: 'recording.m4a'
        };
        
        console.log('📁 업로드용 파일 객체 생성:', audioFileForUpload);
        
        // 키워드 조합
        const keywords = `${protagonist}, ${mood}, ${artStyle}, ${dialect}`;
        
        // API 호출
        const result = await generateStoryFromAudio({
          audio_file: audioFileForUpload, // React Native 파일 객체 전달
          keywords: keywords
        });
        
        console.log('✅ 음성 파일로 동화 생성 성공:', result);
        onAudioComplete(result.story_id);
        return;
      } catch (error: any) {
        console.error('❌ 음성 파일로 동화 생성 실패:', error);
        Alert.alert('생성 실패', error.message || '음성 파일로 동화 생성 중 오류가 발생했습니다.');
        return;
      }
    }
    
    // 텍스트 방식인 경우 기존 로직 사용
    const storyData: StoryFormData = { 
      title: titleMethod === 'ai' ? '' : title, // AI 생성 시 빈 문자열, 직접 입력 시 사용자 입력값
      protagonist, 
      content: body, 
      mood, 
      artStyle, 
      dialect 
    };
    
    onComplete(storyData);
  };

  return (
    <Container>
      <Content>
        <StepIndicator>
          <Dot active={step === 1} />
          <Dot active={step === 2} />
        </StepIndicator>

        {step === 1 ? (
          <Card>
            <SectionTitle>기본 정보</SectionTitle>
            
            {/* 제목 생성 방식 선택 */}
            <TitleMethodSelector>
              <MethodLabel>제목 생성 방식</MethodLabel>
              <MethodButtons>
                <MethodButton 
                  active={titleMethod === 'manual'} 
                  onPress={() => {
                    setTitleMethod('manual');
                  }}
                >
                  <MethodIcon>✏️</MethodIcon>
                  <MethodButtonText active={titleMethod === 'manual'}>직접 입력</MethodButtonText>
                </MethodButton>
                <MethodButton 
                  active={titleMethod === 'ai'} 
                  onPress={() => setTitleMethod('ai')}
                >
                  <MethodIcon>🤖</MethodIcon>
                  <MethodButtonText active={titleMethod === 'ai'}>AI 생성</MethodButtonText>
                </MethodButton>
              </MethodButtons>
            </TitleMethodSelector>

            {/* 제목 입력 영역 - 직접 입력 시에만 표시 */}
            {titleMethod === 'manual' && (
              <TitleInputContainer>
                <Label>동화 제목</Label>
                <Input
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChangeText={setTitle}
                />
              </TitleInputContainer>
            )}

            {/* AI 생성 선택 시 안내 메시지 */}
            {titleMethod === 'ai' && (
              <TitleInputContainer>
                <Label>동화 제목</Label>
                <GeneratedTitleCard>
                  <GeneratedTitleLabel>🤖 AI가 자동으로 제목을 생성합니다</GeneratedTitleLabel>
                  <GeneratedTitleText>동화 생성 시 AI가 스토리 내용을 바탕으로 제목을 지어드려요</GeneratedTitleText>
                </GeneratedTitleCard>
              </TitleInputContainer>
            )}

            <Label>주인공</Label>
            <Input
              placeholder="주인공 이름/특징을 입력하세요"
              value={protagonist}
              onChangeText={setProtagonist}
            />

            {/* 음성 파일이 없을 때만 내용 입력창 표시 */}
            {!audioFile && (
              <>
                <Label>스토리 내용</Label>
                <Input
                  placeholder="이야기 내용을 적어주세요"
                  value={body}
                  onChangeText={setBody}
                  multiline
                  textAlignVertical="top"
                  style={{ height: 160 }}
                />
              </>
            )}
            
            {/* 음성 파일이 있을 때 안내 메시지 */}
            {audioFile && (
              <TitleInputContainer>
                <Label>스토리 내용</Label>
                <GeneratedTitleCard>
                  <GeneratedTitleLabel>🎤 음성으로 녹음된 내용</GeneratedTitleLabel>
                  <GeneratedTitleText>녹음하신 음성이 동화의 내용으로 사용됩니다</GeneratedTitleText>
                </GeneratedTitleCard>
              </TitleInputContainer>
            )}
          </Card>
        ) : (
          <Card>
            <SectionTitle>분위기/그림체/사투리</SectionTitle>
            <Label>분위기</Label>
            <ChipRow>
              {moods.map(m => (
                <Chip key={m} active={m === mood} onPress={() => setMood(m)}>
                  <ChipText active={m === mood}>{m}</ChipText>
                </Chip>
              ))}
            </ChipRow>

            <Label style={{ marginTop: 16 }}>그림체</Label>
            <ChipRow>
              {styles.map(s => (
                <Chip key={s} active={s === artStyle} onPress={() => setArtStyle(s)}>
                  <ChipText active={s === artStyle}>{s}</ChipText>
                </Chip>
              ))}
            </ChipRow>

            <Label style={{ marginTop: 16 }}>사투리</Label>
            <ChipRow>
              {dialects.map(d => (
                <Chip key={d} active={d === dialect} onPress={() => setDialect(d)}>
                  <ChipText active={d === dialect}>{d}</ChipText>
                </Chip>
              ))}
            </ChipRow>
          </Card>
        )}
      </Content>

      <Footer>
        <GhostButton onPress={() => (step === 1 ? onCancel() : setStep(1))}>
          <GhostText>{step === 1 ? '닫기' : '이전'}</GhostText>
        </GhostButton>
        <PrimaryButton onPress={goNext}>
          <PrimaryText>{step === 1 ? '다음' : '완료'}</PrimaryText>
        </PrimaryButton>
      </Footer>
    </Container>
  );
}
