import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styled from '@emotion/native';
import { useRouter, usePathname } from 'expo-router';

const NavContainer = styled.View`
  flex-direction: row;
  background-color: #ffffff;
  border-top-width: 1px;
  border-top-color: #e5e5e5;
  padding-bottom: 32px;
  padding-top: 8px;
  padding-horizontal: 16px;
`;

const NavItem = styled.TouchableOpacity<{ isActive: boolean }>`
  flex: 1;
  align-items: center;
  padding: 8px;
`;

const NavIcon = styled.Text<{ isActive: boolean }>`
  font-size: 20px;
  margin-bottom: 4px;
  color: ${props => props.isActive ? '#007AFF' : '#8E8E93'};
`;

const NavLabel = styled.Text<{ isActive: boolean }>`
  font-size: 11px;
  color: ${props => props.isActive ? '#007AFF' : '#8E8E93'};
  font-weight: ${props => props.isActive ? '600' : '400'};
`;

interface NavItemData {
  id: string;
  icon: string;
  label: string;
  route: string;
}

const navItems: NavItemData[] = [
  { id: 'home', icon: '🏠', label: 'Home', route: '/' },
  { id: 'library', icon: '📚', label: 'Library', route: '/stories' },
  { id: 'create', icon: '⚡', label: 'Create', route: '/create' },
  { id: 'settings', icon: '⚙️', label: 'Settings', route: '/settings' },
];

export const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavPress = (route: string) => {
    router.push(route);
  };

  const getIsActive = (route: string) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  };

  return (
    <NavContainer>
      {navItems.map((item) => {
        const isActive = getIsActive(item.route);
        return (
          <NavItem
            key={item.id}
            isActive={isActive}
            onPress={() => handleNavPress(item.route)}
          >
            <NavIcon isActive={isActive}>{item.icon}</NavIcon>
            <NavLabel isActive={isActive}>{item.label}</NavLabel>
          </NavItem>
        );
      })}
    </NavContainer>
  );
};
