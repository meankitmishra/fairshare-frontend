import { Redirect, Tabs } from 'expo-router';

import { useSessionStore } from '@/core/session/session-store';
import { useTheme } from '@/core/theme/theme';

export default function TabsLayout() {
  const status = useSessionStore((s) => s.status);
  const theme = useTheme();
  if (status !== 'authenticated') return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.brand,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Groups' }} />
      <Tabs.Screen name="activity" options={{ title: 'Activity' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}