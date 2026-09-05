import React, { useState } from "react";
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from "react-native";
import { useRouter } from "expo-router";

interface Reward {
    id: string;
    title: string;
    description: string;
    icon: string;
    pointsRequired: number;
    isAvailable: boolean;
    isClaimed: boolean;
}

export default function PhysicalRewardsScreen() {
    const router = useRouter();
    const [userPoints] = useState(380);
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

    const rewards: Reward[] = [
        {
            id: "1",
            title: "Памучна Мрежаста Торба",
            description: "Заводлива еко-кеса за овошје и зеленчук кога купуваш од фармери.",
            icon: "🛍️",
            pointsRequired: 250,
            isAvailable: true,
            isClaimed: false,
        },
        {
            id: "2",
            title: "Брендирана Термо-Чаша",
            description: "За подигнување кафе/појадок во твојата KeepCup чаша.",
            icon: "☕",
            pointsRequired: 500,
            isAvailable: false,
            isClaimed: false,
        },
        {
            id: "3",
            title: "Еко Bento Кутија за Храна",
            description: "Сад за повеќекратна употреба за пакување без отпад.",
            icon: "🍱",
            pointsRequired: 750,
            isAvailable: false,
            isClaimed: false,
        },
        {
            id: "4",
            title: "Семе за Засадување (Босилек)",
            description: "Картичка од рециклирана хартија со семе за твоето балконско бавче.",
            icon: "🌱",
            pointsRequired: 150,
            isAvailable: true,
            isClaimed: true,
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

                <Text style={styles.screenTitle}>Еко Награди 🎁</Text>
                <Text style={styles.screenSubtitle}>
                    Заменувај ги твоите еко-поени за физички реквизити и подигни ги при следната нарачка.
                </Text>

                {/* Balance Card */}
                <View style={styles.pointsBalanceCard}>
                    <Text style={styles.balanceLabel}>Твојот салдо на поени</Text>
                    <Text style={styles.balanceValue}>{userPoints} Еко Поени</Text>
                </View>

                {/* Rewards List */}
                <View style={styles.listContainer}>
                    {rewards.map((item) => {
                        const canAfford = userPoints >= item.pointsRequired;

                        return (
                            <View key={item.id} style={styles.rewardItem}>
                                <Text style={styles.rewardIcon}>{item.icon}</Text>

                                <View style={styles.rewardDetails}>
                                    <Text style={styles.rewardTitle}>{item.title}</Text>
                                    <Text style={styles.rewardDescription}>
                                        {item.description}
                                    </Text>
                                    <Text style={styles.pointsCost}>
                                        🪙 {item.pointsRequired} поени
                                    </Text>
                                </View>

                                {item.isClaimed ? (
                                    <View style={styles.claimedBadge}>
                                        <Text style={styles.claimedBadgeText}>Подигнато</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={[
                                            styles.claimButton,
                                            !canAfford && styles.claimButtonDisabled,
                                        ]}
                                        disabled={!canAfford}
                                        onPress={() => setSelectedReward(item)}
                                    >
                                        <Text style={styles.claimButtonText}>
                                            {canAfford ? "Подигни" : "Недоволно"}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>

            {/* Modal со QR за Подигнување */}
            <Modal
                visible={!!selectedReward}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setSelectedReward(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Подигни Награда 🎁</Text>
                        <Text style={styles.modalSubtitle}>
                            Покажи го овој код кај локалниот партнер кога ќе го подигнуваш твојот Surprise Box.
                        </Text>

                        <View style={styles.qrPlaceholder}>
                            <Text style={styles.qrCodeText}>[ QR CODE ]</Text>
                            <Text style={styles.qrSubText}>{selectedReward?.title}</Text>
                        </View>

                        <TouchableOpacity
                            style={styles.closeModalButton}
                            onPress={() => setSelectedReward(null)}
                        >
                            <Text style={styles.closeModalButtonText}>Затвори</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FAFB" },
    scrollContent: { padding: 20, paddingTop: 50, paddingBottom: 40 },
    backButton: { marginBottom: 12 },
    backButtonText: { fontSize: 16, color: "#16A34A", fontWeight: "600" },
    screenTitle: { fontSize: 26, fontWeight: "800", color: "#111827" },
    screenSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4, marginBottom: 16, lineHeight: 18 },
    pointsBalanceCard: {
        backgroundColor: "#16A34A",
        borderRadius: 16,
        padding: 16,
        alignItems: "center",
        marginBottom: 20,
    },
    balanceLabel: { color: "#DCFCE7", fontSize: 12, fontWeight: "600" },
    balanceValue: { color: "#FFFFFF", fontSize: 24, fontWeight: "800", marginTop: 2 },
    listContainer: { gap: 12 },
    rewardItem: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 14,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#F3F4F6",
        elevation: 2,
    },
    rewardIcon: { fontSize: 32, marginRight: 12 },
    rewardDetails: { flex: 1, paddingRight: 8 },
    rewardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
    rewardDescription: { fontSize: 11, color: "#6B7280", marginTop: 2, lineHeight: 15 },
    pointsCost: { fontSize: 12, fontWeight: "700", color: "#16A34A", marginTop: 4 },
    claimButton: {
        backgroundColor: "#16A34A",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
    },
    claimButtonDisabled: { backgroundColor: "#E5E7EB" },
    claimButtonText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
    claimedBadge: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
    claimedBadgeText: { fontSize: 11, color: "#9CA3AF", fontWeight: "600" },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#FFF",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        width: "100%",
    },
    modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
    modalSubtitle: { fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 4, marginBottom: 20 },
    qrPlaceholder: {
        width: 180,
        height: 180,
        backgroundColor: "#F3F4F6",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#E5E7EB",
        borderStyle: "dashed",
        marginBottom: 20,
    },
    qrCodeText: { fontSize: 18, fontWeight: "800", color: "#374151" },
    qrSubText: { fontSize: 10, color: "#6B7280", marginTop: 6, textAlign: "center", paddingHorizontal: 10 },
    closeModalButton: { backgroundColor: "#111827", paddingVertical: 10, paddingHorizontal: 24, borderRadius: 10 },
    closeModalButtonText: { color: "#FFF", fontWeight: "600" },
});