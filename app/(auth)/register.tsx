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
    Dimensions,
} from 'react-native';
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState<string | null>(null);

    const router = useRouter();
    const scrollViewRef = React.useRef<ScrollView>(null);

    // Анимација за стрелката што укажува на лизгање
    const arrowOffsetY = useSharedValue(0);
    React.useEffect(() => {
        arrowOffsetY.value = withRepeat(
            withSequence(
                withTiming(8, { duration: 800 }),
                withTiming(0, { duration: 800 })
            ),
            -1,
            true
        );
    }, []);

    const animatedArrowStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: arrowOffsetY.value }],
    }));

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
                        } else if (sessionData?.user) {
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
            style={{ flex: 1, backgroundColor: '#F0F6F2' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                ref={scrollViewRef}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
            >
                {/* PAGE 1: Добредојдовте & Лого со Храна */}
                <View style={styles.firstPage}>
                    {/* Лебдечки елементи со храна */}
                    <View style={styles.floatingContainer} pointerEvents="none">
                        <Animated.Text entering={FadeInDown.delay(100).duration(800)} style={[styles.foodItem, { top: '12%', left: '10%', transform: [{ rotate: '-15deg' }] }]}>🍕</Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(200).duration(800)} style={[styles.foodItem, { top: '18%', right: '12%', transform: [{ rotate: '20deg' }] }]}>🥑</Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(300).duration(800)} style={[styles.foodItem, { top: '42%', left: '5%', transform: [{ rotate: '10deg' }] }]}>🥐</Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(400).duration(800)} style={[styles.foodItem, { top: '45%', right: '8%', transform: [{ rotate: '-25deg' }] }]}>🍔</Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(500).duration(800)} style={[styles.foodItem, { bottom: '22%', left: '15%', transform: [{ rotate: '15deg' }] }]}>🥦</Animated.Text>
                        <Animated.Text entering={FadeInDown.delay(600).duration(800)} style={[styles.foodItem, { bottom: '20%', right: '15%', transform: [{ rotate: '-10deg' }] }]}>🍎</Animated.Text>
                    </View>

                    {/* Централен Садржител */}
                    <Animated.View entering={FadeInUp.duration(1000).springify()} style={styles.centerHero}>
                        <Image
                            source={require('../../assets/images/logo-transparent.png')}
                            style={styles.heroLogo}
                            resizeMode="contain"
                        />

                        <View style={styles.brandTitleWrapper}>
                            <LinearGradient
                                colors={['#44b273', '#2e8b57', '#1b5e20']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientBadge}
                            >
                                <Text style={styles.heroBrandTitle}>MySupply</Text>
                            </LinearGradient>
                        </View>

                        <Text style={styles.heroSubtitle}>Локална храна. Помалку отпад. Повеќе вредност.</Text>
                    </Animated.View>

                    {/* Покана за лизгање надолу */}
                    <Pressable onPress={scrollToForm} style={styles.swipePrompt}>
                        <Text style={styles.swipeText}>Регистрирајте се</Text>
                        <Animated.View style={animatedArrowStyle}>
                            <Ionicons name="chevron-down-outline" size={26} color="#44b273" />
                        </Animated.View>
                    </Pressable>
                </View>

                {/* PAGE 2: Форма за регистрација */}
                <View style={styles.secondPage}>
                    <Animated.View entering={FadeInUp.duration(600)} style={styles.formHeader}>
                        <Text style={styles.formTitle}>Креирај сметка</Text>
                        <Text style={styles.formSubtitle}>Започнете со користење за неколку секунди</Text>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.glassCard}>
                        {/* Google Копче */}
                        <GlassPressable
                            onPress={handleGoogleRegister}
                            disabled={loading || googleLoading}
                            style={[styles.googleButton, (loading || googleLoading) && styles.disabled]}
                        >
                            {googleLoading ? (
                                <ActivityIndicator color="#44b273" />
                            ) : (
                                <View style={styles.buttonContent}>
                                    <Ionicons name="logo-google" size={18} color="#DB4437" style={{ marginRight: 8 }} />
                                    <Text style={styles.googleText}>Регистрирај се со Google</Text>
                                </View>
                            )}
                        </GlassPressable>

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>или со е-пошта</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Поле за Име */}
                        <View style={[styles.inputCard, focusedInput === 'fullName' && styles.inputCardFocused]}>
                            <Ionicons
                                name="person-outline"
                                size={18}
                                color={focusedInput === 'fullName' ? '#44b273' : '#666'}
                            />
                            <TextInput
                                placeholder="Име и презиме"
                                placeholderTextColor="#888"
                                value={fullName}
                                onChangeText={setFullName}
                                onFocus={() => setFocusedInput('fullName')}
                                onBlur={() => setFocusedInput(null)}
                                style={styles.input}
                            />
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

                        {/* Главно Градиент Копче */}
                        <GlassPressable
                            onPress={handleRegister}
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
                                    <Text style={styles.primaryText}>Регистрирај се</Text>
                                )}
                            </LinearGradient>
                        </GlassPressable>
                    </Animated.View>

                    {/* Најава линк */}
                    <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.footer}>
                        <Text style={styles.footerText}>Веќе имате сметка? </Text>
                        <Pressable onPress={() => router.push('/(auth)/login' as any)}>
                            <Text style={styles.footerLink}>Најавете се</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // ПРВ ЕКРАН
    firstPage: {
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 22,
        position: 'relative',
    },
    floatingContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    foodItem: {
        position: 'absolute',
        fontSize: 42,
        opacity: 0.85,
    },
    centerHero: {
        alignItems: 'center',
        zIndex: 2,
    },
    heroLogo: {
        width: 170,
        height: 170,
        marginBottom: 16,
    },
    brandTitleWrapper: {
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 8,
    },
    gradientBadge: {
        paddingHorizontal: 24,
        paddingVertical: 6,
        borderRadius: 18,
    },
    heroBrandTitle: {
        fontSize: 38,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#4A5568',
        fontWeight: '500',
        marginTop: 6,
        textAlign: 'center',
    },
    swipePrompt: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
        zIndex: 2,
    },
    swipeText: {
        fontSize: 13,
        color: '#2e8b57',
        fontWeight: '600',
        marginBottom: 4,
    },

    // ВТОР ЕКРАН
    secondPage: {
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        paddingHorizontal: 22,
    },
    formHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    formTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#2e8b57',
    },
    formSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
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