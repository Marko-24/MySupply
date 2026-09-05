import React from "react";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function VendorTabLayout() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const bottomMargin = Platform.OS === "web" ? 16 : Math.max(insets.bottom, 12);

    const activeColor = colors.primary ?? "#10B981";
    const inactiveColor = colors.muted ?? "#9CA3AF";
    const activePillBg = "#ECFDF5";
    const barBackground = colors.surface ?? "#FFFFFF";
    const borderColor = colors.border ?? "#F3F4F6";

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
                    <View style={[styles.background, { backgroundColor: barBackground }]} />
                ),
            }}
        >
            <Tabs.Screen
                name="boxes"
                options={{
                    title: "Пакети",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="archivebox.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="products"
                options={{
                    title: "Продукти",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="tag.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="reservations"
                options={{
                    title: "Резервации",
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
                name="history"
                options={{
                    title: "Историја",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="clock.fill"
                                color={focused ? activeColor : inactiveColor}
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Профил",
                    tabBarIcon: ({ focused }) => (
                        <View style={[styles.iconBox, focused && { backgroundColor: activePillBg }]}>
                            <IconSymbol
                                size={focused ? 22 : 20}
                                name="storefront.fill"
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
        shadowColor: "#64748B",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
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