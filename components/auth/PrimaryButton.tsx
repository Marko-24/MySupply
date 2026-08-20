import React from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassPressable } from './GlassPressable';
import { RADIUS } from '@/constants/theme';
import { useColors } from '@/hooks/use-colors';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    colors?: [string, string, ...string[]];
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, loading, disabled, colors: customColors }) => {
    const themeColors = useColors();

    // Секогаш осигуруваме дека има низа од бои
    const gradientColors = customColors ?? [
        themeColors?.primary ?? '#44b273',
        themeColors?.primaryDark ?? '#2e8b57',
    ];

    return (
        <GlassPressable onPress={onPress} disabled={disabled || loading} style={{ marginTop: 6 }}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
            </LinearGradient>
        </GlassPressable>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: RADIUS?.button ?? 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    text: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});