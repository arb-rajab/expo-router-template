import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useColors } from '../theme/colors';

type LoadingViewProps = {
  message?: string;
  testID?: string;
};

export function LoadingView({ message, testID }: LoadingViewProps) {
  const colors = useColors();
  return (
    <View testID={testID} style={styles.container} accessibilityRole="progressbar">
      <ActivityIndicator color={colors.primary} />
      {message ? <Text style={{ color: colors.textMuted }}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 },
});
