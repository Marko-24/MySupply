import React, { useState } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    async function handleRegister() {
        if (!email || !password || !fullName) {
            Alert.alert('Грешка', 'Пополнете ги сите полиња.');
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                data: {
                    full_name: fullName.trim(),
                },
            },
        });

        setLoading(false);

        if (error) {
            Alert.alert('Грешка при регистрација', error.message);
        } else {
            Alert.alert('Успешна регистрација!', 'Проверете ја вашата е-пошта за потврда (доколку е овозможена потврда).');
        }
    }

    async function handleGoogleRegister() {
        try {
            setGoogleLoading(true);

            // 1. Автоматски генерира правилен Redirect URI за Expo Go или Native
            const redirectUri = AuthSession.makeRedirectUri({
                scheme: 'mysupply',
                path: 'oauth/callback',
            });

            console.log('Поставен Redirect URI:', redirectUri);

            // 2. Иницирање на Google OAuth во Supabase
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
                // 3. Отворање на веб сесијата
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);

                if (result.type === 'success' && result.url) {
                    // Извлекување на URL параметрите
                    const url = new URL(result.url);
                    const params = new URLSearchParams(url.hash ? url.hash.substring(1) : url.search);

                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');

                    if (accessToken && refreshToken) {
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (sessionError) {
                            Alert.alert('Грешка при сесија', sessionError.message);
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
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/logo.jpg')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>MySupply</Text>
            <Text style={styles.h5}>Добредојдовте! Регистрирајте се за да продолжите.</Text>

            {/* Копче за регистрација со Google */}
            <TouchableOpacity
                onPress={handleGoogleRegister}
                disabled={loading || googleLoading}
                style={[styles.googleButton, (loading || googleLoading) && styles.buttonDisabled]}
            >
                {googleLoading ? (
                    <ActivityIndicator color="#757575" />
                ) : (
                    <Text style={styles.googleButtonText}>Регистрирај се со Google</Text>
                )}
            </TouchableOpacity>

            {/* Разделник */}
            <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>или со е-пошта</Text>
                <View style={styles.dividerLine} />
            </View>

            <TextInput
                placeholder="Име и презиме"
                value={fullName}
                onChangeText={setFullName}
                style={styles.input}
            />

            <TextInput
                placeholder="Е-пошта"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />

            <TextInput
                placeholder="Лозинка"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <TouchableOpacity
                onPress={handleRegister}
                disabled={loading || googleLoading}
                style={[styles.button, (loading || googleLoading) && styles.buttonDisabled]}
            >
                {loading ? (
                    <ActivityIndicator color="#44b273" />
                ) : (
                    <Text style={styles.buttonText}>Регистрирај се</Text>
                )}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Веќе имате сметка? </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
                    <Text style={styles.registerLink}>Најавете се</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#44b273',
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: 'Geist'
    },
    h5: {
        fontSize: 15,
        fontWeight: '200',
        marginBottom: 25,
        color: '#333333',
        textAlign: 'center',
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        marginBottom: 12,
        borderRadius: 9,
        width: '100%',
    },
    googleButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 9,
        paddingVertical: 12,
        backgroundColor: '#fff',
        width: '100%',
        alignSelf: 'center',
    },
    googleButtonText: {
        color: '#333',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#888',
        fontSize: 13,
    },
    button: {
        borderWidth: 1.5,
        borderColor: '#44b273',
        borderRadius: 9,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        marginTop: 15,
        width: 180,
        alignSelf: 'center',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#44b273',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25,
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#44b273',
        fontWeight: 'bold',
        fontSize: 14,
    },
});