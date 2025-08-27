import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { StoryReaderPage } from '../../../widgets/StoryReaderPage';
import { useStoryReaderPage } from '../../../widgets/StoryReaderPage';

export default function StoryReaderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { 
    currentPage, 
    currentPageIndex, 
    totalPages, 
    handleBack, 
    handlePrevious, 
    handleNext, 
    canGoPrevious, 
    canGoNext 
  } = useStoryReaderPage(id || '');

  if (!currentPage) {
    return null;
  }

  return (
    <StoryReaderPage
      currentPage={currentPageIndex}
      totalPages={totalPages}
      storyTitle={currentPage.title}
      storyContent={currentPage.content}
      imageUrl={currentPage.imageUrl}
      onBack={handleBack}
      onPrevious={handlePrevious}
      onNext={handleNext}
      canGoPrevious={canGoPrevious}
      canGoNext={canGoNext}
    />
  );
}
