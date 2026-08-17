import React, { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    TextInput,
    Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Едитирање на профил
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [fullName, setFullName] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Демо гејмификација
    const gamificationStats = {
        streakDays: 4,
        points: 380,
        currentLevel: "Никулец 🌱",
        unclaimedRewardsCount: 1,
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);
            if (currentUser?.user_metadata?.full_name) {
                setFullName(currentUser.user_metadata.full_name);
            }
        });

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const currentUser = session?.user ?? null;
                setUser(currentUser);
                if (currentUser?.user_metadata?.full_name) {
                    setFullName(currentUser.user_metadata.full_name);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleUpdateProfile = async () => {
        if (!fullName.trim()) {
            Alert.alert("Грешка", "Името не може да биде празно.");
            return;
        }

        setUpdatingProfile(true);
        const { data, error } = await supabase.auth.updateUser({
            data: { full_name: fullName },
        });

        setUpdatingProfile(false);

        if (error) {
            Alert.alert("Грешка при ажурирање", error.message);
        } else {
            setUser(data.user);
            setIsEditModalVisible(false);
            Alert.alert("Успешно", "Профилот е ажуриран!");
        }
    };

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

    const navigateTo = (path: string) => {
        if (!user) {
            Alert.alert(
                "Најава е потребна",
                "Ве молиме најавете се за да пристапите до овие опции.",
                [
                    { text: "Откажи", style: "cancel" },
                    { text: "Најави се", onPress: () => router.push("/(auth)/login") },
                ]
            );
            return;
        }
        router.push(path as any);
    };

    const displayedName = user?.user_metadata?.full_name || "Корисник";

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Мој Профил</Text>
                    <Text style={styles.subtitle}>
                        Спаси храна • Поддржи ги локалните производители
                    </Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    {user ? (
                        <View style={styles.userInfo}>
                            <View style={styles.avatarContainer}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {displayedName.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.editAvatarBadge}
                                    onPress={() => setIsEditModalVisible(true)}
                                >
                                    <Text style={styles.editAvatarIcon}>✏️</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.userName}>{displayedName}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>

                            <TouchableOpacity
                                style={styles.editProfileButton}
                                onPress={() => setIsEditModalVisible(true)}
                            >
                                <Text style={styles.editProfileText}>Уреди профил</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.guestInfo}>
                            <View style={styles.avatarGuest}>
                                <Text style={styles.avatarIcon}>🧺</Text>
                            </View>
                            <Text style={styles.guestTitle}>Добредојдовте во MySupply</Text>
                            <Text style={styles.guestSubtitle}>
                                Заштедете на храна и поддржете ги локалните фармери со создавање профил.
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

                {/* GAMIFICATION & REWARDS BANNER */}
                {user && (
                    <View style={styles.gamificationSection}>
                        <View style={styles.levelBanner}>
                            <View style={styles.levelInfo}>
                                <Text style={styles.levelBadgeText}>
                                    {gamificationStats.currentLevel}
                                </Text>
                                <Text style={styles.streakText}>
                                    🔥 {gamificationStats.streakDays} недели Streak
                                </Text>
                            </View>
                            <Text style={styles.pointsText}>
                                {gamificationStats.points} Еко Поени
                            </Text>
                        </View>

                        {/* Копчиња коиводат директно до новите фајлови */}
                        <View style={styles.rewardsRow}>
                            <TouchableOpacity
                                style={styles.rewardActionCard}
                                onPress={() => navigateTo("/achievements")}
                            >
                                <Text style={styles.rewardCardIcon}>🏆</Text>
                                <View>
                                    <Text style={styles.rewardCardTitle}>Баџеви & Нивоа</Text>
                                    <Text style={styles.rewardCardSub}>Преглед на напредок</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.rewardActionCard, styles.rewardActionCardHighlight]}
                                onPress={() => navigateTo("/physical-rewards")}
                            >
                                {gamificationStats.unclaimedRewardsCount > 0 && (
                                    <View style={styles.notificationDot}>
                                        <Text style={styles.dotText}>
                                            {gamificationStats.unclaimedRewardsCount}
                                        </Text>
                                    </View>
                                )}
                                <Text style={styles.rewardCardIcon}>🎁</Text>
                                <View>
                                    <Text style={styles.rewardCardTitle}>Еко Награди</Text>
                                    <Text style={styles.rewardCardSub}>Подигни подарок</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* MENU SECTIONS */}
                <View style={styles.sectionsContainer}>
                    <Text style={styles.sectionTitle}>Активности</Text>
                    <View style={styles.menuGroup}>
                        <TouchableOpacity
                            onPress={() => navigateTo("/orders")}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuIcon}>🛍️</Text>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuLabel}>Мои нарачки и подигнувања</Text>
                                <Text style={styles.menuSubLabel}>QR кодови и активни купони</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigateTo("/favorites")}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuIcon}>💚</Text>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuLabel}>Омилени производители</Text>
                                <Text style={styles.menuSubLabel}>Локални фарми и локали</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionTitle}>Сметка и Поставки</Text>
                    <View style={styles.menuGroup}>
                        <TouchableOpacity
                            onPress={() => navigateTo("/notifications")}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuIcon}>🔔</Text>
                            <View style={styles.menuTextContainer}>
                                <Text style={styles.menuLabel}>Известувања</Text>
                                <Text style={styles.menuSubLabel}>За омилени локали и попусти</Text>
                            </View>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigateTo("/addresses")}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuIcon}>📍</Text>
                            <Text style={styles.menuLabelSimple}>Адреси за достава</Text>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigateTo("/payments")}
                            style={styles.menuItem}
                        >
                            <Text style={styles.menuIcon}>💳</Text>
                            <Text style={styles.menuLabelSimple}>Методи за плаќање</Text>
                            <Text style={styles.menuArrow}>›</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.disclaimerText}>
                        MySupply е платформа-посредник. Производителите се одговорни за декларацијата, составот и квалитетот на производите.
                    </Text>

                    {user && (
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
                    )}
                </View>
            </ScrollView>

            {/* Modal за Менување Име */}
            <Modal
                visible={isEditModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Уреди Профил ✏️</Text>
                        <Text style={styles.modalSubtitle}>
                            Внесете го вашето име и презиме:
                        </Text>

                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Име и Презиме"
                            placeholderTextColor="#9CA3AF"
                        />

                        <View style={styles.modalButtonsRow}>
                            <TouchableOpacity
                                style={styles.modalCancelButton}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.modalCancelButtonText}>Откажи</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalSaveButton}
                                onPress={handleUpdateProfile}
                                disabled={updatingProfile}
                            >
                                {updatingProfile ? (
                                    <ActivityIndicator color="#FFF" />
                                ) : (
                                    <Text style={styles.modalSaveButtonText}>Зачувај</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 40 },
    header: { marginBottom: 16 },
    title: { fontSize: 28, fontWeight: "800", color: "#111827" },
    subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
    profileCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        elevation: 3,
        marginBottom: 16,
    },
    userInfo: { alignItems: "center" },
    avatarContainer: { position: "relative", marginBottom: 12 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#DCFCE7",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: { fontSize: 34, fontWeight: "bold", color: "#16A34A" },
    editAvatarBadge: {
        position: "absolute",
        right: 0,
        bottom: 0,
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        elevation: 2,
    },
    editAvatarIcon: { fontSize: 12 },
    userName: { fontSize: 20, fontWeight: "700", color: "#111827" },
    userEmail: { fontSize: 14, color: "#6B7280", marginTop: 2 },
    editProfileButton: {
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 6,
        backgroundColor: "#F3F4F6",
        borderRadius: 20,
    },
    editProfileText: { fontSize: 12, fontWeight: "600", color: "#374151" },
    guestInfo: { alignItems: "center" },
    avatarGuest: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    avatarIcon: { fontSize: 36 },
    guestTitle: { fontSize: 18, fontWeight: "700", color: "#111827", textAlign: "center" },
    guestSubtitle: { fontSize: 13, color: "#6B7280", textAlign: "center", marginTop: 4, marginBottom: 16, lineHeight: 18 },
    primaryButton: {
        backgroundColor: "#16A34A",
        borderRadius: 12,
        paddingVertical: 14,
        width: "100%",
        alignItems: "center",
        marginBottom: 8,
    },
    primaryButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
    secondaryButton: {
        borderWidth: 1.5,
        borderColor: "#16A34A",
        borderRadius: 12,
        paddingVertical: 13,
        width: "100%",
        alignItems: "center",
    },
    secondaryButtonText: { color: "#16A34A", fontWeight: "700", fontSize: 15 },
    gamificationSection: { marginBottom: 20 },
    levelBanner: {
        backgroundColor: "#15803D",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    levelInfo: { gap: 2 },
    levelBadgeText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
    streakText: { color: "#DCFCE7", fontSize: 12, fontWeight: "600" },
    pointsText: { color: "#FEF08A", fontSize: 15, fontWeight: "800" },
    rewardsRow: { flexDirection: "row", gap: 10 },
    rewardActionCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        gap: 10,
        position: "relative",
    },
    rewardActionCardHighlight: { backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" },
    rewardCardIcon: { fontSize: 24 },
    rewardCardTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
    rewardCardSub: { fontSize: 10, color: "#6B7280" },
    notificationDot: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "#EF4444",
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: "center",
        alignItems: "center",
    },
    dotText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
    sectionsContainer: { gap: 16 },
    sectionTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        marginLeft: 4,
        marginBottom: -8,
    },
    menuGroup: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#F3F4F6",
        overflow: "hidden",
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    menuIcon: { fontSize: 20, marginRight: 12 },
    menuTextContainer: { flex: 1 },
    menuLabel: { fontSize: 15, color: "#111827", fontWeight: "600" },
    menuSubLabel: { fontSize: 12, color: "#6B7280", marginTop: 1 },
    menuLabelSimple: { flex: 1, fontSize: 15, color: "#111827", fontWeight: "500" },
    menuArrow: { fontSize: 18, color: "#9CA3AF", fontWeight: "600" },
    disclaimerText: {
        fontSize: 11,
        color: "#9CA3AF",
        textAlign: "center",
        paddingHorizontal: 10,
        lineHeight: 15,
        marginTop: 4,
    },
    logoutButton: {
        marginTop: 10,
        backgroundColor: "#FEF2F2",
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#FEE2E2",
    },
    logoutButtonText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: { backgroundColor: "#FFF", width: "100%", borderRadius: 20, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 4 },
    modalSubtitle: { fontSize: 13, color: "#6B7280", marginBottom: 16 },
    input: {
        backgroundColor: "#F9FAFB",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: "#111827",
        marginBottom: 20,
    },
    modalButtonsRow: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
    modalCancelButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
    modalCancelButtonText: { color: "#6B7280", fontWeight: "600" },
    modalSaveButton: { backgroundColor: "#16A34A", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 },
    modalSaveButtonText: { color: "#FFF", fontWeight: "700" },
});