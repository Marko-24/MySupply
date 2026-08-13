import React, { useState } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

// Тип за Vendor според Supabase базата
interface Vendor {
    id: string;
    name: string;
    category: "restaurant" | "producer";
    description: string;
    address: string;
    image_url?: string;
    phone_number?: string;
}

// Тип за Surprise Box според Supabase базата
interface SurpriseBox {
    id: string;
    vendor_id: string;
    title: string;
    description: string;
    original_price: number;
    discounted_price: number;
    quantity_available: number;
    pickup_start_time: string;
    pickup_end_time: string;
    is_active: boolean;
    vendor?: Vendor;
}

// Пример податоци усогласени со Supabase структурата
const MOCK_BOXES: SurpriseBox[] = [
    {
        id: "box-1",
        vendor_id: "v-1",
        title: "Италијанска паста и пица кутија",
        description: "Свежа домашно подготвена храна пред крај на работно време.",
        original_price: 400,
        discounted_price: 200,
        quantity_available: 3,
        pickup_start_time: "18:00",
        pickup_end_time: "20:00",
        is_active: true,
        vendor: {
            id: "v-1",
            name: "The Pasta House",
            category: "restaurant",
            description: "Автентичен италијански ресторан",
            address: "ул. Македонија бр. 12, Скопје",
            phone_number: "070123456",
        },
    },
    {
        id: "box-2",
        vendor_id: "v-2",
        title: "Пакет домашни млечни производи",
        description: "Свежи производи од локална малешевска фарма (сирење и кашкавал).",
        original_price: 600,
        discounted_price: 350,
        quantity_available: 5,
        pickup_start_time: "10:00",
        pickup_end_time: "17:00",
        is_active: true,
        vendor: {
            id: "v-2",
            name: "Фарма Малешево",
            category: "producer",
            description: "100% природни и органски млечни производи од локално производство.",
            address: "с. Берово / Испорака до Скопје",
            phone_number: "075987654",
        },
    },
    {
        id: "box-3",
        vendor_id: "v-3",
        title: "Бургер & Помфрит Комбо",
        description: "Изненадување ручек кутија.",
        original_price: 350,
        discounted_price: 180,
        quantity_available: 2,
        pickup_start_time: "16:00",
        pickup_end_time: "18:00",
        is_active: true,
        vendor: {
            id: "v-3",
            name: "Burger Kingdom",
            category: "restaurant",
            description: "Најдобрите занаетчиски бургери во градот",
            address: "Бул. Партизански Одреди 22",
            phone_number: "071222333",
        },
    },
    {
        id: "box-4",
        vendor_id: "v-4",
        title: "Пакет домашен занаетчиски мед",
        description: "Тегла ливадски мед + пчелен полен со промотивен попуст.",
        original_price: 500,
        discounted_price: 300,
        quantity_available: 8,
        pickup_start_time: "09:00",
        pickup_end_time: "19:00",
        is_active: true,
        vendor: {
            id: "v-4",
            name: "Пчеларство Јованови",
            category: "producer",
            description: "Природен мед и пчелни производи од еколошки чист регион.",
            address: "Маџари, Скопје",
            phone_number: "078555444",
        },
    },
];

function BoxCard({ item }: { item: SurpriseBox }) {
    const router = useRouter();
    const isProducer = item.vendor?.category === "producer";

    const handlePressCard = () => {
        router.push({
            pathname: "/details",
            params: {
                id: item.id,
                title: item.title,
                description: item.description,
                original_price: item.original_price,
                discounted_price: item.discounted_price,
                quantity_available: item.quantity_available,
                pickup_start_time: item.pickup_start_time,
                pickup_end_time: item.pickup_end_time,
                vendor_name: item.vendor?.name,
                vendor_category: item.vendor?.category,
                vendor_description: item.vendor?.description,
                vendor_address: item.vendor?.address,
                vendor_phone: item.vendor?.phone_number,
            },
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={handlePressCard} activeOpacity={0.9}>
            {/* Visual Header */}
            <View
                style={[
                    styles.imageContainer,
                    { backgroundColor: isProducer ? "#eef2ff" : "#e8f7ee" },
                ]}
            >
                <Text style={styles.categoryIcon}>{isProducer ? "🚜" : "🍽️"}</Text>
                <View style={styles.badgeDiscount}>
                    <Text style={styles.badgeText}>
                        -{Math.round(((item.original_price - item.discounted_price) / item.original_price) * 100)}%
                    </Text>
                </View>
                <View style={[styles.badgeCategory, { backgroundColor: isProducer ? "#6366f1" : "#44b273" }]}>
                    <Text style={styles.badgeCategoryText}>
                        {isProducer ? "Производител" : "Ресторан"}
                    </Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.cardContent}>
                <Text style={styles.vendorName}>{item.vendor?.name}</Text>
                <Text style={styles.boxTitle}>{item.title}</Text>
                <Text style={styles.boxDescription} numberOfLines={2}>
                    {item.description}
                </Text>

                {/* Price Section */}
                <View style={styles.priceRow}>
                    <Text style={styles.discountedPrice}>{item.discounted_price} ден.</Text>
                    <Text style={styles.originalPrice}>{item.original_price} ден.</Text>
                    <Text style={styles.quantityText}>Останати: {item.quantity_available}</Text>
                </View>

                {/* Info Section */}
                <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>⏱️</Text>
                        <Text style={styles.metaText}>
                            {item.pickup_start_time} - {item.pickup_end_time}
                        </Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>📍</Text>
                        <Text style={styles.metaText} numberOfLines={1}>
                            {item.vendor?.address}
                        </Text>
                    </View>
                </View>

                {/* Action Button */}
                <View style={styles.actionButtonsRow}>
                    <View style={styles.addToCartButton}>
                        <Text style={styles.addToCartButtonText}>Види детали</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function FeedScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "restaurant" | "producer">("all");

    const filteredBoxes = MOCK_BOXES.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vendor?.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTab =
            activeTab === "all" ? true : item.vendor?.category === activeTab;

        return matchesSearch && matchesTab;
    });

    return (
        <ScreenContainer>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.brandTitle}>MySupply</Text>
                    <Text style={styles.brandSubtitle}>Спасете храна & Поддржете ги локалните производители</Text>
                </View>

                {/* Categories Tabs */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "all" && styles.activeTabButton]}
                        onPress={() => setActiveTab("all")}
                    >
                        <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>Сите</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "restaurant" && styles.activeTabButton]}
                        onPress={() => setActiveTab("restaurant")}
                    >
                        <Text style={[styles.tabText, activeTab === "restaurant" && styles.activeTabText]}>
                            🍔 Ресторани
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === "producer" && styles.activeTabButton]}
                        onPress={() => setActiveTab("producer")}
                    >
                        <Text style={[styles.tabText, activeTab === "producer" && styles.activeTabText]}>
                            🚜 Производители
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            placeholder="Пребарај кутија, ресторан или производител..."
                            placeholderTextColor="#999"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            style={styles.searchInput}
                        />
                    </View>
                </View>

                {/* Items List */}
                {filteredBoxes.length > 0 ? (
                    <FlatList
                        data={filteredBoxes}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <BoxCard item={item} />}
                        scrollEnabled={false}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🔍</Text>
                        <Text style={styles.emptyTitle}>Нема пронајдено понуди</Text>
                        <Text style={styles.emptySubtitle}>Обидете се со друга категорија или пребарување</Text>
                    </View>
                )}
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
    },
    header: {
        marginBottom: 16,
        marginTop: 10,
    },
    brandTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#44b273",
    },
    brandSubtitle: {
        fontSize: 13,
        color: "#666",
        color: "#666",
        marginTop: 2,
    },
    tabContainer: {
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        borderRadius: 10,
        padding: 4,
        marginBottom: 16,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        borderRadius: 8,
    },
    activeTabButton: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#666",
    },
    activeTabText: {
        color: "#44b273",
    },
    searchContainer: {
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 9,
        paddingHorizontal: 12,
        height: 46,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#333",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#eee",
        overflow: "hidden",
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    imageContainer: {
        width: "100%",
        height: 120,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    categoryIcon: {
        fontSize: 44,
    },
    badgeDiscount: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#EF4444",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    badgeCategory: {
        position: "absolute",
        top: 10,
        left: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    badgeCategoryText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600",
    },
    cardContent: {
        padding: 16,
        gap: 6,
    },
    vendorName: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#44b273",
        textTransform: "uppercase",
    },
    boxTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#333",
    },
    boxDescription: {
        fontSize: 13,
        color: "#666",
        lineHeight: 18,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 6,
    },
    discountedPrice: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    originalPrice: {
        fontSize: 14,
        color: "#999",
        textDecorationLine: "line-through",
    },
    quantityText: {
        marginLeft: "auto",
        fontSize: 12,
        color: "#e67e22",
        fontWeight: "600",
    },
    metaRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        marginTop: 4,
    },
    metaItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        maxWidth: "50%",
    },
    metaIcon: {
        fontSize: 13,
    },
    metaText: {
        fontSize: 12,
        color: "#666",
    },
    actionButtonsRow: {
        marginTop: 10,
    },
    addToCartButton: {
        backgroundColor: "#44b273",
        borderRadius: 9,
        paddingVertical: 11,
        alignItems: "center",
    },
    addToCartButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        gap: 8,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    emptySubtitle: {
        fontSize: 13,
        color: "#666",
    },
});