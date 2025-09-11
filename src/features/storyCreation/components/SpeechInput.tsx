import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from '@emotion/native';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

const Container = styled.View`
  flex: 1;
  padding: 24px 24px 16px 24px; /* 하단 패딩 줄임 */
`;

const ContentContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 320px;
  align-self: center;
`;

const Instruction = styled.Text`
  font-size: 16px;
  color: #6b7280;
  text-align: center;
  line-height: 24px;
  margin-bottom: 40px;
`;

const MicContainer = styled.View`
  align-items: center;
  margin-bottom: 40px;
`;

const MicButton = styled.TouchableOpacity<{ recording: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background-color: ${props => props.recording ? '#ef4444' : '#3b82f6'};
  align-items: center;
  justify-content: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
  elevation: 4;
`;

const MicIcon = styled.Text`
  font-size: 48px;
  color: #ffffff;
`;

const StatusText = styled.Text<{ recording: boolean }>`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.recording ? '#ef4444' : '#6b7280'};
  text-align: center;
`;

const Footer = styled.View`
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 320px;
  align-self: center;
  margin-top: 16px;
`;


const PrimaryButton = styled.TouchableOpacity`
  width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: #3b82f6;
  align-items: center;
`;

const PrimaryText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
`;



interface SpeechInputProps {
  onCancel: () => void;
  onNext: (audioFile: string) => void; // 녹음 완료 후 다음 단계로
}

export default function SpeechInput({ onCancel, onNext }: SpeechInputProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const requestPermissions = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '음성 녹음을 위해 마이크 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        web: {
          mimeType: 'audio/mp4',
          bitsPerSecond: 128000,
        },
      });

      setRecording(newRecording);
      setIsRecording(true);
      console.log('🎤 녹음 시작');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      Alert.alert('녹음 오류', '녹음을 시작할 수 없습니다.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      const uri = recording.getURI();
      if (uri) {
        // recordings 폴더 생성
        const recordingsDir = `${FileSystem.documentDirectory}recordings/`;
        const dirInfo = await FileSystem.getInfoAsync(recordingsDir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(recordingsDir, { intermediates: true });
        }

        // 파일 복사
        const fileName = `recording-${Date.now()}.m4a`;
        const finalPath = `${recordingsDir}${fileName}`;
        await FileSystem.copyAsync({
          from: uri,
          to: finalPath
        });

        setRecordingUri(finalPath);
        setHasRecorded(true);
        console.log('📁 녹음 완료! 파일 위치:', finalPath);
      }
      
      setRecording(null);
    } catch (error) {
      console.error('녹음 정지 실패:', error);
      Alert.alert('녹음 오류', '녹음을 정지할 수 없습니다.');
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleNext = () => {
    if (!recordingUri) {
      Alert.alert('오류', '녹음된 파일이 없습니다.');
      return;
    }
    
    console.log('✅ 녹음 완료, 다음 단계로:', recordingUri);
    onNext(recordingUri);
  };

  return (
    <Container>
      <ContentContainer>
        <Instruction>
          {hasRecorded 
            ? '녹음이 완료되었습니다.\n"다음" 버튼을 눌러 동화 설정을 진행하세요.'
            : '자신의 이야기를 말씀해주세요.\n마이크 버튼을 눌러 녹음을 시작하세요.'
          }
        </Instruction>

        <MicContainer>
          <MicButton recording={isRecording} onPress={handleMicPress}>
            <MicIcon>{isRecording ? '⏹' : '🎤'}</MicIcon>
          </MicButton>
        </MicContainer>

        <StatusText recording={isRecording}>
          {isRecording ? '녹음 중...' : hasRecorded ? '녹음 완료' : '녹음 대기'}
        </StatusText>
      </ContentContainer>

      {hasRecorded && (
        <Footer>
          <PrimaryButton onPress={handleNext}>
            <PrimaryText>다음</PrimaryText>
          </PrimaryButton>
        </Footer>
      )}
    </Container>
  );
}
