import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Вчитај ја моменталната сесија
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        // Слушај промени во сесијата
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);

        if (error) {
            Alert.alert("Грешка при одјава", error.message);
        } else {
            router.replace("/(auth)/login");
        }
    };

    const handleMenuPress = (label: string) => {
        if (!user) {
            Alert.alert("Најава е потребна", "Ве молиме најавете се за да пристапите до овие опции.", [
                { text: "Откажи", style: "cancel" },
                { text: "Најави се", onPress: () => router.push("/(auth)/login") },
            ]);
            return;
        }
        // Пренасочувања за мени ставките
    };

    // Земање на името од метаподатоците
    const fullName = user?.user_metadata?.full_name || "Корисник";

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Профил</Text>
                        <Text style={styles.subtitle}>Управувајте со вашата сметка</Text>
                    </View>

                    {/* Profile Card */}
                    <View style={styles.profileCard}>
                        {user ? (
                            // Кога корисникот Е НАЈАВЕН
                            <View style={styles.userInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {fullName.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <Text style={styles.userName}>{fullName}</Text>
                                <Text style={styles.userEmail}>{user.email}</Text>

                                <TouchableOpacity
                                    onPress={handleSignOut}
                                    disabled={loading}
                                    style={styles.logoutButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#EF4444" />
                                    ) : (
                                        <Text style={styles.logoutButtonText}>Одјави се</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            // Кога НЕМА НАЈАВЕН КОРИСНИК
                            <View style={styles.guestInfo}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarIcon}>👤</Text>
                                </View>
                                <Text style={styles.guestTitle}>Добредојдовте во MySupply</Text>
                                <Text style={styles.guestSubtitle}>
                                    Најавете се или креирајте нов профил за да започнете.
                                </Text>

                                <TouchableOpacity
                                    onPress={() => router.push("/(auth)/login")}
                                    style={styles.primaryButton}
                                >
                                    <Text style={styles.primaryButtonText}>Најави се</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => router.push("/(auth)/register")}
                                    style={styles.secondaryButton}
                                >
                                    <Text style={styles.secondaryButtonText}>Креирај профил</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuContainer}>
                        {[
                            { label: "Мој профил", icon: "✏️" },
                            { label: "Адреси за достава", icon: "📍" },
                            { label: "Методи за плаќање", icon: "💳" },
                            { label: "Известувања", icon: "🔔" },
                            { label: "Помош и поддршка", icon: "❓" },
                        ].map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleMenuPress(item.label)}
                                style={styles.menuItem}
                            >
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    content: {
        padding: 20,
        gap: 20,
        marginTop: 20,
    },
    header: {
        marginBottom: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: "#eee",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    userInfo: {
        alignItems: "center",
        gap: 6,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "#e8f7ee",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    avatarText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#44b273",
    },
    avatarIcon: {
        fontSize: 32,
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    userEmail: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
    },
    logoutButton: {
        borderWidth: 1.5,
        borderColor: "#EF4444",
        borderRadius: 9,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "100%",
        alignItems: "center",
        marginTop: 10,
    },
    logoutButtonText: {
        color: "#EF4444",
        fontWeight: "600",
        fontSize: 15,
    },
    guestInfo: {
        alignItems: "center",
        gap: 10,
    },
    guestTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
    },
    guestSubtitle: {
        fontSize: 13,
        color: "#666",
        textAlign: "center",
        marginBottom: 8,
    },
    primaryButton: {
        backgroundColor: "#44b273",
        borderRadius: 9,
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
    },
    primaryButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
    },
    secondaryButton: {
        borderWidth: 1.5,
        borderColor: "#44b273",
        borderRadius: 9,
        paddingVertical: 12,
        width: "100%",
        alignItems: "center",
    },
    secondaryButtonText: {
        color: "#44b273",
        fontWeight: "600",
        fontSize: 16,
    },
    menuContainer: {
        marginTop: 10,
        gap: 4,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 9,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 14,
    },
    menuLabel: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    menuArrow: {
        fontSize: 20,
        color: "#ccc",
    },
});