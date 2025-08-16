import React, { useMemo, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import styled from '@emotion/native';
import { useRouter } from 'expo-router';

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
  initialVoiceText?: string;
  onCancel: () => void;
  onComplete: (data: StoryFormData) => void;
}

export interface StoryFormData {
  title: string;
  protagonist: string;
  content: string;
  mood: string;
  artStyle: string;
  dialect: string;
}

export default function StoryForm({ initialVoiceText, onCancel, onComplete }: StoryFormProps) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1
  const [title, setTitle] = useState('');
  const [protagonist, setProtagonist] = useState('');
  const [body, setBody] = useState(initialVoiceText || '');

  // Step 2
  const moods = ['따뜻한', '모험적인', '신비로운', '코믹한'];
  const styles = ['수채화', '크레파스', '연필 스케치', '만화'];
  const dialects = ['표준어', '경상', '전라', '충청'];
  const [mood, setMood] = useState<string>('따뜻한');
  const [artStyle, setArtStyle] = useState<string>('수채화');
  const [dialect, setDialect] = useState<string>('표준어');

  const canNext = useMemo(() => !!title && !!protagonist && !!body, [title, protagonist, body]);

  const goNext = () => {
    if (step === 1) {
      if (!canNext) {
        Alert.alert('확인', '제목, 주인공, 내용을 모두 입력해주세요.');
        return;
      }
      setStep(2);
      return;
    }
    
    // 완료 데이터 전달
    const storyData: StoryFormData = { 
      title, 
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
            <Label>동화 제목</Label>
            <Input
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
            />

            <Label>주인공</Label>
            <Input
              placeholder="주인공 이름/특징을 입력하세요"
              value={protagonist}
              onChangeText={setProtagonist}
            />

            <Label>스토리 내용</Label>
            <Input
              placeholder="이야기 내용을 적어주세요"
              value={body}
              onChangeText={setBody}
              multiline
              textAlignVertical="top"
              style={{ height: 160 }}
            />
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
