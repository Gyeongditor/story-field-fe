import styled from '@emotion/native';

export const Title = styled.Text<{ level?: 1 | 2 | 3 }>`
  font-size: ${props => {
    switch (props.level) {
      case 1: return '32px'; /* 4 x 8 */
      case 2: return '28px'; /* 3.5 x 8 */
      case 3: return '24px'; /* 3 x 8 */
      default: return '28px';
    }
  }};
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: ${props => props.level === 1 ? '32px' : '24px'}; /* 4 x 8 or 3 x 8 */
`;

export const Subtitle = styled.Text`
  font-size: 16px; /* 2 x 8 */
  color: #6b7280;
  text-align: center;
  line-height: 24px; /* 3 x 8 */
  margin-bottom: 16px; /* 2 x 8 */
`;

export const Label = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px; /* 1 x 8 */
  font-weight: 500;
`;

export const LinkText = styled.Text`
  color: #3b82f6;
  text-align: center;
  margin-top: 16px; /* 2 x 8 */
  font-size: 14px;
  text-decoration-line: underline;
`;

export const ErrorText = styled.Text`
  color: #ef4444;
  text-align: center;
  margin-bottom: 16px; /* 2 x 8 */
  font-size: 14px;
`;

export const SuccessText = styled.Text`
  color: #10b981;
  text-align: center;
  margin-bottom: 16px; /* 2 x 8 */
  font-size: 14px;
`;
