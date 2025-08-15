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
            <Stack.Screen name="auth" />
            <Stack.Screen name="stories" />
            <Stack.Screen name="create" />
            <Stack.Screen name="settings" />
          </Stack>
          <StatusBar style="auto" />
        </AppInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
