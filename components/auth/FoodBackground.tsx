import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    SharedValue,
} from 'react-native-reanimated';

interface FoodBackgroundProps {
    scrollY?: SharedValue<number>;
}

const FOOD_ITEMS = [
    { emoji: '🍕', top: '12%', left: '10%', rotate: '-15deg', delay: 100, factor: -0.25 },
    { emoji: '🥑', top: '18%', right: '12%', rotate: '20deg', delay: 200, factor: -0.15 },
    { emoji: '🥐', top: '42%', left: '5%', rotate: '10deg', delay: 300, factor: -0.35 },
    { emoji: '🍔', top: '45%', right: '8%', rotate: '-25deg', delay: 400, factor: -0.2 },
    { emoji: '🥦', bottom: '22%', left: '15%', rotate: '15deg', delay: 500, factor: -0.3 },
    { emoji: '🍎', bottom: '20%', right: '15%', rotate: '-10deg', delay: 600, factor: -0.1 },
];

const ParallaxItem = ({ item, scrollY }: { item: typeof FOOD_ITEMS[0]; scrollY?: SharedValue<number> }) => {
    const animatedStyle = useAnimatedStyle(() => {
        if (!scrollY) return {};

        // Секое емоџи се движи со различна брзина (factor) за тродимензионален паралакс
        const translateY = interpolate(
            scrollY.value,
            [0, 500],
            [0, 500 * item.factor],
            Extrapolation.CLAMP
        );

        return {
            transform: [
                { translateY },
                { rotate: item.rotate }
            ],
        };
    });

    return (
        <Animated.View
            entering={FadeInDown.delay(item.delay).duration(800)}
            style={[
                styles.foodItemWrapper,
                {
                    top: item.top as any,
                    bottom: item.bottom as any,
                    left: item.left as any,
                    right: item.right as any,
                },
                animatedStyle,
            ]}
        >
            <Text style={styles.foodItem}>{item.emoji}</Text>
        </Animated.View>
    );
};

const FoodBackground = ({ scrollY }: FoodBackgroundProps) => {
    return (
        <View style={styles.floatingContainer} pointerEvents="none">
            {FOOD_ITEMS.map((item, index) => (
                <ParallaxItem key={index} item={item} scrollY={scrollY} />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    floatingContainer: { ...StyleSheet.absoluteFillObject, zIndex: 1 },
    foodItemWrapper: { position: 'absolute' },
    foodItem: { fontSize: 38, opacity: 0.85 },
});

export default memo(FoodBackground);