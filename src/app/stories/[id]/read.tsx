import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StoryReaderPage } from '../../../widgets/StoryReaderPage';
import { useStoryReaderPage } from '../../../widgets/StoryReaderPage';

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    pages,
    initialPage,
    handleBack, 
    handlePageChange
  } = useStoryReaderPage(id || '');

  return (
    <StoryReaderPage
      pages={pages}
      initialPage={initialPage}
      onBack={handleBack}
      onPageChange={handlePageChange}
    />
  );
}
