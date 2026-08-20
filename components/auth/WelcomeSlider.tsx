import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    Dimensions,
} from 'react-native';
import Animated, {
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import FoodBackground from './FoodBackground'; // Провери ја патеката до вашата FoodBackground компонента

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeSliderProps {
    onSwipePress: () => void;
    scrollY?: SharedValue<number>;
}

export const WelcomeSlider: React.FC<WelcomeSliderProps> = ({ onSwipePress, scrollY }) => {
    // Анимација за стрелката што укажува на лизгање
    const arrowOffsetY = useSharedValue(0);

    useEffect(() => {
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

    return (
        <View style={styles.firstPage}>
            {/* Паралакс лебдечка позадина со емоџи */}
            <FoodBackground scrollY={scrollY} />

            {/* Централен Херој */}
            <Animated.View entering={FadeInUp.duration(1000).springify()} style={styles.centerHero}>
                <Image
                    source={require('@/assets/images/logo-transparent.png')}
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

            {/* Копче за лизгање надолу */}
            <Pressable onPress={onSwipePress} style={styles.swipePrompt}>
                <Text style={styles.swipeText}>Регистрирајте се</Text>
                <Animated.View style={animatedArrowStyle}>
                    <Ionicons name="chevron-down-outline" size={26} color="#44b273" />
                </Animated.View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    firstPage: {
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 22,
        position: 'relative',
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
});