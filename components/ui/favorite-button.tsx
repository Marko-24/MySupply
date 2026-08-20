import React from "react";
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent } from "react-native";

interface FavoriteButtonProps {
    isFavorite: boolean;
    onPress: () => void;
}

export function FavoriteButton({ isFavorite, onPress }: FavoriteButtonProps) {
    const handlePress = (e: GestureResponderEvent) => {
        e.stopPropagation(); // Блокира отворање на детали за картичката кога се клика срцето
        onPress();
    };

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.7}
            onPress={handlePress}
        >
            <Text style={styles.icon}>{isFavorite ? "🤍" : "💚"}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    icon: {
        fontSize: 18,
    },
});