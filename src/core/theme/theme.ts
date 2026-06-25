import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type AppColors } from '@/core/theme/colors';
import { radii, spacing, typography } from '@/core/theme/tokens';

export type AppTheme = {
  dark: boolean;
  colors: AppColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};

export function useTheme(): AppTheme {
  const dark = useColorScheme() === 'dark';
  return { dark, colors: dark ? darkColors : lightColors, spacing, radii, typography };
}