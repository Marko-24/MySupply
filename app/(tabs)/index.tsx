import React, { useState, useEffect } from "react";
import {
    Text,
    View,
    TouchableOpacity,
    FlatList,
    TextInput,
    StyleSheet,
    Image,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ScreenContainer } from "@/components/screen-container";

interface Vendor {
    id: string;
    name: string;
    category: "restaurant" | "producer";
    description: string;
    address: string;
    phone_number?: string;
}

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
    image_url: string;
    vendor?: Vendor;
}

const MOCK_BOXES: SurpriseBox[] = [
    {
        id: "box-1",
        vendor_id: "11111111-1111-1111-1111-111111111111",
        title: "Италијанска паста & пица",
        description: "Свежа домашно подготвена храна пред крај на работно време.",
        original_price: 400,
        discounted_price: 200,
        quantity_available: 3,
        pickup_start_time: "18:00",
        pickup_end_time: "20:00",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
        vendor: {
            id: "11111111-1111-1111-1111-111111111111",
            name: "The Pasta House",
            category: "restaurant",
            description: "Автентичен италијански ресторан",
            address: "ул. Македонија бр. 12",
            phone_number: "070123456",
        },
    },
    {
        id: "box-2",
        vendor_id: "22222222-2222-2222-2222-222222222222",
        title: "Домашни млечни производи",
        description: "Свежи производи од локална малешевска фарма (сирење и кашкавал).",
        original_price: 600,
        discounted_price: 350,
        quantity_available: 5,
        pickup_start_time: "10:00",
        pickup_end_time: "17:00",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&q=80",
        vendor: {
            id: "22222222-2222-2222-2222-222222222222",
            name: "Фарма Малешево",
            category: "producer",
            description: "100% природни млечни производи од паша.",
            address: "с. Берово / Испорака Скопје",
            phone_number: "075987654",
        },
    },
    {
        id: "box-3",
        vendor_id: "33333333-3333-3333-3333-333333333333",
        title: "Бургер & Помфрит Комбо",
        description: "Занаетчиски бургер и свеж помфрит од сочно месо.",
        original_price: 350,
        discounted_price: 180,
        quantity_available: 2,
        pickup_start_time: "16:00",
        pickup_end_time: "18:00",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
        vendor: {
            id: "33333333-3333-3333-3333-333333333333",
            name: "Burger Kingdom",
            category: "restaurant",
            description: "Занаетчиски бургери",
            address: "Бул. Партизански Одреди 22",
            phone_number: "071222333",
        },
    },
    {
        id: "box-4",
        vendor_id: "44444444-4444-4444-4444-444444444444",
        title: "Пакет ливадски мед",
        description: "Тегла чист ливадски мед и соќе од еколошки регион.",
        original_price: 500,
        discounted_price: 300,
        quantity_available: 8,
        pickup_start_time: "09:00",
        pickup_end_time: "19:00",
        is_active: true,
        image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80",
        vendor: {
            id: "44444444-4444-4444-4444-444444444444",
            name: "Пчеларство Јованови",
            category: "producer",
            description: "Природен мед и пчелни производи.",
            address: "Маџари, Скопје",
            phone_number: "078555444",
        },
    },
];

interface MinimalBoxCardProps {
    item: SurpriseBox;
    isFav: boolean;
    onToggleFav: () => void;
}

function MinimalBoxCard({ item, isFav, onToggleFav }: MinimalBoxCardProps) {
    const router = useRouter();
    const isProducer = item.vendor?.category === "producer";
    const discountPercent = Math.round(
        ((item.original_price - item.discounted_price) / item.original_price) * 100
    );

    const handlePress = () => {
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
                image_url: item.image_url,
                vendor_name: item.vendor?.name,
                vendor_category: item.vendor?.category,
                vendor_description: item.vendor?.description,
                vendor_address: item.vendor?.address,
                vendor_phone: item.vendor?.phone_number,
            },
        });
    };

    return (
        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={handlePress}>
            <View style={styles.cardHeader}>
                <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                <View style={styles.badgeRow}>
                    <View style={styles.leftBadges}>
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagBadgeText}>
                                {isProducer ? "🚜 Производител" : "🍽️ Ресторан"}
                            </Text>
                        </View>
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountBadgeText}>-{discountPercent}%</Text>
                        </View>
                    </View>

                    <View style={styles.favoriteButtonContainer}>
                        <FavoriteButton isFavorite={isFav} onPress={onToggleFav} />
                    </View>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.vendorRow}>
                    <Text style={styles.vendorName}>{item.vendor?.name}</Text>
                    <Text style={styles.stockBadge}>{item.quantity_available} останати</Text>
                </View>

                <Text style={styles.boxTitle}>{item.title}</Text>

                <View style={styles.infoMeta}>
                    <Text style={styles.infoText}>⏱ {item.pickup_start_time} - {item.pickup_end_time}</Text>
                    <Text style={styles.dotSeparator}>•</Text>
                    <Text style={styles.infoText} numberOfLines={1}>📍 {item.vendor?.address}</Text>
                </View>

                <View style={styles.priceContainer}>
                    <Text style={styles.priceCurrent}>{item.discounted_price} ден.</Text>
                    <Text style={styles.priceOld}>{item.original_price} ден.</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default function FeedScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"all" | "restaurant" | "producer">("all");
    const [userId, setUserId] = useState<string | undefined>(undefined);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id);
        });

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const { isFavorite, toggleFavorite } = useFavorites(userId);

    const filteredBoxes = MOCK_BOXES.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.vendor?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === "all" ? true : item.vendor?.category === activeTab;
        return matchesSearch && matchesTab;
    });

    return (
        <ScreenContainer>
            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <Text style={styles.brandTitle}>MySupply</Text>
                </View>

                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        placeholder="Пребарај храна или локација..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        style={styles.searchInput}
                    />
                </View>

                <View style={styles.filterRow}>
                    {[
                        { key: "all", label: "Сите" },
                        { key: "restaurant", label: "Ресторани" },
                        { key: "producer", label: "Производители" },
                    ].map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.chip, activeTab === tab.key && styles.chipActive]}
                            onPress={() => setActiveTab(tab.key as any)}
                        >
                            <Text style={[styles.chipText, activeTab === tab.key && styles.chipTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <FlatList
                    data={filteredBoxes}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <MinimalBoxCard
                            item={item}
                            isFav={isFavorite(item.vendor_id)}
                            onToggleFav={() => toggleFavorite(item.vendor_id)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listPadding}
                />
            </View>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: "#FAFAFA", paddingHorizontal: 16, paddingTop: 12 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    brandTitle: { fontSize: 24, fontWeight: "800", color: "#111827", letterSpacing: -0.5 },
    searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: "#E5E7EB", marginBottom: 12 },
    searchIcon: { marginRight: 8, fontSize: 14 },
    searchInput: { flex: 1, fontSize: 14, color: "#111827" },
    filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
    chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#F3F4F6" },
    chipActive: { backgroundColor: "#10B981" },
    chipText: { fontSize: 13, fontWeight: "600", color: "#4B5563" },
    chipTextActive: { color: "#FFFFFF" },
    listPadding: { paddingBottom: 24 },
    card: { backgroundColor: "#FFFFFF", borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: "#F3F4F6", overflow: "hidden" },
    cardHeader: { height: 130, position: "relative" },
    cardImage: { width: "100%", height: "100%", resizeMode: "cover" },
    badgeRow: { position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    leftBadges: { flexDirection: "row", gap: 6 },
    favoriteButtonContainer: { zIndex: 10 },
    tagBadge: { backgroundColor: "rgba(255, 255, 255, 0.95)", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
    tagBadgeText: { fontSize: 11, fontWeight: "700", color: "#374151" },
    discountBadge: { backgroundColor: "#EF4444", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6 },
    discountBadgeText: { fontSize: 11, fontWeight: "700", color: "#FFFFFF" },
    cardBody: { padding: 14 },
    vendorRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 2 },
    vendorName: { fontSize: 11, fontWeight: "600", color: "#10B981", textTransform: "uppercase" },
    stockBadge: { fontSize: 11, fontWeight: "600", color: "#D97706" },
    boxTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 6 },
    infoMeta: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
    infoText: { fontSize: 12, color: "#6B7280" },
    dotSeparator: { marginHorizontal: 6, color: "#9CA3AF" },
    priceContainer: { flexDirection: "row", alignItems: "baseline", gap: 6 },
    priceCurrent: { fontSize: 18, fontWeight: "800", color: "#10B981" },
    priceOld: { fontSize: 12, color: "#9CA3AF", textDecorationLine: "line-through" },
});