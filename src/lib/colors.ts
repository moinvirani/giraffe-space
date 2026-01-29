// Giraffe App - Warm Savanna Color Palette
export const colors = {
  // Primary - Warm Giraffe Yellow/Orange
  primary: {
    50: '#FFF8E7',
    100: '#FFEFC4',
    200: '#FFE49D',
    300: '#FFD876',
    400: '#FFCB4F',
    500: '#F5A623', // Main giraffe color
    600: '#E09112',
    700: '#C07A0A',
    800: '#9A6208',
    900: '#7A4E06',
  },
  // Secondary - Soft Sage Green
  sage: {
    50: '#F4F7F4',
    100: '#E8EFE8',
    200: '#D1DFD1',
    300: '#A8C4A8',
    400: '#7FA97F',
    500: '#5A8A5A',
    600: '#486E48',
    700: '#385538',
    800: '#2A3F2A',
    900: '#1C2A1C',
  },
  // Accent - Peachy Coral
  coral: {
    50: '#FFF5F2',
    100: '#FFEAE4',
    200: '#FFD5C9',
    300: '#FFB5A3',
    400: '#FF9478',
    500: '#FF7F5C',
    600: '#E86A47',
    700: '#C95536',
    800: '#A84428',
    900: '#87361F',
  },
  // Cream/Background
  cream: {
    50: '#FFFDFB',
    100: '#FFF9F3',
    200: '#FFF3E6',
    300: '#FFECD6',
    400: '#FFE4C4',
    500: '#FFDAB3',
    600: '#E6C49F',
    700: '#CCAE8C',
    800: '#B39878',
    900: '#998265',
  },
  // Jackal - Muted Purple/Gray
  jackal: {
    50: '#F5F4F6',
    100: '#EBEAED',
    200: '#D7D5DB',
    300: '#B8B4C0',
    400: '#9490A0',
    500: '#716C80',
    600: '#5A5668',
    700: '#454250',
    800: '#302E38',
    900: '#1C1B21',
  },
  // Semantic colors
  success: '#4CAF50',
  error: '#E57373',
  warning: '#FFB74D',
  info: '#64B5F6',
};

// Theme configuration
export const theme = {
  light: {
    background: colors.cream[50],
    surface: colors.cream[100],
    surfaceElevated: '#FFFFFF',
    text: colors.jackal[800],
    textSecondary: colors.jackal[500],
    textMuted: colors.jackal[400],
    primary: colors.primary[500],
    primaryLight: colors.primary[100],
    accent: colors.coral[500],
    border: colors.cream[300],
  },
  dark: {
    background: colors.jackal[900],
    surface: colors.jackal[800],
    surfaceElevated: colors.jackal[700],
    text: colors.cream[100],
    textSecondary: colors.cream[300],
    textMuted: colors.jackal[400],
    primary: colors.primary[400],
    primaryLight: colors.primary[900],
    accent: colors.coral[400],
    border: colors.jackal[700],
  },
};
