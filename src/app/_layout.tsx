import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@emotion/react";
import { theme } from "../shared/ui/theme";
import { AppInitializer } from "../shared/components/AppInitializer";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppInitializer>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="createStory" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/signup" />
            <Stack.Screen name="auth/verify/[token]" />
            <Stack.Screen name="create/generating" />
            <Stack.Screen name="create/text" />
            <Stack.Screen name="create/voice" />
            <Stack.Screen name="stories/index" />
            <Stack.Screen name="stories/[id]" />
          </Stack>
          <StatusBar style="auto" />
        </AppInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
