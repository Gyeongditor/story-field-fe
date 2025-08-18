import React from 'react';
import { CreatePage, useCreatePage } from '../widgets/CreatePage';

export default function CreateScreen() {
  const { handleCreateOption } = useCreatePage();

  return <CreatePage onCreateOption={handleCreateOption} />;
}
