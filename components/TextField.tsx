import { StyleSheet, Text, TextInput, type TextInputProps } from 'react-native';

import { useColors } from '../theme/colors';

type TextFieldProps = Omit<TextInputProps, 'style'> & {
  /** Field-level error shown under the input. */
  error?: string | null;
  /** testID of the error text; defaults to `${testID}-error`. */
  errorTestID?: string;
};

export function TextField({ error, errorTestID, testID, ...inputProps }: TextFieldProps) {
  const colors = useColors();
  return (
    <>
      <TextInput
        testID={testID}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={inputProps.accessibilityLabel ?? inputProps.placeholder}
        {...inputProps}
        style={[
          styles.input,
          { borderColor: error ? colors.danger : colors.border, color: colors.text },
        ]}
      />
      {error ? (
        <Text
          testID={errorTestID ?? (testID ? `${testID}-error` : undefined)}
          style={[styles.error, { color: colors.danger }]}
        >
          {error}
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  error: { fontSize: 13 },
});
