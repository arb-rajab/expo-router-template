import { useColorScheme } from 'react-native';

export type ColorPalette = {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  onPrimary: string;
  danger: string;
  onDanger: string;
};

export const lightColors: ColorPalette = {
  background: '#FFFFFF',
  surface: '#F5F6F8',
  text: '#0B1220',
  textMuted: '#555555',
  border: '#CCCCCC',
  primary: '#0B1220',
  onPrimary: '#FFFFFF',
  danger: '#B00020',
  onDanger: '#FFFFFF',
};

export const darkColors: ColorPalette = {
  background: '#0B1220',
  surface: '#1A2335',
  text: '#F5F6F8',
  textMuted: '#A8B0BF',
  border: '#3A4560',
  primary: '#F5F6F8',
  onPrimary: '#0B1220',
  danger: '#FF6B81',
  onDanger: '#0B1220',
};

/**
 * Palette for the current color scheme. app.json pins `userInterfaceStyle` to
 * "light", so the dark palette only applies once you change that setting.
 */
export function useColors(): ColorPalette {
  return useColorScheme() === 'dark' ? darkColors : lightColors;
}
