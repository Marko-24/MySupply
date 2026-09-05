import React, { useState, useRef } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { PrimaryButton } from '@/components/auth/PrimaryButton';
import { WelcomeSlider } from '@/components/auth/WelcomeSlider';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const router = useRouter();
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const scrollToForm = () => {
        scrollViewRef.current?.scrollTo({ y: SCREEN_HEIGHT, animated: true });
    };

    async function redirectBasedOnRole(userId: string) {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (profile?.role === 'vendor') {
                router.replace('/(vendor)' as any);
            } else {
                router.replace('/(tabs)' as any);
            }
        } catch (err) {
            router.replace('/(tabs)' as any);
        }
    }

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert('Грешка', 'Ве молиме внесете е-пошта и лозинка.');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                Alert.alert('Грешка при најава', error.message);
                return;
            }

            if (data?.user) {
                await redirectBasedOnRole(data.user.id);
            }
        } catch (err: any) {
            Alert.alert('Грешка', err.message || 'Се појави неочекувана грешка.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
        try {
            setGoogleLoading(true);

            const redirectUri = AuthSession.makeRedirectUri({
                scheme: 'mysupply',
                path: 'oauth/callback',
            });

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUri,
                    skipBrowserRedirect: true,
                },
            });

            if (error) {
                Alert.alert('Грешка при Google најава', error.message);
                return;
            }

            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

                if (result.type === 'success' && result.url) {
                    const url = new URL(result.url);
                    const params = new URLSearchParams(url.hash ? url.hash.substring(1) : url.search);

                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken && refreshToken) {
                        const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (sessionError) {
                            Alert.alert('Грешка при сесија', sessionError.message);
                            return;
                        }

                        if (sessionData?.user) {
                            // Проверка дали постои веќе креиран профил во таблицата
                            const { data: profile, error: profileError } = await supabase
                                .from('profiles')
                                .select('id')
                                .eq('id', sessionData.user.id)
                                .maybeSingle();

                            if (profileError || !profile) {
                                await supabase.auth.signOut();
                                Alert.alert(
                                    'Не постои профил',
                                    'Нема регистриран профил со овој Google акаунт. Ве молиме прво регистрирајте се.'
                                );
                                return;
                            }

                            await redirectBasedOnRole(sessionData.user.id);
                        }
                    }
                }
            }
        } catch (err: any) {
            Alert.alert('Грешка', err.message || 'Се појави проблем при најавата.');
        } finally {
            setGoogleLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Animated.ScrollView
                ref={scrollViewRef}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
            >
                <WelcomeSlider onSwipePress={scrollToForm} scrollY={scrollY} />

                <View style={{ height: SCREEN_HEIGHT, justifyContent: 'center' }}>
                    <AuthLayout
                        subtitle="Добредојдовте назад! Најавете се за продолжување."
                        googleLoading={googleLoading}
                        onGooglePress={handleGoogleLogin}
                        footerText="Немате профил?"
                        footerLinkText="Регистрирајте се"
                        onFooterLinkPress={() => router.push('/(auth)/register' as any)}
                    >
                        <AuthInput
                            iconName="mail-outline"
                            placeholder="Е-пошта"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <AuthInput
                            iconName="lock-closed-outline"
                            placeholder="Лозинка"
                            value={password}
                            onChangeText={setPassword}
                            isPassword
                        />
                        <PrimaryButton title="Најави се" onPress={handleLogin} loading={loading} />
                    </AuthLayout>
                </View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    );
}