import { apiClient } from '../../shared/lib/apiClient';
import { API_ENDPOINTS } from '../../shared/lib/constants';
import type { ApiResponse } from '../../shared/types/api';
import type { MainStoryItem, MainStoryListResponse } from './story.types';

/**
 * 메인 페이지 스토리 목록 조회
 * @param page 페이지 번호 (0부터 시작)
 */
export const fetchMainStories = async (page = 0): Promise<MainStoryItem[]> => {
  const response = await apiClient.get<MainStoryListResponse>(
    API_ENDPOINTS.STORIES_MAIN,
    { params: { page } }
  );

  if (!response.data?.data) {
    throw new Error('스토리 목록을 가져올 수 없습니다.');
  }

  return response.data.data;
};
