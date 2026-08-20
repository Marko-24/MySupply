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

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
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

    async function handleRegister() {
        if (!email || !password || !fullName) {
            Alert.alert('Грешка', 'Пополнете ги сите полиња.');
            return;
        }

        setLoading(true);

        try {
            const redirectUri = AuthSession.makeRedirectUri({
                scheme: 'mysupply',
                path: 'oauth/callback',
            });

            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password,
                options: {
                    emailRedirectTo: redirectUri,
                    data: { full_name: fullName.trim() },
                },
            });

            if (error) {
                Alert.alert('Грешка при регистрација', error.message);
                return;
            }

            // Проверка за постоечки мејл (ако Prevent email enumeration е вклучено во Supabase)
            if (data?.user && data?.user?.identities && data.user.identities.length === 0) {
                Alert.alert('Грешка', 'Корисник со оваа е-пошта веќе постои. Ве молиме најавете се.');
                return;
            }

            if (data?.user && !data?.session) {
                Alert.alert(
                    'Потврдете ја вашата е-пошта',
                    'Успешна регистрација! Испративме линк за потврда на вашата е-пошта.',
                    [{ text: 'Во ред', onPress: () => router.push('/(auth)/login' as any) }]
                );
            } else if (data?.session && data?.user) {
                await redirectBasedOnRole(data.user.id);
            }
        } catch (err: any) {
            Alert.alert('Грешка', err.message || 'Се појави неочекувана грешка.');
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleRegister() {
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
                Alert.alert('Грешка при Google регистрација', error.message);
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
                            // 1. Провери дали веќе постои профил за овој Google корисник
                            const { data: existingProfile } = await supabase
                                .from('profiles')
                                .select('id')
                                .eq('id', sessionData.user.id)
                                .maybeSingle();

                            if (existingProfile) {
                                // Доколку постои -> ОДЈАВИ ГО и спречи повторна регистрација
                                await supabase.auth.signOut();
                                Alert.alert(
                                    'Профилот веќе постои',
                                    'Веќе има регистриран профил со овој Google акаунт. Ве молиме најавете се.'
                                );
                                return;
                            }

                            // 2. Доколку НЕ постои -> Креирај нов профил во таблицата
                            const googleName =
                                sessionData.user.user_metadata?.full_name ||
                                sessionData.user.user_metadata?.name ||
                                '';

                            const { error: profileError } = await supabase
                                .from('profiles')
                                .insert([
                                    {
                                        id: sessionData.user.id,
                                        email: sessionData.user.email,
                                        full_name: googleName,
                                        role: 'customer',
                                    },
                                ]);

                            if (profileError) {
                                await supabase.auth.signOut();
                                Alert.alert('Грешка', 'Не успеа креирањето на профилот.');
                                return;
                            }

                            await redirectBasedOnRole(sessionData.user.id);
                        }
                    }
                }
            }
        } catch (err: any) {
            Alert.alert('Грешка', err.message || 'Се појави проблем при регистрацијата.');
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
                        subtitle="Креирајте сметка за да започнете."
                        googleLoading={googleLoading}
                        onGooglePress={handleGoogleRegister}
                        footerText="Веќе имате профил?"
                        footerLinkText="Најавете се"
                        onFooterLinkPress={() => router.push('/(auth)/login' as any)}
                    >
                        <AuthInput
                            iconName="person-outline"
                            placeholder="Име и презиме"
                            value={fullName}
                            onChangeText={setFullName}
                        />
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
                        <PrimaryButton title="Регистрирај се" onPress={handleRegister} loading={loading} />
                    </AuthLayout>
                </View>
            </Animated.ScrollView>
        </KeyboardAvoidingView>
    );
}