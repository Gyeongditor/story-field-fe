import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import styled from '@emotion/native';
import { Audio } from 'expo-av';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { convertSpeechToText } from '../../../shared/lib/speechToText';

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Content = styled.View`
  align-items: center;
  width: 100%;
  max-width: 320px;
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
  flex-direction: row;
  gap: 16px;
  width: 100%;
`;

const GhostButton = styled.TouchableOpacity`
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  align-items: center;
`;

const GhostText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
`;

const PrimaryButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex: 2;
  padding: 16px;
  border-radius: 8px;
  background-color: ${props => props.disabled ? '#d1d5db' : '#3b82f6'};
  align-items: center;
`;

const PrimaryText = styled.Text<{ disabled?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.disabled ? '#9ca3af' : '#ffffff'};
`;

interface SpeechInputProps {
  onCancel: () => void;
  onComplete: (text: string) => void;
}

export default function SpeechInput({ onCancel, onComplete }: SpeechInputProps) {
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
          extension: '.wav',
          outputFormat: Audio.AndroidOutputFormat.DEFAULT,
          audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.wav',
          audioQuality: Audio.IOSAudioQuality.HIGH,
          sampleRate: 16000,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm;codecs=opus',
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
        const fileName = `recording-${Date.now()}.wav`;
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

  const handleUseRecording = async () => {
    if (!recordingUri) {
      Alert.alert('오류', '녹음된 파일이 없습니다.');
      return;
    }

    setIsProcessing(true);
    try {
      console.log('🔄 STT 변환 시작:', recordingUri);
      const result = await convertSpeechToText(recordingUri);
      
      if (result.success && result.text) {
        console.log('✅ STT 성공:', result.text);
        onComplete(result.text);
      } else {
        console.error('❌ STT 실패:', result.error);
        Alert.alert('변환 실패', `음성을 텍스트로 변환하는데 실패했습니다.\n\n오류: ${result.error}`);
      }
    } catch (error: any) {
      console.error('🔥 STT 처리 오류:', error);
      Alert.alert('처리 오류', error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const retryRecording = () => {
    setRecordingUri(null);
    setHasRecorded(false);
  };

  return (
    <Container>
      <Content>
        <Instruction>
          {hasRecorded 
            ? '녹음이 완료되었습니다.\n"텍스트로 만들기"를 눌러 계속 진행하세요.'
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
      </Content>

      <Footer>
        <GhostButton onPress={hasRecorded ? retryRecording : onCancel}>
          <GhostText>{hasRecorded ? '다시 녹음' : '취소'}</GhostText>
        </GhostButton>
        <PrimaryButton disabled={!hasRecorded || isProcessing} onPress={handleUseRecording}>
          <PrimaryText disabled={!hasRecorded || isProcessing}>
            {isProcessing ? 'STT 변환 중...' : '텍스트로 만들기'}
          </PrimaryText>
        </PrimaryButton>
      </Footer>
    </Container>
  );
}
