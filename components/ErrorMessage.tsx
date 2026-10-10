import { StyleSheet, Text } from 'react-native';

import { useColors } from '../theme/colors';

type ErrorMessageProps = {
  /** Renders nothing when empty. */
  message?: string | null;
  testID?: string;
};

export function ErrorMessage({ message, testID }: ErrorMessageProps) {
  const colors = useColors();
  if (!message) return null;
  return (
    <Text
      testID={testID}
      accessibilityRole="alert"
      style={[styles.text, { color: colors.danger }]}
    >
      {message}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: { fontSize: 14 },
});
