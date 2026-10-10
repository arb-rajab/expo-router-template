import { StyleSheet, Text } from 'react-native';

import { EmptyState } from '../../components/EmptyState';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../lib/auth-context';
import { useColors } from '../../theme/colors';

/** Replace this screen with your app's home. */
export default function HomeScreen() {
  const { session } = useAuth();
  const colors = useColors();

  return (
    <Screen centered>
      <Text style={[styles.title, { color: colors.text }]}>Welcome</Text>
      {session && (
        <Text style={[styles.subtitle, { color: colors.textMuted }]} testID="home-email">
          Signed in as {session.email}
        </Text>
      )}
      <EmptyState
        testID="home-empty"
        title="Nothing here yet"
        message="Replace this placeholder with your app's content."
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center' },
  subtitle: { fontSize: 14, textAlign: 'center' },
});
