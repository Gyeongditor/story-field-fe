import { pythonApiClient } from '../../../shared/lib/pythonApiClient';
import { 
  GenerateStoryFromTextRequest, 
  GenerateStoryFromTextResponse,
  GenerateStoryFromAudioRequest,
  GenerateStoryFromAudioResponse,
  ValidationErrorResponse 
} from '../../../shared/types/api';

/**
 * 텍스트로 동화 생성 API
 */
export const generateStoryFromText = async (
  request: GenerateStoryFromTextRequest
): Promise<GenerateStoryFromTextResponse> => {
  try {
    const response = await pythonApiClient.post<GenerateStoryFromTextResponse>(
      '/api/stories/generate-from-text',
      request
    );
    
    return response.data;
  } catch (error: any) {
    console.error('❌ 동화 생성 API 에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });

    // 422 Validation Error 처리
    if (error.response?.status === 422) {
      const validationError: ValidationErrorResponse = error.response.data;
      const errorMessage = validationError.detail
        .map(err => `${err.loc.join('.')}: ${err.msg}`)
        .join(', ');
      throw new Error(`입력 데이터 오류: ${errorMessage}`);
    }
    
    // 502 Bad Gateway 처리
    if (error.response?.status === 502) {
      const errorDetail = error.response?.data?.detail;
      if (errorDetail?.error === 'Spring Backend 호출 중 오류 발생') {
        throw new Error('파이썬 백엔드에서 스프링 백엔드 연결에 문제가 있습니다. 개발팀에 문의해주세요.');
      }
      throw new Error('파이썬 백엔드에서 스프링 백엔드로 요청 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
    }
    
    // 기타 에러 처리
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(`동화 생성 중 오류가 발생했습니다. (${error.response?.status || 'Unknown'})`);
  }
};

/**
 * 음성 파일로 동화 생성 API
 */
export const generateStoryFromAudio = async (
  request: GenerateStoryFromAudioRequest
): Promise<GenerateStoryFromAudioResponse> => {
  try {
    console.log('🎵 음성 파일 업로드 시작:', {
      audioFileType: typeof request.audio_file,
      audioFileKeys: Object.keys(request.audio_file || {}),
      keywords: request.keywords
    });

    // FormData 생성
    const formData = new FormData();
    
    // Swagger 스펙에 맞게 필드명 사용
    formData.append('audio_file', request.audio_file as any);
    formData.append('keywords', request.keywords);
    
    console.log('📤 FormData 구성 완료:', {
      audioFileType: typeof request.audio_file,
      audioFileUri: request.audio_file?.uri,
      audioFileContentType: request.audio_file?.type,
      keywords: request.keywords
    });

    // axios를 사용하여 multipart/form-data 헤더 명시적 설정
    const response = await pythonApiClient.post<GenerateStoryFromAudioResponse>(
      '/api/stories/generate-from-audio',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 음성 처리는 시간이 오래 걸릴 수 있으므로 120초로 설정
      }
    );
    
    console.log('📡 axios 응답 상태:', response.status);
    return response.data;
  } catch (error: any) {
    console.error('❌ 음성 파일로 동화 생성 API 에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    });

    // 422 Validation Error 처리
    if (error.response?.status === 422) {
      const validationError: ValidationErrorResponse = error.response.data;
      const errorMessage = validationError.detail
        .map(err => `${err.loc.join('.')}: ${err.msg}`)
        .join(', ');
      throw new Error(`입력 데이터 오류: ${errorMessage}`);
    }
    
    // 502 Bad Gateway 처리
    if (error.response?.status === 502) {
      const errorDetail = error.response?.data?.detail;
      if (errorDetail?.error === 'Spring Backend 호출 중 오류 발생') {
        throw new Error('파이썬 백엔드에서 스프링 백엔드 연결에 문제가 있습니다. 개발팀에 문의해주세요.');
      }
      throw new Error('파이썬 백엔드에서 스프링 백엔드로 요청 중 오류가 발생했습니다. 서버 상태를 확인해주세요.');
    }
    
    // 413 파일 크기 초과 에러 처리
    if (error.response?.status === 413) {
      throw new Error('음성 파일 크기가 너무 큽니다. 더 작은 파일을 업로드해주세요.');
    }
    
    // 415 지원하지 않는 파일 형식 처리
    if (error.response?.status === 415) {
      throw new Error('지원하지 않는 음성 파일 형식입니다. mp3, wav, m4a 파일을 사용해주세요.');
    }
    
    // 기타 에러 처리
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(`음성 파일로 동화 생성 중 오류가 발생했습니다. (${error.response?.status || 'Unknown'})`);
  }
};
