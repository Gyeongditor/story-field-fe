import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import styled from '@emotion/native';

const StyledButton = styled.TouchableOpacity<{
  variant: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
}>`
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '8px 12px'; /* 1 x 8, 1.5 x 8 */
      case 'md': return '12px 16px'; /* 1.5 x 8, 2 x 8 */
      case 'lg': return '16px 24px'; /* 2 x 8, 3 x 8 */
    }
  }};
  border-radius: 8px;
  margin-bottom: 16px; /* 2 x 8 */
  align-items: center;
  justify-content: center;
  
  /* Variant styles */
  background-color: ${props => {
    if (props.disabled) return '#d1d5db';
    switch (props.variant) {
      case 'primary': return '#3b82f6';
      case 'danger': return '#ef4444';
      case 'ghost': return 'transparent';
    }
  }};
  
  border-width: ${props => props.variant === 'ghost' ? '1px' : '0px'};
  border-color: ${props => {
    if (props.disabled) return '#d1d5db';
    switch (props.variant) {
      case 'ghost': return '#e5e7eb';
      default: return 'transparent';
    }
  }};
`;

const ButtonText = styled.Text<{
  variant: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  size: 'sm' | 'md' | 'lg';
}>`
  color: ${props => {
    if (props.disabled) return '#9ca3af';
    switch (props.variant) {
      case 'primary':
      case 'danger': return '#ffffff';
      case 'ghost': return '#6b7280';
    }
  }};
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '14px';
      case 'md': return '16px';
      case 'lg': return '18px';
    }
  }};
  font-weight: 600;
  text-align: center;
`;

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ 
  title, 
  variant = 'primary', 
  size = 'md',
  loading = false,
  disabled = false,
  ...props 
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <StyledButton 
      variant={variant} 
      size={size}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'ghost' ? '#6b7280' : '#ffffff'} 
          size="small"
        />
      ) : (
        <ButtonText variant={variant} size={size} disabled={isDisabled}>
          {title}
        </ButtonText>
      )}
    </StyledButton>
  );
}
