import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import styled from '@emotion/native';

export interface StoryCardProps {
  id: string;
  title: string;
  date: string;
  genre: string;
  mood: string;
  isFavorite: boolean;
  cover: string;
  onPress: (storyId: string) => void;
  onFavoriteToggle: (storyId: string) => void;
  isEditMode?: boolean;
  onDelete?: (storyId: string) => void;
}

const Card = styled.TouchableOpacity`
  width: 48%;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border-width: 1px;
  border-color: #e5e5e5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  margin-bottom: 16px;
`;

const Cover = styled.View`
  background-color: #f3f4f6;
  height: 128px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const CoverText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
`;

const FavoriteBadge = styled.TouchableOpacity<{ isFavorite: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${props => (props.isFavorite ? '#fbbf24' : 'rgba(255, 255, 255, 0.9)')};
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${props => (props.isFavorite ? '#f59e0b' : '#e5e7eb')};
`;

const GenreBadge = styled.View`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #f2f2f7;
  padding: 4px 8px;
  border-radius: 8px;
`;

const GenreBadgeText = styled.Text`
  color: #6b7280;
  font-size: 12px;
  font-weight: 500;
`;

const CardBody = styled.View`
  padding: 16px;
`;

const StoryTitle = styled.Text`
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
  line-height: 20px;
`;

const StoryMeta = styled.View`
  margin-top: 8px;
`;

const StoryDate = styled.Text`
  color: #9ca3af;
  font-size: 12px;
`;

const StoryMood = styled.Text`
  color: #6b7280;
  font-size: 11px;
  font-weight: 500;
  margin-top: 4px;
`;

const DeleteButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: #ef4444;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #ffffff;
`;

export const StoryCard: React.FC<StoryCardProps> = ({
  id,
  title,
  date,
  genre,
  mood,
  isFavorite,
  cover,
  onPress,
  onFavoriteToggle,
  isEditMode = false,
  onDelete,
}) => {
  const handleCardPress = () => {
    onPress(id);
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    onFavoriteToggle(id);
  };

  const handleDeletePress = (e: any) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <Card onPress={handleCardPress}>
      <Cover>
        <CoverText>{cover}</CoverText>
        <FavoriteBadge
          isFavorite={isFavorite}
          onPress={handleFavoritePress}
        >
          <Text>{isFavorite ? '⭐' : '☆'}</Text>
        </FavoriteBadge>
        <GenreBadge>
          <GenreBadgeText>{genre}</GenreBadgeText>
        </GenreBadge>
      </Cover>
      <CardBody>
        <StoryTitle numberOfLines={2}>{title}</StoryTitle>
        <StoryMeta>
          <StoryDate>{date}</StoryDate>
        </StoryMeta>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          {isFavorite && <Text style={{ fontSize: 16, marginRight: 12 }}>⭐</Text>}
          <Text style={{ fontSize: 16 }}>🔗</Text>
        </View>
      </CardBody>
      {isEditMode && (
        <DeleteButton onPress={handleDeletePress}>
          <Text style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>✕</Text>
        </DeleteButton>
      )}
    </Card>
  );
};
