import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ScreenContainer } from "@/components/screen-container";

export default function CartScreen() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  console.log("CURRENT CART ITEMS IN SCREEN:", cart);

  const generatePickupCode = () => {
    return `PICKUP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  const handleCheckout = async () => {
    console.log("CHECKOUT BUTTON CLICKED! Cart size:", cart.length);

    if (cart.length === 0) {
      Alert.alert("Кошничката е празна", "Додадете производ за да продолжите.");
      return;
    }

    setLoading(true);

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        Alert.alert("Најава е потребна", "Сесијата е истечена.");
        setLoading(false);
        return;
      }

      console.log("Logged in user ID:", user.id);

      const ordersToInsert = cart.map((item) => ({
        customer_id: user.id,
        box_id: item.id,
        vendor_id: item.vendor_id,
        quantity: item.quantity,
        total_price: item.price * item.quantity,
        status: "reserved",
        pickup_code: generatePickupCode(),
      }));

      console.log("Inserting orders payload into Supabase:", ordersToInsert);

      const { data, error } = await supabase
          .from("orders")
          .insert(ordersToInsert)
          .select();

      if (error) {
        console.error("SUPABASE ERROR:", error);
        Alert.alert("Грешка во база", `${error.message} (${error.code})`);
      } else {
        console.log("SUCCESSFULLY INSERTED ORDER:", data);
        clearCart();
        Alert.alert(
            "Успешна резервација!",
            "Твојата нарачка е зачувана во базата.",
            [{ text: "Оди до нарачки", onPress: () => router.push("/orders") }]
        );
      }
    } catch (err: any) {
      console.error("CATCH ERROR:", err);
      Alert.alert("Грешка", err.message || "Неочекувана грешка.");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Кошничка</Text>
        </View>

        {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ fontSize: 48 }}>🛒</Text>
              <Text style={styles.emptyTitle}>Твојата кошничка е празна</Text>
            </View>
        ) : (
            <View style={{ flex: 1 }}>
              <FlatList
                  data={cart}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                      <View style={styles.cartCard}>
                        {item.image_url && (
                            <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                        )}
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.itemTitle}>{item.title}</Text>
                          <Text style={styles.itemPrice}>
                            {item.quantity}x {item.price} ден.
                          </Text>
                        </View>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                          <Text style={styles.removeBtn}>✕</Text>
                        </TouchableOpacity>
                      </View>
                  )}
              />

              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Вкупно:</Text>
                  <Text style={styles.totalAmount}>{totalPrice} ден.</Text>
                </View>

                <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={handleCheckout}
                    disabled={loading}
                    activeOpacity={0.85}
                >
                  {loading ? (
                      <ActivityIndicator color="#FFFFFF" />
                  ) : (
                      <Text style={styles.checkoutText}>Потврди и Плати</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
        )}
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  header: { marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "900", color: "#111827" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#6B7280" },
  cartCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardImage: { width: 50, height: 50, borderRadius: 8 },
  itemTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  itemPrice: { fontSize: 13, color: "#10B981", fontWeight: "600", marginTop: 2 },
  removeBtn: { fontSize: 18, color: "#EF4444", padding: 8 },
  footer: { backgroundColor: "#FFFFFF", padding: 16, borderRadius: 16, borderTopWidth: 1, borderColor: "#E5E7EB" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  totalLabel: { fontSize: 16, color: "#6B7280" },
  totalAmount: { fontSize: 20, fontWeight: "900", color: "#111827" },
  checkoutBtn: { backgroundColor: "#10B981", height: 50, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  checkoutText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
});