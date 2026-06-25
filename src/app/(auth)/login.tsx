import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useSessionStore } from '@/core/session/session-store';
import { useTheme } from '@/core/theme/theme';

export default function LoginScreen() {
  const theme = useTheme();
  const signInDev = useSessionStore((s) => s.signInDev);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.typography.title, { color: theme.colors.text }]}>FairShare</Text>
      <Text style={[theme.typography.body, { color: theme.colors.muted, marginTop: theme.spacing.sm }]}>
        Split fairly. Settle easily.
      </Text>
      <Pressable
        onPress={signInDev}
        style={[styles.button, { backgroundColor: theme.colors.brand, borderRadius: theme.radii.md, marginTop: theme.spacing.xl }]}
      >
        <Text style={styles.buttonText}>Sign in (dev)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  button: { paddingVertical: 12, paddingHorizontal: 20 },
  buttonText: { color: '#fff', fontWeight: '600' },
});