import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import FoodBackground from './FoodBackground';
import { GlassPressable } from './GlassPressable';
import { RADIUS } from '@/constants/theme';
import { useColors } from '@/hooks/use-colors';

interface AuthLayoutProps {
    children: React.ReactNode;
    subtitle: string;
    googleLoading: boolean;
    onGooglePress: () => void;
    footerText: string;
    footerLinkText: string;
    onFooterLinkPress: () => void;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
                                                          children,
                                                          subtitle,
                                                          googleLoading,
                                                          onGooglePress,
                                                          footerText,
                                                          footerLinkText,
                                                          onFooterLinkPress,
                                                      }) => {
    const colors = useColors();

    const primaryColor = colors?.primary ?? '#44b273';
    const backgroundColor = colors?.background ?? '#F4F7F5';
    const textColor = colors?.foreground ?? colors?.textPrimary ?? '#0D3B22';
    const subtitleColor = colors?.muted ?? colors?.textSecondary ?? '#607274';
    const cardBgColor = colors?.cardBackground ?? colors?.surface ?? '#ffffff';
    const borderColor = colors?.border ?? '#E2E8F0';

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <FoodBackground />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Хедер */}
                <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.headerContainer}>
                    <Image source={require('@/assets/images/logo-transparent.png')} style={styles.logo} resizeMode="contain" />
                    <View style={styles.brandWrapper}>
                        <View style={[styles.myBadge, { backgroundColor: primaryColor }]}>
                            <Text style={styles.myBadgeText}>My</Text>
                        </View>
                        <Text style={[styles.supplyText, { color: textColor }]}>Supply</Text>
                    </View>
                    <Text style={[styles.subtitle, { color: subtitleColor }]}>{subtitle}</Text>
                </Animated.View>

                {/* Форма Картичка */}
                <Animated.View entering={FadeInDown.delay(150).duration(600)} style={[styles.glassCard, { backgroundColor: cardBgColor, borderColor }]}>
                    <GlassPressable onPress={onGooglePress} disabled={googleLoading} style={[styles.googleButton, { borderColor }]}>
                        {googleLoading ? (
                            <ActivityIndicator color={primaryColor} />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 8 }} />
                                <Text style={[styles.googleText, { color: textColor }]}>Продолжи со Google</Text>
                            </View>
                        )}
                    </GlassPressable>

                    <View style={styles.dividerContainer}>
                        <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                        <Text style={[styles.dividerText, { color: subtitleColor }]}>или со е-пошта</Text>
                        <View style={[styles.dividerLine, { backgroundColor: borderColor }]} />
                    </View>

                    {children}
                </Animated.View>

                {/* Подножје */}
                <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.footer}>
                    <Text style={[styles.footerText, { color: subtitleColor }]}>{footerText} </Text>
                    <Text style={[styles.footerLink, { color: primaryColor }]} onPress={onFooterLinkPress}>
                        {footerLinkText}
                    </Text>
                </Animated.View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, paddingHorizontal: 22, justifyContent: 'center', zIndex: 2 },
    headerContainer: { alignItems: 'center', marginBottom: 24 },
    logo: { width: 120, height: 120, marginBottom: 8 },
    brandWrapper: { flexDirection: 'row', alignItems: 'center' },
    myBadge: { paddingHorizontal: 12, paddingVertical: 2, borderRadius: 12, marginRight: 6 },
    myBadgeText: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
    supplyText: { fontSize: 32, fontWeight: '900' },
    subtitle: { fontSize: 14, marginTop: 8, textAlign: 'center' },
    glassCard: {
        borderRadius: RADIUS?.card ?? 16,
        padding: 20,
        borderWidth: 1.5,
        elevation: 5,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: RADIUS?.button ?? 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonContent: { flexDirection: 'row', alignItems: 'center' },
    googleText: { fontSize: 14, fontWeight: '600' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { marginHorizontal: 10, fontSize: 12 },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    footerText: { fontSize: 14 },
    footerLink: { fontWeight: '700', fontSize: 14 },
});