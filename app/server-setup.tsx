import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useAuth } from '../lib/auth-context';
import { useColors } from '../theme/colors';

export default function ServerSetupScreen() {
  const { configureServer } = useAuth();
  const colors = useColors();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await configureServer(url);
      router.replace('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save that server URL.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen keyboardAvoiding centered>
      <Text style={[styles.title, { color: colors.text }]}>Connect to your server</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Enter the URL of the server this app should talk to.
      </Text>
      <TextField
        testID="server-url-input"
        placeholder="https://starterapp.example.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
        value={url}
        onChangeText={setUrl}
      />
      <ErrorMessage testID="server-setup-error" message={error} />
      <Button
        title="Continue"
        testID="server-setup-submit"
        onPress={onSubmit}
        loading={submitting}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '600' },
  subtitle: { fontSize: 14, marginBottom: 12 },
});
