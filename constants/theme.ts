export const SchemeColors = {
    light: {
        primary: '#44b273',
        primaryDark: '#2e8b57',
        surface: '#ffffff',
        background: '#F4F7F5',
        foreground: '#0D3B22',
        muted: '#607274',
        border: '#E2E8F0',
        success: '#2e8b57',
        warning: '#f59e0b',
        error: '#ef4444',
        textPrimary: '#0D3B22',
        textSecondary: '#607274',
        cardBackground: '#ffffff',
        inputBackground: '#ffffff',
    },
    dark: {
        primary: '#44b273',
        primaryDark: '#2e8b57',
        surface: '#1e293b',
        background: '#0f172a',
        foreground: '#f8fafc',
        muted: '#94a3b8',
        border: '#334155',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#f87171',
        textPrimary: '#f8fafc',
        textSecondary: '#94a3b8',
        cardBackground: '#1e293b',
        inputBackground: '#1e293b',
    },
};

export type ColorScheme = 'light' | 'dark';
export type ThemeColorPalette = typeof SchemeColors.light;

// Резервни експорти за компоненти што пристапуваат директно преку COLORS или Colors
export const Colors = SchemeColors;
export const COLORS = {
    ...SchemeColors.light,
    primaryGradient: ['#44b273', '#2e8b57'] as [string, string],
};

export const RADIUS = {
    card: 16,
    button: 12,
    input: 12,
};