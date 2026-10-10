import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { ApiError } from '../lib/api-client';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Screen } from '../components/Screen';
import { TextField } from '../components/TextField';
import { useAuth } from '../lib/auth-context';
import { useColors } from '../theme/colors';

export default function LoginScreen() {
  const { login, serverUrl } = useAuth();
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(app)');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.isUnauthorized ? 'Incorrect email or password.' : err.message);
      } else {
        setError('Could not reach the server. Check the URL and your connection.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen keyboardAvoiding centered>
      <Text style={[styles.title, { color: colors.text }]}>Sign in</Text>
      {serverUrl && (
        <Text style={[styles.subtitle, { color: colors.textMuted }]} testID="login-server-url">
          {serverUrl}
        </Text>
      )}
      <TextField
        testID="email-input"
        placeholder="Email"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        testID="password-input"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <ErrorMessage testID="login-error" message={error} />
      <Button title="Sign in" testID="login-submit" onPress={onSubmit} loading={submitting} />
      <Button
        variant="link"
        title="Change server"
        testID="change-server-link"
        onPress={() => router.push('/server-setup')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 20, fontWeight: '600' },
  subtitle: { fontSize: 13, marginBottom: 12 },
});
