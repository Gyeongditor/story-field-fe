export interface MainStoryItem {
  storyId: string;
  storyTitle: string;
  thumbnailUrl?: string;
}

export interface MainStoryListResponse {
  status: number;
  code: string;
  message: string;
  data: MainStoryItem[];
}


