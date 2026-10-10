// Wire types for the backend API under API_PREFIX. Keep these 1:1 with the
// server's schema so a contract change shows up as a visible diff here.

export type DeviceTokenProvider = 'fcm' | 'apns';
export type DevicePlatform = 'ios' | 'android';

export interface DeviceTokenRegisterRequest {
  provider: DeviceTokenProvider;
  platform: DevicePlatform;
  token: string;
}

export interface DeviceToken {
  id: string;
  provider: DeviceTokenProvider;
  platform: DevicePlatform;
  created_at: string;
  last_registered_at: string;
  last_delivered_at: string | null;
  revoked_at: string | null;
  dead_at: string | null;
  dead_reason: string | null;
}

export interface LoginResponse {
  user_id: string;
  email: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    field?: string | null;
  };
}

// What a push notification's data payload must carry for deep linking: an
// in-app route. Ids and routes only, never full URLs or sensitive content.
export interface PushDeepLinkData {
  route: string;
}
