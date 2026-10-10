import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';

import { useColors } from '../theme/colors';

type ScreenProps = {
  children: ReactNode;
  /** Wrap the content in a ScrollView. */
  scroll?: boolean;
  /** Lift the content above the software keyboard (use on form screens). */
  keyboardAvoiding?: boolean;
  /** Center the content vertically. */
  centered?: boolean;
  testID?: string;
};

/** Themed full-screen container with the standard padding and spacing. */
export function Screen({ children, scroll, keyboardAvoiding, centered, testID }: ScreenProps) {
  const colors = useColors();
  const containerStyle = [
    styles.container,
    centered && styles.centered,
    { backgroundColor: colors.background },
  ];

  const content = scroll ? (
    <ScrollView
      testID={testID}
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, centered && styles.centered]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View testID={testID} style={containerStyle}>
      {children}
    </View>
  );

  if (!keyboardAvoiding) return content;
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 12 },
  content: { flexGrow: 1, padding: 24, gap: 12 },
  centered: { justifyContent: 'center' },
});
