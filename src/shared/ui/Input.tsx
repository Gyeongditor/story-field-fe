import React from 'react';
import styled from '@emotion/native';
import { TextInputProps } from 'react-native';

const StyledInput = styled.TextInput<{ 
  variant?: 'default' | 'error';
  disabled?: boolean;
}>`
  border-width: 1px;
  border-color: ${props => {
    if (props.variant === 'error') return '#ef4444';
    return '#e5e7eb';
  }};
  background-color: ${props => props.disabled ? '#f9fafb' : '#ffffff'};
  border-radius: 8px;
  padding: 12px; /* 1.5 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
  font-size: 16px;
  color: ${props => props.disabled ? '#9ca3af' : '#111827'};
`;

interface InputProps extends TextInputProps {
  variant?: 'default' | 'error';
  disabled?: boolean;
}

export default function Input({ variant = 'default', disabled, ...props }: InputProps) {
  return (
    <StyledInput
      variant={variant}
      disabled={disabled}
      editable={!disabled}
      {...props}
    />
  );
}
