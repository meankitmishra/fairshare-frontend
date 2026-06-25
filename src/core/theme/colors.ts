export const lightColors = {
  brand: '#1D9E75',
  background: '#FFFFFF',
  surface: '#F5F7F6',
  text: '#11181C',
  muted: '#687076',
  border: '#E2E6E4',
} as const;

export const darkColors = {
  brand: '#1D9E75',
  background: '#0B0F0E',
  surface: '#161B19',
  text: '#ECEDEE',
  muted: '#9BA1A6',
  border: '#272B29',
} as const;

export type AppColors = Record<keyof typeof lightColors, string>;