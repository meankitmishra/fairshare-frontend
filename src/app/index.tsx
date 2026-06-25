import { Redirect } from 'expo-router';

import { useSessionStore } from '@/core/session/session-store';

export default function Index() {
  const status = useSessionStore((s) => s.status);
  return <Redirect href={status === 'authenticated' ? '/(tabs)' : '/(auth)/login'} />;
}