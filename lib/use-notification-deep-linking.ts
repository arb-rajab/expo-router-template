import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

import { extractDeepLinkData, routeFor } from './push-notifications';

/**
 * Wires a tapped push notification to in-app navigation for all three states
 * a tap can happen from (foreground, background, killed). The hook
 * `useLastNotificationResponse` covers all three: a live tap fires a fresh
 * response, and a cold start picks up the response the native side recorded
 * before JS started. Responses are deduped by notification identifier.
 *
 * A real OS cold launch and real FCM/APNs delivery can only be verified on a
 * physical device with real credentials; the unit test exercises this hook
 * with a fabricated NotificationResponse.
 */
export function useNotificationDeepLinking(): void {
  const response = Notifications.useLastNotificationResponse();
  const handledIdentifier = useRef<string | null>(null);

  useEffect(() => {
    if (!response) return;

    const identifier = response.notification.request.identifier;
    if (handledIdentifier.current === identifier) return;
    handledIdentifier.current = identifier;

    const data = extractDeepLinkData(response);
    if (!data) return;

    router.push(routeFor(data) as never);
  }, [response]);
}
