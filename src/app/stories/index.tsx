import React from 'react';
import { LibraryPage } from '../../widgets/LibraryPage';
import { useLibraryPage } from '../../widgets/LibraryPage';

export default function StoriesIndex() {
  const data = useLibraryPage();
  
  if (!data.isAuthenticated && !data.isLoading) {
    return null;
  }

  return (
    <LibraryPage
      onStoryPress={data.handleStoryPress}
      onFavoriteToggle={data.handleFavoriteToggle}
      onFilterChange={data.handleFilterChange}
      onSortChange={data.handleSortChange}
      onGenreFilterChange={data.handleGenreFilterChange}
      onMoodFilterChange={data.handleMoodFilterChange}
      onLoadMore={data.handleLoadMore}
      onRefresh={data.handleRefresh}
      onEditModeToggle={data.handleEditModeToggle}
      onStoryDelete={data.handleStoryDelete}
      filter={data.filter}
      sortOption={data.sortOption}
      selectedGenres={data.selectedGenres}
      selectedMoods={data.selectedMoods}
      stories={data.stories}
      hasMore={data.hasMore}
      isLoading={data.isLoading}
      isEditMode={data.isEditMode}
    />
  );
}