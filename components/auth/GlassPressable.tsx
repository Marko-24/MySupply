import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface GlassPressableProps {
    onPress: () => void;
    disabled?: boolean;
    style?: StyleProp<ViewStyle>;
    children: React.ReactNode;
}

export const GlassPressable: React.FC<GlassPressableProps> = ({ onPress, disabled, style, children }) => {
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
            <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
        </Pressable>
    );
};