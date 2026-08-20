import { SchemeColors, type ColorScheme, type ThemeColorPalette } from "@/constants/theme";
import { useColorScheme } from "./use-color-scheme";

export function useColors(colorSchemeOverride?: ColorScheme): ThemeColorPalette {
    const colorSchema = useColorScheme();
    const scheme = (colorSchemeOverride ?? colorSchema ?? "light") as ColorScheme;

    return SchemeColors?.[scheme] ?? SchemeColors.light;
}