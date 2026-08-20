import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
    Modal,
    TextInput,
    ActivityIndicator,
    Image,
    Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

const generatePickupCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `MY-${result}`;
};

export default function BoxDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Динамички параметри
    const box = {
        id: (params.id as string) || "1",
        title: (params.title as string) || "Специјална Surprise Кутија",
        description: (params.description as string) || "Внимателно одбрана комбинација на свежи производи подготвени за брзо подигнување.",
        original_price: Number(params.original_price || 300),
        discounted_price: Number(params.discounted_price || 150),
        quantity_available: Number(params.quantity_available || 4),
        pickup_start_time: (params.pickup_start_time as string) || "17:00",
        pickup_end_time: (params.pickup_end_time as string) || "19:00",
        vendor_name: (params.vendor_name as string) || "Локален Партнер",
        vendor_category: (params.vendor_category as string) || "restaurant",
        vendor_address: (params.vendor_address as string) || "Централен регион",
        vendor_phone: (params.vendor_phone as string) || "070123456",
        image_url: (params.image_url as string) || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    };

    const isProducer = box.vendor_category === "producer";
    const discountPercent = box.original_price > 0
        ? Math.round(((box.original_price - box.discounted_price) / box.original_price) * 100)
        : 0;

    // Интерактивна состојба
    const [quantity, setQuantity] = useState(1);
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
    const [pickupCode, setPickupCode] = useState<string | null>(null);

    // Време за одбројување (Simulated Live Timer)
    const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 42, seconds: 15 });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Форма за плаќање
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const totalPrice = box.discounted_price * quantity;

    const handleQuantityChange = (delta: number) => {
        const newQty = quantity + delta;
        if (newQty >= 1 && newQty <= box.quantity_available) {
            setQuantity(newQty);
        }
    };

    const handleCallVendor = () => {
        if (box.vendor_phone) {
            Linking.openURL(`tel:${box.vendor_phone}`);
        } else {
            Alert.alert("Информација", "Телефонскиот број не е достапен.");
        }
    };

    const handleProcessPayment = () => {
        if (!cardNumber || !expiry || !cvv) {
            Alert.alert("Грешка", "Внесете ги сите податоци за картичката.");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            const newCode = generatePickupCode();
            setPickupCode(newCode);
            setIsPaymentModalVisible(false);
        }, 1200);
    };

    return (
        <ScreenContainer>
            <View style={styles.mainContainer}>
                {/* Floating Top Nav (Wolt Style) */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconCircleBtn}>
                        <Text style={styles.iconText}>←</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconCircleBtn}>
                        <Text style={styles.iconText}>{isFavorite ? "❤️" : "🤍"}</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Hero Image Section */}
                    <View style={styles.heroContainer}>
                        <Image source={{ uri: box.image_url }} style={styles.heroImage} />
                        <View style={styles.heroOverlay} />

                        <View style={styles.badgeRow}>
                            <View style={styles.discountPill}>
                                <Text style={styles.discountPillText}>-{discountPercent}%</Text>
                            </View>
                            <View style={styles.categoryPill}>
                                <Text style={styles.categoryPillText}>
                                    {isProducer ? "🚜 Директно од производител" : "🍽️ Свеж оброк"}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.contentContainer}>
                        {/* Store Info & Rating Header */}
                        <TouchableOpacity style={styles.vendorHeaderRow} activeOpacity={0.7}>
                            <View>
                                <Text style={styles.vendorName}>{box.vendor_name}</Text>
                                <Text style={styles.vendorCategory}>
                                    {isProducer ? "Локален земјоделец / фарма" : "Ресторан & Кафе"}
                                </Text>
                            </View>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingStar}>★</Text>
                                <Text style={styles.ratingScore}>4.8</Text>
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.title}>{box.title}</Text>
                        <Text style={styles.description}>{box.description}</Text>

                        {/* Live Urgency Countdown Bar */}
                        <View style={styles.timerCard}>
                            <View style={styles.timerIconBox}>
                                <Text style={{ fontSize: 18 }}>⚡</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.timerTitle}>Понудата истекува за:</Text>
                                <Text style={styles.timerClock}>
                                    {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")} ч.
                                </Text>
                            </View>
                            <View style={styles.stockStatus}>
                                <Text style={styles.stockStatusText}>Уште {box.quantity_available} парчиња</Text>
                            </View>
                        </View>

                        {/* Код за подигнување доколку е резервирано */}
                        {pickupCode && (
                            <View style={styles.successCodeCard}>
                                <Text style={styles.successCodeTitle}>Успешна резервација!</Text>
                                <Text style={styles.successCodeValue}>{pickupCode}</Text>
                                <Text style={styles.successCodeSub}>Покажете го кодот при преземање на локацијата.</Text>
                            </View>
                        )}

                        {/* Динамичен селектор за количина */}
                        <View style={styles.quantitySection}>
                            <Text style={styles.sectionHeading}>Избери количина</Text>
                            <View style={styles.quantitySelector}>
                                <TouchableOpacity
                                    style={[styles.qtyBtn, quantity === 1 && styles.qtyBtnDisabled]}
                                    onPress={() => handleQuantityChange(-1)}
                                    disabled={quantity === 1}
                                >
                                    <Text style={styles.qtyBtnText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyNumber}>{quantity}</Text>
                                <TouchableOpacity
                                    style={[styles.qtyBtn, quantity === box.quantity_available && styles.qtyBtnDisabled]}
                                    onPress={() => handleQuantityChange(1)}
                                    disabled={quantity === box.quantity_available}
                                >
                                    <Text style={styles.qtyBtnText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Детали за подигнување (Wolt Style Card) */}
                        <View style={styles.woltCard}>
                            <Text style={styles.cardSectionTitle}>Информации за преземање</Text>

                            <View style={styles.cardRow}>
                                <View style={styles.rowIconBg}><Text style={{ fontSize: 16 }}>🕒</Text></View>
                                <View style={styles.rowContent}>
                                    <Text style={styles.rowLabel}>Време за подигнување</Text>
                                    <Text style={styles.rowValue}>{box.pickup_start_time} - {box.pickup_end_time} часот</Text>
                                </View>
                            </View>

                            <View style={styles.cardDivider} />

                            <View style={styles.cardRow}>
                                <View style={styles.rowIconBg}><Text style={{ fontSize: 16 }}>📍</Text></View>
                                <View style={styles.rowContent}>
                                    <Text style={styles.rowLabel}>Адреса за преземање</Text>
                                    <Text style={styles.rowValue}>{box.vendor_address}</Text>
                                </View>
                            </View>

                            {box.vendor_phone && (
                                <>
                                    <View style={styles.cardDivider} />
                                    <TouchableOpacity style={styles.cardRow} onPress={handleCallVendor}>
                                        <View style={styles.rowIconBg}><Text style={{ fontSize: 16 }}>📞</Text></View>
                                        <View style={styles.rowContent}>
                                            <Text style={styles.rowLabel}>Телефон за контакт</Text>
                                            <Text style={[styles.rowValue, { color: "#00C2E0" }]}>{box.vendor_phone}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Еколошко влијание */}
                        <View style={styles.ecoBanner}>
                            <Text style={{ fontSize: 20 }}>🌿</Text>
                            <Text style={styles.ecoBannerText}>
                                Со оваа резервација спречуваш отпад од храна и заштедуваш CO₂ емисии.
                            </Text>
                        </View>
                    </View>
                </ScrollView>

                {/* Sticky Bottom Ordering Bar */}
                <View style={styles.bottomBar}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.totalPriceLabel}>Вкупно ({quantity}x)</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.currentPrice}>{totalPrice} ден.</Text>
                            <Text style={styles.oldPrice}>{box.original_price * quantity} ден.</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.woltOrderBtn}
                        onPress={() => setIsPaymentModalVisible(true)}
                        activeOpacity={0.88}
                    >
                        <Text style={styles.woltOrderBtnText}>Резервирај веднаш</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Sheet Payment Modal */}
                <Modal
                    visible={isPaymentModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsPaymentModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsPaymentModalVisible(false)} />

                        <View style={styles.bottomSheet}>
                            <View style={styles.sheetHandle} />

                            <Text style={styles.sheetTitle}>Плаќање & Резервација</Text>

                            <View style={styles.orderSummaryCard}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.summaryTitle}>{box.title}</Text>
                                    <Text style={styles.summarySub}>{box.vendor_name} • {quantity} парч.</Text>
                                </View>
                                <Text style={styles.summaryTotalPrice}>{totalPrice} ден.</Text>
                            </View>

                            <TouchableOpacity
                                style={styles.quickFillBtn}
                                onPress={() => {
                                    setCardNumber("4242 4242 4242 4242");
                                    setExpiry("12/28");
                                    setCvv("123");
                                }}
                            >
                                <Text style={styles.quickFillText}>🧪 Внеси демо картичка</Text>
                            </TouchableOpacity>

                            <TextInput
                                style={styles.inputField}
                                placeholder="Број на картичка"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="numeric"
                                value={cardNumber}
                                onChangeText={setCardNumber}
                            />

                            <View style={styles.inputRow}>
                                <TextInput
                                    style={[styles.inputField, { flex: 1 }]}
                                    placeholder="ММ/ГГ"
                                    placeholderTextColor="#9CA3AF"
                                    value={expiry}
                                    onChangeText={setExpiry}
                                />
                                <TextInput
                                    style={[styles.inputField, { flex: 1 }]}
                                    placeholder="CVV"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    value={cvv}
                                    onChangeText={setCvv}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.confirmPayBtn, loading && { opacity: 0.7 }]}
                                onPress={handleProcessPayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.confirmPayText}>Плати {totalPrice} ден.</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#F9FAFB" },
    topBar: {
        position: "absolute",
        top: 16,
        left: 16,
        right: 16,
        zIndex: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    iconCircleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconText: { fontSize: 18, fontWeight: "700", color: "#111827" },
    scrollContent: { paddingBottom: 110 },
    heroContainer: { width: "100%", height: 240, position: "relative" },
    heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
    heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.12)" },
    badgeRow: { position: "absolute", bottom: 16, left: 16, right: 16, flexDirection: "row", gap: 8 },
    discountPill: { backgroundColor: "#FF3B30", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    discountPillText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
    categoryPill: { backgroundColor: "rgba(17, 24, 39, 0.85)", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    categoryPillText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },
    contentContainer: { padding: 20 },
    vendorHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    vendorName: { fontSize: 14, fontWeight: "800", color: "#00C2E0", textTransform: "uppercase", letterSpacing: 0.5 },
    vendorCategory: { fontSize: 12, color: "#6B7280" },
    ratingBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, gap: 4 },
    ratingStar: { color: "#D97706", fontSize: 12 },
    ratingScore: { color: "#D97706", fontSize: 12, fontWeight: "700" },
    title: { fontSize: 24, fontWeight: "900", color: "#111827", marginBottom: 6, letterSpacing: -0.3 },
    description: { fontSize: 14, color: "#4B5563", lineHeight: 21, marginBottom: 18 },

    // Timer
    timerCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFBEB",
        borderWidth: 1,
        borderColor: "#FDE68A",
        padding: 12,
        borderRadius: 14,
        marginBottom: 20,
        gap: 12,
    },
    timerIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#FEF3C7", alignItems: "center", justifyContent: "center" },
    timerTitle: { fontSize: 11, color: "#92400E", fontWeight: "600" },
    timerClock: { fontSize: 15, fontWeight: "800", color: "#B45309" },
    stockStatus: { backgroundColor: "#FEE2E2", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6 },
    stockStatusText: { fontSize: 11, fontWeight: "700", color: "#DC2626" },

    // Quantity
    quantitySection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
    sectionHeading: { fontSize: 15, fontWeight: "700", color: "#111827" },
    quantitySelector: { flexDirection: "row", alignItems: "center", backgroundColor: "#E5E7EB", borderRadius: 12, padding: 3 },
    qtyBtn: { width: 34, height: 34, backgroundColor: "#FFFFFF", borderRadius: 10, alignItems: "center", justifyContent: "center" },
    qtyBtnDisabled: { opacity: 0.4 },
    qtyBtnText: { fontSize: 18, fontWeight: "700", color: "#111827" },
    qtyNumber: { paddingHorizontal: 16, fontSize: 15, fontWeight: "800", color: "#111827" },

    // Success Code
    successCodeCard: { backgroundColor: "#ECFDF5", borderColor: "#A7F3D0", borderWidth: 1, padding: 16, borderRadius: 14, alignItems: "center", marginBottom: 20 },
    successCodeTitle: { fontSize: 13, fontWeight: "700", color: "#047857" },
    successCodeValue: { fontSize: 26, fontWeight: "900", color: "#065F46", letterSpacing: 2, marginVertical: 4 },
    successCodeSub: { fontSize: 11, color: "#059669", textAlign: "center" },

    // Wolt Card
    woltCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 16 },
    cardSectionTitle: { fontSize: 14, fontWeight: "800", color: "#111827", marginBottom: 12 },
    cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    rowIconBg: { width: 32, height: 32, borderRadius: 8, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center" },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: 11, color: "#9CA3AF" },
    rowValue: { fontSize: 13, fontWeight: "700", color: "#111827", marginTop: 1 },
    cardDivider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 10 },

    // Eco
    ecoBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "#F0FDF4", padding: 12, borderRadius: 12, gap: 10 },
    ecoBannerText: { flex: 1, fontSize: 12, color: "#166534", fontWeight: "500", lineHeight: 17 },

    // Sticky Bottom Bar
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingHorizontal: 20,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    priceContainer: { gap: 2 },
    totalPriceLabel: { fontSize: 11, color: "#6B7280" },
    priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
    currentPrice: { fontSize: 20, fontWeight: "900", color: "#111827" },
    oldPrice: { fontSize: 13, color: "#9CA3AF", textDecorationLine: "line-through" },
    woltOrderBtn: { backgroundColor: "#00C2E0", paddingVertical: 13, paddingHorizontal: 24, borderRadius: 12 },
    woltOrderBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
    bottomSheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 34 },
    sheetHandle: { width: 38, height: 5, backgroundColor: "#E5E7EB", borderRadius: 3, alignSelf: "center", marginBottom: 16 },
    sheetTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 14 },
    orderSummaryCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12, marginBottom: 12 },
    summaryTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
    summarySub: { fontSize: 11, color: "#6B7280" },
    summaryTotalPrice: { fontSize: 16, fontWeight: "800", color: "#00C2E0" },
    quickFillBtn: { alignItems: "center", marginBottom: 12 },
    quickFillText: { fontSize: 12, color: "#6366F1", fontWeight: "600" },
    inputField: { backgroundColor: "#F9FAFB", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 10, paddingHorizontal: 12, height: 44, fontSize: 14, color: "#111827", marginBottom: 10 },
    inputRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
    confirmPayBtn: { backgroundColor: "#00C2E0", borderRadius: 12, height: 48, alignItems: "center", justifyContent: "center" },
    confirmPayText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
});