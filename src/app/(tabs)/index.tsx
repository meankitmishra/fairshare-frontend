import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/core/api/client';
import { useHealthCheck } from '@/core/api/health';
import { db } from '@/core/db/client';
import { newId } from '@/core/db/id';
import { probe } from '@/core/db/schema';
import { useSessionStore } from '@/core/session/session-store';
import { useTheme } from '@/core/theme/theme';

export default function GroupsScreen() {
  const theme = useTheme();
  const signOut = useSessionStore((s) => s.signOut);
  const { data } = useLiveQuery(db.select().from(probe));
  const health = useHealthCheck();
  const addRow = async () => {
    await db.insert(probe).values({
      id: newId(),
      label: `probe ${new Date().toLocaleTimeString()}`,
      createdAt: Date.now(),
    });
  };

const backendLabel = health.isPending
  ? 'checking…'
  : health.isError
  ? `unreachable${health.error instanceof ApiError ? ` (${health.error.status})` : ''}`
  : (health.data?.status ?? 'unknown');

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Groups</Text>
      <Text style={[theme.typography.body, { color: theme.colors.muted, marginTop: theme.spacing.sm }]}>
        Backend: {backendLabel}
      </Text>
      {data.map((row) => (
        <Text key={row.id} style={{ color: theme.colors.muted, fontSize: 12 }}>
          {row.id.slice(0, 8)}… · {row.label}
        </Text>
      ))}
      <Pressable
        onPress={addRow}
        style={[styles.button, { backgroundColor: theme.colors.brand, borderRadius: theme.radii.md, marginTop: theme.spacing.lg }]}
      >
        <Text style={styles.buttonText}>Add probe row</Text>
      </Pressable>
      <Pressable onPress={signOut} style={{ marginTop: theme.spacing.xl }}>
        <Text style={{ color: theme.colors.brand, fontWeight: '600' }}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  button: { paddingVertical: 12, paddingHorizontal: 20 },
  buttonText: { color: '#fff', fontWeight: '600' },
});