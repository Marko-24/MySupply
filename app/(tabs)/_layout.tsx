import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform, View } from "react-native";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
    const tabBarHeight = 64 + bottomPadding;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.muted,
                headerShown: false,
                tabBarButton: HapticTab,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "600",
                    marginTop: 2,
                    marginBottom: -4,
                },
                tabBarStyle: {
                    paddingTop: 6,
                    paddingBottom: bottomPadding,
                    height: tabBarHeight,
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 0.5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 12,
                    elevation: 8,
                },
                tabBarBackground: () => (
                    <View style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        top: 0,
                        backgroundColor: colors.surface,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        overflow: "hidden",
                    }} />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Feed",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={26}
                            name="house.fill"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="cart"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={26}
                            name="cart.fill"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="orders"
                options={{
                    title: "Orders",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={26}
                            name="list.bullet.clipboard.fill"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: "Favorites",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={26}
                            name="heart.fill"
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <IconSymbol
                            size={26}
                            name="person.crop.circle.fill"
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}