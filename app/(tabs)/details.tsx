import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function BoxDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);

    // Извлекување на податоците испратени преку параметри
    const box = {
        id: params.id as string,
        title: params.title as string,
        description: params.description as string,
        original_price: Number(params.original_price || 0),
        discounted_price: Number(params.discounted_price || 0),
        quantity_available: Number(params.quantity_available || 0),
        pickup_start_time: params.pickup_start_time as string,
        pickup_end_time: params.pickup_end_time as string,
        vendor_name: params.vendor_name as string,
        vendor_category: params.vendor_category as string,
        vendor_description: params.vendor_description as string,
        vendor_address: params.vendor_address as string,
        vendor_phone: params.vendor_phone as string,
    };

    const isProducer = box.vendor_category === "producer";
    const discountPercent = Math.round(
        ((box.original_price - box.discounted_price) / box.original_price) * 100
    );

    const handleCallVendor = () => {
        if (box.vendor_phone) {
            Linking.openURL(`tel:${box.vendor_phone}`);
        } else {
            Alert.alert("Информација", "Телефонскиот број не е достапен.");
        }
    };

    const handleReserve = () => {
        setLoading(true);
        // Тука во иднина ќе отиде записот во 'orders' табелата
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                "Успешна резервација! 🎉",
                `Успешно резервиравте "${box.title}". Ве молиме подигнете ја во периодот: ${box.pickup_start_time} - ${box.pickup_end_time}.`,
                [{ text: "Во ред", onPress: () => router.back() }]
            );
        }, 1000);
    };

    return (
        <ScreenContainer>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>‹ Назад</Text>
                </TouchableOpacity>
                <Text style={styles.topBarTitle} numberOfLines={1}>
                    {box.vendor_name}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Banner Section */}
                <View
                    style={[
                        styles.banner,
                        { backgroundColor: isProducer ? "#eef2ff" : "#e8f7ee" },
                    ]}
                >
                    <Text style={styles.bannerIcon}>{isProducer ? "🚜" : "🍽️"}</Text>
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
                    </View>
                </View>

                {/* Content Section */}
                <View style={styles.content}>
                    <View style={styles.vendorHeader}>
                        <Text style={styles.vendorCategory}>
                            {isProducer ? "Локален производител" : "Ресторан / Место за храна"}
                        </Text>
                        <Text style={styles.vendorName}>{box.vendor_name}</Text>
                        {box.vendor_description ? (
                            <Text style={styles.vendorDescription}>{box.vendor_description}</Text>
                        ) : null}
                    </View>

                    <View style={styles.divider} />

                    {/* Box Title & Description */}
                    <Text style={styles.boxTitle}>{box.title}</Text>
                    <Text style={styles.boxDescription}>{box.description}</Text>

                    {/* Pricing Info */}
                    <View style={styles.priceContainer}>
                        <View>
                            <Text style={styles.priceLabel}>Промотивна цена</Text>
                            <View style={styles.priceRow}>
                                <Text style={styles.discountedPrice}>{box.discounted_price} ден.</Text>
                                <Text style={styles.originalPrice}>{box.original_price} ден.</Text>
                            </View>
                        </View>

                        <View style={styles.quantityBadge}>
                            <Text style={styles.quantityText}>Преостанати: {box.quantity_available}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Info Details */}
                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>⏱️</Text>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Време за подигнување</Text>
                                <Text style={styles.infoValue}>
                                    {box.pickup_start_time} - {box.pickup_end_time} часот
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.infoIcon}>📍</Text>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoTitle}>Локација за подигнување</Text>
                                <Text style={styles.infoValue}>{box.vendor_address}</Text>
                            </View>
                        </View>

                        {box.vendor_phone ? (
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>📞</Text>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoTitle}>Контакт телефон</Text>
                                    <Text style={styles.infoValue}>{box.vendor_phone}</Text>
                                </View>
                            </View>
                        ) : null}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Sticky Action Buttons */}
            <View style={styles.bottomBar}>
                {isProducer && (
                    <TouchableOpacity style={styles.contactButton} onPress={handleCallVendor}>
                        <Text style={styles.contactButtonText}>📞 Јави се</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.reserveButton, loading && { opacity: 0.7 }]}
                    onPress={handleReserve}
                    disabled={loading}
                >
                    <Text style={styles.reserveButtonText}>
                        {loading ? "Се обработува..." : "Резервирај сега"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 100,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
    },
    backButton: {
        paddingRight: 12,
    },
    backButtonText: {
        fontSize: 16,
        color: "#44b273",
        fontWeight: "bold",
    },
    topBarTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        flex: 1,
    },
    banner: {
        width: "100%",
        height: 180,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    bannerIcon: {
        fontSize: 64,
    },
    discountBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        backgroundColor: "#EF4444",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    discountBadgeText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    content: {
        padding: 20,
    },
    vendorHeader: {
        gap: 4,
    },
    vendorCategory: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#44b273",
        textTransform: "uppercase",
    },
    vendorName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
    vendorDescription: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginVertical: 16,
    },
    boxTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 6,
    },
    boxDescription: {
        fontSize: 14,
        color: "#555",
        lineHeight: 20,
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        backgroundColor: "#f9f9f9",
        padding: 14,
        borderRadius: 10,
    },
    priceLabel: {
        fontSize: 12,
        color: "#666",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 2,
    },
    discountedPrice: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
    },
    originalPrice: {
        fontSize: 15,
        color: "#999",
        textDecorationLine: "line-through",
    },
    quantityBadge: {
        backgroundColor: "#fef3c7",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    quantityText: {
        color: "#d97706",
        fontWeight: "bold",
        fontSize: 12,
    },
    infoSection: {
        gap: 16,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
    },
    infoIcon: {
        fontSize: 20,
        marginTop: 2,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 12,
        color: "#888",
        fontWeight: "500",
    },
    infoValue: {
        fontSize: 15,
        fontWeight: "600",
        color: "#333",
        marginTop: 2,
    },
    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#eee",
        padding: 16,
        flexDirection: "row",
        gap: 10,
    },
    contactButton: {
        borderWidth: 1.5,
        borderColor: "#44b273",
        borderRadius: 9,
        paddingVertical: 14,
        paddingHorizontal: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    contactButtonText: {
        color: "#44b273",
        fontSize: 15,
        fontWeight: "bold",
    },
    reserveButton: {
        flex: 1,
        backgroundColor: "#44b273",
        borderRadius: 9,
        paddingVertical: 14,
        justifyContent: "center",
        alignItems: "center",
    },
    reserveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});