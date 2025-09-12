import React from 'react';
import { ProfilePage } from '../widgets/ProfilePage/ui/ProfilePage';
import { useProfilePage } from '../widgets/ProfilePage/model/useProfilePage';

export default function ProfileScreen() {
  const {
    profile,
    isLoading,
    error,
    formData,
    hasChanges,
    isSaving,
    isDeleting,
    onBack,
    onFormChange,
    onSave,
    onDeleteAccount,
    onRetry,
    onChangePhoto
  } = useProfilePage();

  return (
    <ProfilePage
      profile={profile}
      isLoading={isLoading}
      error={error}
      formData={formData}
      hasChanges={hasChanges}
      isSaving={isSaving}
      isDeleting={isDeleting}
      onBack={onBack}
      onFormChange={onFormChange}
      onSave={onSave}
      onDeleteAccount={onDeleteAccount}
      onRetry={onRetry}
      onChangePhoto={onChangePhoto}
    />
  );
}
