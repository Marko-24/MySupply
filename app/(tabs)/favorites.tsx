import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useFavorites } from "@/hooks/useFavorites";
import { FavoriteButton } from "@/components/ui/favorite-button";
import { ScreenContainer } from "@/components/screen-container";

export default function FavoritesScreen() {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [favoriteVendors, setFavoriteVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { isFavorite, toggleFavorite } = useFavorites(userId);

  // Функција за вчитување на омилените локали
  const loadFavoritesData = useCallback(async () => {
    setLoading(true);

    // 1. Земи ја сесијата
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;
    setUserId(currentUserId);

    if (!currentUserId) {
      setFavoriteVendors([]);
      setLoading(false);
      return;
    }

    // 2. Земи ги сите record-и од favorites за корисникот
    const { data: favRows, error: favError } = await supabase
        .from("favorites")
        .select("vendor_id")
        .eq("user_id", currentUserId);

    if (favError || !favRows || favRows.length === 0) {
      setFavoriteVendors([]);
      setLoading(false);
      return;
    }

    // 3. Земи ги сите vendor_id од редовите
    const vendorIds = favRows.map((f) => f.vendor_id);

    // 4. Направи query во 'vendors' за сите совпаднати ID-ња
    const { data: vendorsData, error: vendorsError } = await supabase
        .from("vendors")
        .select("*")
        .in("id", vendorIds);

    if (!vendorsError && vendorsData) {
      setFavoriteVendors(vendorsData);
    } else {
      console.error("Грешка при вчитување вендори:", vendorsError);
    }

    setLoading(false);
  }, []);

  // useFocusEffect се активира СЕКОЈПАТ кога корисникот ќе се врати на овој таб/екран
  useFocusEffect(
      useCallback(() => {
        loadFavoritesData();
      }, [loadFavoritesData])
  );

  const handleToggle = async (vendorId: string) => {
    // 1. Избриши/додај во база преку hook-от
    await toggleFavorite(vendorId);
    // 2. Веднаш отстрани го од UI
    setFavoriteVendors((prev) => prev.filter((v) => v.id !== vendorId));
  };

  if (loading) {
    return (
        <ScreenContainer style={styles.centered}>
          <ActivityIndicator size="large" color="#10B981" />
        </ScreenContainer>
    );
  }

  return (
      <ScreenContainer style={styles.container}>
        <Text style={styles.headerTitle}>Омилени локални производители 💚</Text>

        {favoriteVendors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🧺</Text>
              <Text style={styles.emptyTitle}>Сè уште немате омилени локали</Text>
              <Text style={styles.emptySub}>
                Кликнете на зеленото срце на кој било локал за да го зачувате овде.
              </Text>
            </View>
        ) : (
            <FlatList
                data={favoriteVendors}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                      <View style={styles.cardInfo}>
                        <Text style={styles.vendorName}>{item.name}</Text>
                        {item.address && <Text style={styles.vendorAddress}>{item.address}</Text>}
                      </View>
                      <FavoriteButton
                          isFavorite={isFavorite(item.id)}
                          onPress={() => handleToggle(item.id)}
                      />
                    </View>
                )}
            />
        )}
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: "900", color: "#0F172A", marginBottom: 20, marginTop:20, marginLeft: 10 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  emptySub: { fontSize: 13, color: "#64748B", textAlign: "center", marginTop: 6, paddingHorizontal: 20 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 1,
  },
  cardInfo: { flex: 1, marginRight: 12 },
  vendorName: { fontSize: 16, fontWeight: "800", color: "#0F172A" },
  vendorAddress: { fontSize: 12, color: "#64748B", marginTop: 2 },
});