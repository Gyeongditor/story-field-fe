import React from 'react';
import { SettingsPage } from '../widgets/SettingsPage/ui/SettingsPage';
import { useSettingsPage } from '../widgets/SettingsPage/model/useSettingsPage';

export default function SettingsScreen() {
  const { isLoggingOut, isAuthenticated, handleSettingPress, handleLogout } = useSettingsPage();

  return (
    <SettingsPage 
      onSettingPress={handleSettingPress}
      onLogout={handleLogout}
      isLoggingOut={isLoggingOut}
      isAuthenticated={isAuthenticated}
    />
  );
}
