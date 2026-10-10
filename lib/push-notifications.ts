import * as Notifications from 'expo-notifications';

import type { PushDeepLinkData } from './api-types';

// Foreground presentation: show pushes as a banner while the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Pure extraction of the deep-link field a push's data payload carries
 * (`route`, an in-app path such as "/items/42"). Kept separate from any
 * navigation call so it can be unit-tested against fabricated payloads.
 *
 * Only in-app absolute paths are accepted: a missing, non-string, empty,
 * scheme-bearing or protocol-relative ("//host") route is rejected, so a
 * crafted payload can't navigate anywhere unexpected.
 */
export function extractDeepLinkData(
  response: Notifications.NotificationResponse
): PushDeepLinkData | null {
  const data = response.notification.request.content.data as
    | Record<string, unknown>
    | undefined;

  const route = data?.route;
  if (typeof route !== 'string') return null;
  if (!route.startsWith('/') || route.startsWith('//')) return null;
  if (route.includes('://')) return null;

  return { route };
}

/** The in-app route a given push's deep-link data should open. */
export function routeFor(data: PushDeepLinkData): string {
  return data.route;
}
