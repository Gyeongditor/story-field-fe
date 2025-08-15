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


