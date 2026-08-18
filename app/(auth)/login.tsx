import React, { useState } from 'react';
import {
    View,
    TextInput,
    Alert,
    Text,
    StyleSheet,
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface GlassPressableProps {
    onPress: () => void;
    disabled?: boolean;
    style?: any;
    children: React.ReactNode;
}

const GlassPressable = ({ onPress, disabled, style, children }: GlassPressableProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Pressable
            onPressIn={() => (scale.value = withSpring(0.97, { damping: 15 }))}
            onPressOut={() => (scale.value = withSpring(1, { damping: 15 }))}
            onPress={onPress}
            disabled={disabled}
        >
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const router = useRouter();

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert('Грешка', 'Ве молиме внесете е-пошта и лозинка.');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        setLoading(false);

        if (error) {
            Alert.alert('Грешка при најава', error.message);
        } else {
            router.replace('/');
        }
    }

    async function handleGoogleLogin() {
        try {
            setGoogleLoading(true);
            const redirectUri = makeRedirectUri({
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
                    const rawUrl = result.url;
                    const paramsString = rawUrl.includes('#') ? rawUrl.split('#')[1] : rawUrl.split('?')[1];
                    const params = new URLSearchParams(paramsString);

                    const accessToken = params.get('access_token');
                    const refreshToken = params.get('refresh_token');
                    const errorDescription = params.get('error_description');

                    if (errorDescription) {
                        Alert.alert('Грешка', errorDescription);
                        return;
                    }

                    if (accessToken && refreshToken) {
                        const { error: sessionError } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken,
                        });

                        if (sessionError) {
                            Alert.alert('Грешка при сесија', sessionError.message);
                        } else {
                            router.replace('/');
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
            style={{ flex: 1, backgroundColor: '#F4F7F5' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Лебдечки елементи во аглите */}
            <View style={styles.floatingContainer} pointerEvents="none">
                <Animated.Text entering={FadeInDown.delay(100).duration(800)} style={[styles.foodItem, { top: 35, left: 20, transform: [{ rotate: '-15deg' }] }]}>🍕</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={[styles.foodItem, { top: 50, right: 25, transform: [{ rotate: '20deg' }] }]}>🥑</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(300).duration(800)} style={[styles.foodItem, { top: 220, left: -10, transform: [{ rotate: '10deg' }] }]}>🥐</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(400).duration(800)} style={[styles.foodItem, { top: 240, right: -5, transform: [{ rotate: '-25deg' }] }]}>🍔</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(500).duration(800)} style={[styles.foodItem, { bottom: 30, left: 15, transform: [{ rotate: '15deg' }] }]}>🥦</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(600).duration(800)} style={[styles.foodItem, { bottom: 45, right: 20, transform: [{ rotate: '-10deg' }] }]}>🍎</Animated.Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Хедер во Wolt Брендинг Стил */}
                <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/images/logo-transparent.png')}
                        style={styles.woltLogo}
                        resizeMode="contain"
                    />

                    {/* Двобоен заоблен брендинг */}
                    <View style={styles.woltBrandWrapper}>
                        <View style={styles.myBadge}>
                            <Text style={styles.myBadgeText}>My</Text>
                        </View>
                        <Text style={styles.supplyText}>Supply</Text>
                    </View>

                    <Text style={styles.subtitle}>Добредојдовте назад! Најавете се за продолжување.</Text>
                </Animated.View>

                {/* Форма за најава */}
                <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.glassCard}>
                    {/* Google Login */}
                    <GlassPressable
                        onPress={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        style={[styles.googleButton, (loading || googleLoading) && styles.disabled]}
                    >
                        {googleLoading ? (
                            <ActivityIndicator color="#44b273" />
                        ) : (
                            <View style={styles.buttonContent}>
                                <Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 8 }} />
                                <Text style={styles.googleText}>Најави се со Google</Text>
                            </View>
                        )}
                    </GlassPressable>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>или со е-пошта</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Поле за Е-пошта */}
                    <View style={[styles.inputCard, focusedInput === 'email' && styles.inputCardFocused]}>
                        <Ionicons
                            name="mail-outline"
                            size={18}
                            color={focusedInput === 'email' ? '#44b273' : '#666'}
                        />
                        <TextInput
                            placeholder="Е-пошта"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            onFocus={() => setFocusedInput('email')}
                            onBlur={() => setFocusedInput(null)}
                            style={styles.input}
                        />
                    </View>

                    {/* Поле за Лозинка */}
                    <View style={[styles.inputCard, focusedInput === 'password' && styles.inputCardFocused]}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={18}
                            color={focusedInput === 'password' ? '#44b273' : '#666'}
                        />
                        <TextInput
                            placeholder="Лозинка"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            onFocus={() => setFocusedInput('password')}
                            onBlur={() => setFocusedInput(null)}
                            style={styles.input}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                            <Ionicons
                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={18}
                                color="#888"
                            />
                        </Pressable>
                    </View>

                    {/* Копче за Најава */}
                    <GlassPressable
                        onPress={handleLogin}
                        disabled={loading || googleLoading}
                        style={{ marginTop: 6 }}
                    >
                        <LinearGradient
                            colors={['#44b273', '#2e8b57']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryButtonGradient}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryText}>Најави се</Text>
                            )}
                        </LinearGradient>
                    </GlassPressable>
                </Animated.View>

                {/* Линк за Регистрација */}
                <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.footer}>
                    <Text style={styles.footerText}>Немате профил? </Text>
                    <Pressable onPress={() => router.push('/(auth)/register' as any)}>
                        <Text style={styles.footerLink}>Регистрирајте се</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    floatingContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    foodItem: {
        position: 'absolute',
        fontSize: 38,
        opacity: 0.85,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 22,
        paddingTop: 30,
        paddingBottom: 30,
        justifyContent: 'center',
        zIndex: 2,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    woltLogo: {
        width: 150,
        height: 150,
        marginBottom: 8,
    },
    woltBrandWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    myBadge: {
        backgroundColor: '#44b273',
        paddingHorizontal: 12,
        paddingVertical: 2,
        borderRadius: 12,
        marginRight: 6,
    },
    myBadgeText: {
        fontSize: 30,
        fontWeight: '900',
        color: '#FFFFFF',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    },
    supplyText: {
        fontSize: 34,
        fontWeight: '900',
        color: '#0D3B22',
        letterSpacing: -0.5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-black',
    },
    subtitle: {
        fontSize: 14,
        color: '#607274',
        fontWeight: '600',
        marginTop: 8,
        textAlign: 'center',
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.95)',
        shadowColor: '#2e8b57',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
    },
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(210, 225, 215, 0.8)',
    },
    inputCardFocused: {
        borderColor: '#44b273',
        backgroundColor: '#FFFFFF',
        shadowColor: '#44b273',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#222',
        marginLeft: 10,
    },
    googleButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    googleText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 14,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(180, 200, 190, 0.5)',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#666',
        fontSize: 12,
    },
    primaryButtonGradient: {
        borderRadius: 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#44b273',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    disabled: {
        opacity: 0.6,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: '#555',
        fontSize: 14,
    },
    footerLink: {
        color: '#2e8b57',
        fontWeight: '700',
        fontSize: 14,
    },
});