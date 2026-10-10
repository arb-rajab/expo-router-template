import React from 'react';
import { render } from '@testing-library/react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import type { NotificationResponse } from 'expo-notifications';

import { useNotificationDeepLinking } from '../use-notification-deep-linking';

jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

jest.mock('expo-notifications', () => ({
  useLastNotificationResponse: jest.fn(),
  setNotificationHandler: jest.fn(),
}));

/**
 * Renders the actual production hook (`useNotificationDeepLinking`, the same
 * one app/_layout.tsx mounts) and fakes only what a real device would supply:
 * the native notification-response event and expo-router's navigator.
 *
 * Not verifiable here: an OS cold-launching the app from a notification tap,
 * or a push arriving from real FCM/APNs. Both need a physical device.
 */
function fakeResponse(
  identifier: string,
  data: Record<string, unknown> | undefined
): NotificationResponse {
  return {
    notification: {
      date: Date.now(),
      request: {
        identifier,
        content: {
          title: 'Hello',
          subtitle: null,
          body: 'Something happened.',
          data,
          categoryIdentifier: null,
          sound: 'default',
        } as never,
        trigger: { type: 'push' },
      },
    },
    actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  };
}

function Harness() {
  useNotificationDeepLinking();
  return null;
}

const mockUseLastNotificationResponse =
  Notifications.useLastNotificationResponse as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useNotificationDeepLinking', () => {
  it('navigates to the in-app route when a push is tapped', async () => {
    mockUseLastNotificationResponse.mockReturnValue(fakeResponse('req-1', { route: '/items/42' }));

    await render(<Harness />);

    expect(router.push).toHaveBeenCalledWith('/items/42');
  });

  it('does nothing before the hook has resolved (undefined)', async () => {
    mockUseLastNotificationResponse.mockReturnValue(undefined);
    await render(<Harness />);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('does nothing when there is no prior tap to resume from (null)', async () => {
    mockUseLastNotificationResponse.mockReturnValue(null);
    await render(<Harness />);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('ignores a response whose payload has no usable route', async () => {
    mockUseLastNotificationResponse.mockReturnValue(
      fakeResponse('req-2', { some: 'unrelated payload' })
    );
    await render(<Harness />);
    expect(router.push).not.toHaveBeenCalled();
  });

  it('does not re-navigate for a new object carrying the same notification identifier', async () => {
    mockUseLastNotificationResponse.mockReturnValue(fakeResponse('req-3', { route: '/items/7' }));
    const { rerender } = await render(<Harness />);
    expect(router.push).toHaveBeenCalledTimes(1);

    // A fresh object for the same underlying notification (identifier matches).
    mockUseLastNotificationResponse.mockReturnValue(fakeResponse('req-3', { route: '/items/7' }));
    await rerender(<Harness />);

    expect(router.push).toHaveBeenCalledTimes(1);
  });

  it('navigates again for a genuinely new notification', async () => {
    mockUseLastNotificationResponse.mockReturnValue(fakeResponse('req-4', { route: '/items/1' }));
    const { rerender } = await render(<Harness />);
    expect(router.push).toHaveBeenNthCalledWith(1, '/items/1');

    mockUseLastNotificationResponse.mockReturnValue(fakeResponse('req-5', { route: '/items/2' }));
    await rerender(<Harness />);

    expect(router.push).toHaveBeenNthCalledWith(2, '/items/2');
  });
});
