import { Redirect, Stack } from 'expo-router';

import { useSessionStore } from '@/core/session/session-store';

export default function AuthLayout() {
  const status = useSessionStore((s) => s.status);
  if (status === 'authenticated') return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}