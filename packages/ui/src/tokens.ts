// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
// Platform-agnostic constants shared between web (Tailwind) and mobile (RN styles).
// These are raw values; each platform maps them to its own styling system.

export const tokens = {
  color: {
    primary:   '#4f46e5',
    primaryDark: '#4338ca',
    success:   '#10b981',
    warning:   '#f59e0b',
    danger:    '#f43f5e',
    bg:        '#f8fafc',
    surface:   '#ffffff',
    text:      '#0f172a',
    textMuted: '#64748b',
    border:    '#e2e8f0',
    // dark (admin)
    darkBg:      '#020617',
    darkSurface: '#0f172a',
    darkBorder:  '#1e293b',
    darkText:    '#e2e8f0',
  },
  radius: {
    sm:  8,
    md:  12,
    lg:  16,
    xl:  20,
    xxl: 24,
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48,
  },
  font: {
    regular:  'DMSans_400Regular',
    medium:   'DMSans_500Medium',
    semibold: 'DMSans_600SemiBold',
    bold:     'DMSans_700Bold',
    black:    'DMSans_800ExtraBold',
  },
  fontSize: {
    xs: 10, sm: 12, base: 14, md: 16, lg: 18, xl: 22, xxl: 28, display: 32,
  },
  // Minimum touch targets per platform guideline
  touchTarget: {
    ios: 44,
    android: 48,
  },
} as const

export type Tokens = typeof tokens
