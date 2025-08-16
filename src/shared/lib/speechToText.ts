import * as FileSystem from 'expo-file-system';

export interface SpeechToTextResult {
  success: boolean;
  text?: string;
  error?: string;
}

// GCP Speech-to-Text API 설정
const GCP_API_KEY = process.env.EXPO_PUBLIC_GCP_API_KEY;
const GCP_STT_URL = `https://speech.googleapis.com/v1/speech:recognize?key=${GCP_API_KEY}`;

/**
 * 음성 파일을 GCP Speech-to-Text API로 텍스트로 변환
 */
export async function convertSpeechToText(audioUri: string): Promise<SpeechToTextResult> {
  try {
    console.log('🎤 STT 변환 시작:', audioUri);

    if (!GCP_API_KEY) {
      console.error('❌ GCP API 키가 없습니다');
      return {
        success: false,
        error: 'GCP API 키가 설정되지 않았습니다. .env 파일을 확인하세요.'
      };
    }

    // 파일 크기 확인
    const fileInfo = await FileSystem.getInfoAsync(audioUri) as any;
    console.log('📂 파일 정보:', fileInfo);
    
    let requestPayload: any;
    
    if (fileInfo.size && fileInfo.size > 10 * 1024 * 1024) { // 10MB 초과
      console.log('📦 파일이 10MB를 초과합니다. GCS 버킷 방식이 필요합니다.');
      return {
        success: false,
        error: '파일이 10MB를 초과합니다. 더 짧은 녹음을 사용하거나 GCS 버킷을 설정해주세요.'
      };
    } else {
      // 1단계: 음성 파일을 Base64로 인코딩 (10MB 이하)
      console.log('📂 파일 읽기 시작...');
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('✅ Base64 인코딩 완료');

      // 2단계: Direct API 요청 페이로드 구성
      requestPayload = {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 16000, // WAV 파일의 실제 샘플레이트와 일치
          languageCode: 'ko-KR',
          audioChannelCount: 1,
          enableAutomaticPunctuation: true,
        },
        audio: {
          content: base64Audio,
        },
      };
    }

    console.log('🌐 GCP STT API 호출 중...');
    
    // 3단계: GCP STT API 호출
    const response = await fetch(GCP_STT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    console.log('📡 응답 상태:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API 호출 실패 상세:');
      console.error('응답 상태:', response.status, response.statusText);
      console.error('에러 내용:', errorText);
      console.error('요청 URL:', GCP_STT_URL);
      console.error('요청 페이로드:', JSON.stringify(requestPayload, null, 2));
      
      return {
        success: false,
        error: `STT API 호출 실패: ${response.status} ${response.statusText}\n${errorText}`
      };
    }

    // 4단계: 응답 파싱
    const result = await response.json();
    console.log('📝 STT 결과:', result);

    if (result.results && result.results.length > 0) {
      const transcript = result.results
        .map((r: any) => r.alternatives[0]?.transcript || '')
        .join(' ')
        .trim();

      console.log('✅ 변환 완료:', transcript);
      
      return {
        success: true,
        text: transcript
      };
    } else {
      console.log('❌ 음성을 인식하지 못했습니다');
      return {
        success: false,
        error: '음성을 인식하지 못했습니다. 다시 시도해주세요.'
      };
    }

  } catch (error: any) {
    console.error('❌ STT 변환 중 오류:', error);
    return {
      success: false,
      error: `STT 변환 실패: ${error.message || '알 수 없는 오류'}`
    };
  }
}
