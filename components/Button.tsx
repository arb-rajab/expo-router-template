import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useColors } from '../theme/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  /** Disables the button and shows a spinner instead of the title. */
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'link';
  testID?: string;
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  testID,
}: ButtonProps) {
  const colors = useColors();
  const inactive = disabled || loading;

  if (variant === 'link') {
    return (
      <Pressable
        testID={testID}
        accessibilityRole="link"
        onPress={onPress}
        disabled={inactive}
        style={inactive && styles.inactive}
      >
        <Text style={[styles.link, { color: colors.primary }]}>{title}</Text>
      </Pressable>
    );
  }

  const background = variant === 'danger' ? colors.danger : colors.primary;
  const foreground = variant === 'danger' ? colors.onDanger : colors.onPrimary;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      onPress={onPress}
      disabled={inactive}
      style={[styles.button, { backgroundColor: background }, inactive && styles.inactive]}
    >
      {loading ? (
        <ActivityIndicator testID={testID ? `${testID}-spinner` : undefined} color={foreground} />
      ) : (
        <Text style={[styles.buttonText, { color: foreground }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 8 },
  buttonText: { fontWeight: '600' },
  link: { textAlign: 'center', marginTop: 16, textDecorationLine: 'underline' },
  inactive: { opacity: 0.6 },
});
