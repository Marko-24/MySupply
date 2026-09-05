import React from "react";
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

interface Badge {
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt?: string;
    progress?: string;
}

export default function AchievementsScreen() {
    const router = useRouter();

    const userStats = {
        boxesRescued: 8,
        nextLevelBoxes: 15,
        currentLevel: "Никулец 🌱",
        nextLevel: "Дрво 🌳",
    };

    const progressPercent = Math.min(
        (userStats.boxesRescued / userStats.nextLevelBoxes) * 100,
        100
    );

    const badges: Badge[] = [
        {
            id: "1",
            title: "Прва Кутија",
            description: "Ја спаси твојата прва Surprise Box.",
            icon: "🎁",
            isUnlocked: true,
            unlockedAt: "12 Мај",
        },
        {
            id: "2",
            title: "Локалец",
            description: "Купи од 3 различни локални фарми.",
            icon: "🚜",
            isUnlocked: true,
            unlockedAt: "28 Јуни",
        },
        {
            id: "3",
            title: "Ноќна Птица",
            description: "Подигни кутија во последните 30 мин. од работното време.",
            icon: "🌙",
            isUnlocked: false,
            progress: "0/1",
        },
        {
            id: "4",
            title: "Пекарски Фан",
            description: "Спаси 5 кутии од локални пекари.",
            icon: "🥐",
            isUnlocked: false,
            progress: "2/5",
        },
        {
            id: "5",
            title: "Брз Прст",
            description: "Резервирај кутија во првите 5 минути од објавувањето.",
            icon: "⚡",
            isUnlocked: false,
            progress: "0/1",
        },
        {
            id: "6",
            title: "Еко Херој",
            description: "Спаси повеќе од 25 Surprise кутии.",
            icon: "👑",
            isUnlocked: false,
            progress: "8/25",
        },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Text style={styles.backButtonText}>‹ Назад</Text>
                </TouchableOpacity>

                <Text style={styles.screenTitle}>Награди и Достигнувања</Text>

                {/* Level Banner Card */}
                <View style={styles.levelCard}>
                    <View style={styles.levelHeader}>
                        <View>
                            <Text style={styles.levelSubtitle}>ТЕКОВНО НИВО</Text>
                            <Text style={styles.levelTitle}>{userStats.currentLevel}</Text>
                        </View>
                        <Text style={styles.boxCountBadge}>
                            📦 {userStats.boxesRescued} спасени
                        </Text>
                    </View>

                    <View style={styles.progressBarBackground}>
                        <View
                            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
                        />
                    </View>

                    <View style={styles.levelFooter}>
                        <Text style={styles.progressText}>
                            Уште {userStats.nextLevelBoxes - userStats.boxesRescued} кутии до{" "}
                            {userStats.nextLevel}
                        </Text>
                    </View>
                </View>

                {/* Impact Banner */}
                <View style={styles.impactCard}>
                    <Text style={styles.impactIcon}>💡</Text>
                    <View style={styles.impactTextContainer}>
                        <Text style={styles.impactTitle}>Знаеш ли дека?</Text>
                        <Text style={styles.impactDescription}>
                            Со твоите {userStats.boxesRescued} спасени кутии, спречи CO₂ еквивалент на полнење телефон 2,400 пати!
                        </Text>
                    </View>
                </View>

                {/* Badges Grid Section */}
                <Text style={styles.sectionTitle}>Твоите Беџови</Text>

                <View style={styles.gridContainer}>
                    {badges.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.badgeCard,
                                !item.isUnlocked && styles.badgeCardLocked,
                            ]}
                        >
                            <View
                                style={[
                                    styles.iconCircle,
                                    !item.isUnlocked && styles.iconCircleLocked,
                                ]}
                            >
                                <Text style={styles.badgeIcon}>{item.icon}</Text>
                                {!item.isUnlocked && (
                                    <View style={styles.lockOverlay}>
                                        <Text style={styles.lockIcon}>🔒</Text>
                                    </View>
                                )}
                            </View>

                            <Text style={styles.badgeTitle}>{item.title}</Text>
                            <Text style={styles.badgeDescription}>{item.description}</Text>

                            {item.isUnlocked ? (
                                <View style={styles.unlockedTag}>
                                    <Text style={styles.unlockedTagText}>
                                        Отклучено • {item.unlockedAt}
                                    </Text>
                                </View>
                            ) : (
                                <View style={styles.progressTag}>
                                    <Text style={styles.progressTagText}>
                                        Прогрес: {item.progress}
                                    </Text>
                                </View>
                            )}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    scrollContent: { padding: 20, paddingTop: 50, paddingBottom: 40 },
    backButton: { marginBottom: 12 },
    backButtonText: { fontSize: 16, color: "#16A34A", fontWeight: "600" },
    screenTitle: { fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 16 },
    levelCard: {
        backgroundColor: "#15803D",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        elevation: 4,
    },
    levelHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    levelSubtitle: { color: "#DCFCE7", fontSize: 11, fontWeight: "700" },
    levelTitle: { color: "#FFFFFF", fontSize: 22, fontWeight: "800", marginTop: 2 },
    boxCountBadge: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "700",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    progressBarBackground: {
        height: 10,
        backgroundColor: "rgba(255, 255, 255, 0.25)",
        borderRadius: 5,
        overflow: "hidden",
    },
    progressBarFill: { height: "100%", backgroundColor: "#4ADE80", borderRadius: 5 },
    levelFooter: { marginTop: 10 },
    progressText: { color: "#DCFCE7", fontSize: 12, fontWeight: "500" },
    impactCard: {
        backgroundColor: "#FEF3C7",
        borderRadius: 16,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#FDE68A",
    },
    impactIcon: { fontSize: 28, marginRight: 12 },
    impactTextContainer: { flex: 1 },
    impactTitle: { fontSize: 14, fontWeight: "700", color: "#92400E" },
    impactDescription: { fontSize: 12, color: "#B45309", marginTop: 2, lineHeight: 16 },
    sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 14 },
    gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
    badgeCard: {
        width: "48%",
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        elevation: 2,
    },
    badgeCardLocked: { backgroundColor: "#FAFAFA", borderColor: "#E5E7EB" },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: "#DCFCE7",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        position: "relative",
    },
    iconCircleLocked: { backgroundColor: "#E5E7EB" },
    badgeIcon: { fontSize: 26 },
    lockOverlay: {
        position: "absolute",
        right: -2,
        bottom: -2,
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        padding: 2,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    lockIcon: { fontSize: 10 },
    badgeTitle: { fontSize: 14, fontWeight: "700", color: "#111827", textAlign: "center", marginBottom: 4 },
    badgeDescription: { fontSize: 11, color: "#6B7280", textAlign: "center", lineHeight: 15, minHeight: 30, marginBottom: 10 },
    unlockedTag: { backgroundColor: "#F0FDF4", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    unlockedTagText: { fontSize: 10, color: "#16A34A", fontWeight: "600" },
    progressTag: { backgroundColor: "#F3F4F6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    progressTagText: { fontSize: 10, color: "#6B7280", fontWeight: "600" },
});