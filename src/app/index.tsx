import React from 'react';
import { HomePage, useHomePage } from '../widgets/HomePage';

export default function Home() {
  const { isAuthenticated, isLoading, handleQuickAction, shouldShowPage } = useHomePage();

  if (!shouldShowPage) {
    return null;
  }

  return <HomePage onQuickAction={handleQuickAction} />;
}
