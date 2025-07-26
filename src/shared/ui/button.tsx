import styled from "@emotion/native";
import { Text } from "react-native";
import { useTheme } from "@emotion/react";

type ButtonProps = {
  title: string;
  onPress: () => void;
};

const StyledButton = styled.TouchableOpacity<{ bg: string; padding: number }>`
  background-color: ${({ bg }) => bg};
  padding: ${({ padding }) => padding}px;
  border-radius: 8px;
  align-items: center;
`;

export const Button = ({ title, onPress }: ButtonProps) => {
  const theme = useTheme();
  return (
    <StyledButton
      onPress={onPress}
      bg={theme.colors.secondary}
      padding={theme.spacing.md}
    >
      <Text
        style={{
          color: theme.colors.background,
          fontSize: theme.typography.fontSize.md,
        }}
      >
        {title}
      </Text>
    </StyledButton>
  );
};
