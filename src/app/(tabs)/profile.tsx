import { StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/core/theme/theme';

export default function ActivityScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Activity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});