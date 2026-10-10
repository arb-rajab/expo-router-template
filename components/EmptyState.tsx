import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { useColors } from '../theme/colors';

type EmptyStateProps = {
  title: string;
  message?: string;
  /** Optional call to action; both fields are needed for the button to show. */
  actionLabel?: string;
  onAction?: () => void;
  testID?: string;
};

export function EmptyState({ title, message, actionLabel, onAction, testID }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View testID={testID} style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {message ? <Text style={{ color: colors.textMuted, textAlign: 'center' }}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          testID={testID ? `${testID}-action` : undefined}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
  title: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
});
