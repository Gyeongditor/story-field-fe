import React from 'react';
import styled from '@emotion/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import GeneratingScreen from '../../features/storyCreation/components/GeneratingScreen';
import { StoryFormData } from '../../features/storyCreation/components/StoryForm';

export default function StoryGeneratingPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ storyData?: string }>();

  // params에서 storyData 파싱
  const storyData: StoryFormData | undefined = params.storyData 
    ? JSON.parse(params.storyData) 
    : undefined;

  const handleComplete = (storyId: string) => {
    router.replace(`/stories/${storyId}`);
  };

  const handleError = () => {
    router.back();
  };

  return (
    <GeneratingScreen
      storyData={storyData}
      onComplete={handleComplete}
      onError={handleError}
    />
  );
}
