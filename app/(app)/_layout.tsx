import { Redirect, Stack, router } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { useAuth } from '../../lib/auth-context';
import { useRegisterDeviceOnSignIn } from '../../lib/use-register-device-on-sign-in';

export default function AppLayout() {
  const { status } = useAuth();
  useRegisterDeviceOnSignIn();

  if (status === 'bootstrapping') {
    return null;
  }
  if (status !== 'signed-in') {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerRight: () => (
            <Pressable testID="open-settings" onPress={() => router.push('/settings')}>
              <Text>Settings</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
