import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RADIUS } from '@/constants/theme';
import { useColors } from '@/hooks/use-colors';

interface AuthInputProps extends TextInputProps {
    iconName: keyof typeof Ionicons.glyphMap;
    isPassword?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({ iconName, isPassword, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const colors = useColors();
    const primaryColor = colors?.primary ?? '#44b273';
    const borderColor = isFocused ? primaryColor : (colors?.border ?? '#E2E8F0');
    const inputBg = colors?.surface ?? '#FFFFFF';

    return (
        <View style={[styles.inputCard, { borderColor, backgroundColor: inputBg }]}>
            <Ionicons name={iconName} size={18} color={isFocused ? primaryColor : '#666'} />
            <TextInput
                placeholderTextColor="#888"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                secureTextEntry={isPassword && !showPassword}
                style={styles.input}
                {...props}
            />
            {isPassword && (
                <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#888" />
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    inputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: RADIUS?.button ?? 12, // Поставено на RADIUS.button наместо несуштествувачкиот RADIUS.input
        paddingHorizontal: 14,
        height: 48,
        marginBottom: 10,
        borderWidth: 1,
    },
    input: { flex: 1, fontSize: 14, color: '#222', marginLeft: 10 },
});