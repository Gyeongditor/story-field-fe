export interface ApiResponse<TData> {
  status: number;
  code: string;
  message: string;
  data: TData;
}

export type JsonObject = { [key: string]: unknown };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isApiResponseLike<T>(value: unknown): value is ApiResponse<T> {
  if (!isRecord(value)) return false;
  return (
    'status' in value &&
    'code' in value &&
    'message' in value &&
    'data' in value
  );
}

// 동화 생성 API 타입 정의
export interface GenerateStoryFromTextRequest {
  keyword: string;
  plot: string;
}

export interface GenerateStoryFromTextResponse {
  success: boolean;
  message: string;
  story_id: string;
}

export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ValidationErrorResponse {
  detail: ValidationError[];
}

// 음성 파일로 동화 생성 API 타입 정의
export interface GenerateStoryFromAudioRequest {
  audio_file: any; // React Native에서는 파일 객체 형태 {uri: string, type: string, name: string}
  keywords: string; // 키워드 (쉼표로 구분)
}

export interface GenerateStoryFromAudioResponse {
  success: boolean;
  message: string;
  story_id: string;
}


