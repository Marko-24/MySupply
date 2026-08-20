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
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { ScreenContainer } from "@/components/screen-container";

export default function ProfileScreen() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Modal за едитирање
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [fullName, setFullName] = useState("");
    const [updatingProfile, setUpdatingProfile] = useState(false);

    // Фокусирани гејмификациски податоци (Јасни и мерибли)
    const userStats = {
        savedKg: 4.2,            // Реално влијание
        streakWeeks: 3,          // Повторливост
        currentPoints: 280,
        targetPoints: 400,       // Потребни за следна награда
        nextRewardTitle: "100 ден. попуст во локална фурна",
    };

    const progressPercentage = Math.min((userStats.currentPoints / userStats.targetPoints) * 100, 100);

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
            Alert.alert("Најава е потребна", "Ве молиме најавете се за да пристапите.", [
                { text: "Откажи", style: "cancel" },
                { text: "Најави се", onPress: () => router.push("/(auth)/login") },
            ]);
            return;
        }
        router.push(path as any);
    };

    const displayedName = user?.user_metadata?.full_name || "Еко Херој";

    return (
        <ScreenContainer style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. КОМПАКТЕН ХЕДЕР */}
                <View style={styles.headerRow}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarLetter}>{displayedName.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.userNameText}>{displayedName}</Text>
                        <Text style={styles.userEmailText}>{user?.email || "Гостин"}</Text>
                    </View>
                    {user && (
                        <TouchableOpacity style={styles.editIconButton} onPress={() => setIsEditModalVisible(true)}>
                            <Text style={styles.editIcon}>⚙️</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* 2. ГЕЈМИФИКАЦИЈА КАРТИЧКА - ЕДНОСТАВНА И МАСИВНА */}
                {user ? (
                    <View style={styles.gamificationWrapper}>
                        <LinearGradient colors={["#15803D", "#16A34A"]} style={styles.heroCard}>
                            <View style={styles.impactRow}>
                                <View style={styles.impactBadge}>
                                    <Text style={styles.impactBadgeLabel}>СПАСЕНО СЕДМИЧНО</Text>
                                    <Text style={styles.impactBadgeValue}>🌱 {userStats.savedKg} кг храна</Text>
                                </View>
                                <View style={styles.streakBadge}>
                                    <Text style={styles.streakText}>🔥 {userStats.streakWeeks} недели</Text>
                                </View>
                            </View>

                            {/* Прогрес до следна реална награда */}
                            <View style={styles.progressSection}>
                                <View style={styles.progressLabelRow}>
                                    <Text style={styles.nextRewardText}>
                                        🎁 Следно: <Text style={{ fontWeight: "800" }}>{userStats.nextRewardTitle}</Text>
                                    </Text>
                                    <Text style={styles.pointsRatio}>
                                        {userStats.currentPoints}/{userStats.targetPoints}
                                    </Text>
                                </View>
                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.claimRewardButton}
                                onPress={() => navigateTo("/physical-rewards")}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.claimRewardText}>Види ги сите награди ›</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                ) : (
                    <View style={styles.guestCard}>
                        <Text style={styles.guestTitle}>Заштеди храна, заработи награди! 🧺</Text>
                        <Text style={styles.guestSub}>Најави се за да ги следиш своите еколошки поени.</Text>
                        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push("/(auth)/login")}>
                            <Text style={styles.loginBtnText}>Најави се</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* 3. ЧИСТО МЕНИ (САМО НЕОПХОДНОТО) */}
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.menuRow} onPress={() => navigateTo("/orders")}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🛍️</Text>
                            <Text style={styles.menuTitle}>Мои Нарачки & QR Кодови</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={() => navigateTo("/favorites")}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>💚</Text>
                            <Text style={styles.menuTitle}>Омилени Локални Производители</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuRow} onPress={() => navigateTo("/notifications")}>
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🔔</Text>
                            <Text style={styles.menuTitle}>Известувања за попусти</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    {user && (
                        <TouchableOpacity style={styles.logoutRow} onPress={handleSignOut} disabled={loading}>
                            {loading ? <ActivityIndicator color="#EF4444" /> : <Text style={styles.logoutText}>Одјави се</Text>}
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>

            {/* MODAL ЗА УРЕДУВАЊЕ */}
            <Modal visible={isEditModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBody}>
                        <Text style={styles.modalTitle}>Уреди Име</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Име и Презиме"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditModalVisible(false)}>
                                <Text style={styles.cancelText}>Откажи</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateProfile}>
                                <Text style={styles.saveText}>Зачувај</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    scrollContent: { padding: 20 },

    // Header
    headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    avatarCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#DCFCE7",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },
    avatarLetter: { fontSize: 22, fontWeight: "900", color: "#16A34A" },
    headerInfo: { flex: 1 },
    userNameText: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
    userEmailText: { fontSize: 12, color: "#64748B", marginTop: 2 },
    editIconButton: { padding: 8, backgroundColor: "#F1F5F9", borderRadius: 12 },
    editIcon: { fontSize: 16 },

    // Gamification Card
    gamificationWrapper: { marginBottom: 24 },
    heroCard: { borderRadius: 20, padding: 18, elevation: 2 },
    impactRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    impactBadge: {},
    impactBadgeLabel: { fontSize: 10, fontWeight: "800", color: "#BBF7D0", letterSpacing: 0.5 },
    impactBadgeValue: { fontSize: 18, fontWeight: "900", color: "#FFFFFF", marginTop: 2 },
    streakBadge: { backgroundColor: "rgba(0,0,0,0.2)", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
    streakText: { color: "#FEF08A", fontSize: 12, fontWeight: "800" },

    progressSection: { backgroundColor: "rgba(255,255,255,0.12)", padding: 12, borderRadius: 14, marginBottom: 12 },
    progressLabelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
    nextRewardText: { color: "#FFFFFF", fontSize: 12, flex: 1, marginRight: 8 },
    pointsRatio: { color: "#FEF08A", fontSize: 12, fontWeight: "800" },
    progressTrack: { height: 6, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 3, overflow: "hidden" },
    progressFill: { height: "100%", backgroundColor: "#FEF08A", borderRadius: 3 },

    claimRewardButton: { alignItems: "center", paddingTop: 4 },
    claimRewardText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },

    // Guest State
    guestCard: { backgroundColor: "#FFFFFF", padding: 20, borderRadius: 20, alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: "#E2E8F0" },
    guestTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A", textAlign: "center" },
    guestSub: { fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 4, marginBottom: 14 },
    loginBtn: { backgroundColor: "#16A34A", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 12 },
    loginBtnText: { color: "#FFF", fontWeight: "800", fontSize: 14 },

    // Menu
    menuContainer: { backgroundColor: "#FFFFFF", borderRadius: 20, borderWidth: 1, borderColor: "#F1F5F9", overflow: "hidden" },
    menuRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 16, borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
    menuLeft: { flexDirection: "row", alignItems: "center" },
    menuIcon: { fontSize: 18, marginRight: 12 },
    menuTitle: { fontSize: 14, fontWeight: "700", color: "#0F172A" },
    arrow: { fontSize: 18, color: "#94A3B8", fontWeight: "600" },
    logoutRow: { padding: 16, alignItems: "center", backgroundColor: "#FEF2F2" },
    logoutText: { color: "#EF4444", fontWeight: "800", fontSize: 14 },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 20 },
    modalBody: { backgroundColor: "#FFF", borderRadius: 20, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
    modalInput: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, padding: 12, marginBottom: 16 },
    modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
    cancelBtn: { padding: 10 },
    cancelText: { color: "#64748B", fontWeight: "600" },
    saveBtn: { backgroundColor: "#16A34A", paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
    saveText: { color: "#FFF", fontWeight: "800" },
});