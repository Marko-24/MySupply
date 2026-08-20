import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, View, StyleSheet } from "react-native";

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const bottomMargin = Platform.OS === "web" ? 16 : Math.max(insets.bottom, 12);

    // Нежни светли бои
    const activeColor = "#10B981"; // Суптилна свежа зелена
    const inactiveColor = "#9CA3AF"; // Мек пастелен сива
    const activePillBg = "#ECFDF5"; // Многу нежна зеленкаста основа за активниот икон
    const barBackground = "#FFFFFF"; // Чиста бела позадина
    const borderColor = "#F3F4F6"; // Многу бледа гранична линија

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: activeColor,
                tabBarInactiveTintColor: inactiveColor,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarHideOnKeyboard: true,
                tabBarLabelStyle: styles.label,
                tabBarStyle: [
                    styles.floatingTabBar,
                    {
                        bottom: bottomMargin,
                        backgroundColor: barBackground,
                        borderColor: borderColor,
                    },
                ],
                tabBarBackground: () => (
                    <View style={styles.background} />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Feed",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="house.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="cart.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="list.bullet.clipboard.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="heart.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="person.crop.circle.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    floatingTabBar: {
        position: "absolute",
        left: 16,
        right: 16,
        height: 64,
        borderRadius: 32,
        borderWidth: 1,
        paddingBottom: 6,
        paddingTop: 6,

        // Многу мека и топла светла сенка
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        overflow: "hidden",
    },
    iconBox: {
        width: 38,
        height: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 2,
    },
    label: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: -0.1,
    },
});