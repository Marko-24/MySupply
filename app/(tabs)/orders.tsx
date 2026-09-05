import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { supabase } from "@/lib/supabase";
import { ScreenContainer } from "@/components/screen-container";

interface OrderItem {
  id: string;
  pickup_code: string;
  status: string;
  total_price: number;
  quantity: number;
  created_at: string;
  vendors: {
    name: string;
    address: string;
  } | null;
  surprise_boxes: {
    title: string;
  } | null;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      // Explicit relation key specification prevents inner-join resolution errors
      const { data, error } = await supabase
          .from("orders")
          .select(`
          id,
          pickup_code,
          status,
          total_price,
          quantity,
          created_at,
          vendors!orders_vendor_id_fkey ( name, address ),
          surprise_boxes!orders_box_id_fkey ( title )
        `)
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch Orders Error:", error);
      } else if (data) {
        setOrders(data as unknown as OrderItem[]);
      }
    } catch (err) {
      console.error("Unexpected Fetch Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  return (
      <ScreenContainer style={styles.container}>
        <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.mainWrapper}>
            <View style={styles.header}>
              <Text style={styles.title}>Нарачки</Text>
              <Text style={styles.subtitle}>Историја на твоите подигнувања и купони</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
            ) : orders.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.iconCircle}>
                    <Text style={{ fontSize: 44 }}>📋</Text>
                  </View>
                  <Text style={styles.emptyTitle}>Сè уште немаш направено нарачка</Text>
                  <Text style={styles.emptySubText}>
                    Сите твои активни купони за подигнување и историјата на купувања ќе се појават овде.
                  </Text>
                </View>
            ) : (
                orders.map((item) => (
                    <View key={item.id} style={styles.orderCard}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.vendorName}>{item.vendors?.name ?? "Локација"}</Text>
                        <View style={[styles.statusBadge, item.status === "reserved" ? styles.statusReserved : styles.statusDone]}>
                          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                      </View>

                      <Text style={styles.boxTitle}>{item.surprise_boxes?.title ?? "Пакет"}</Text>
                      <Text style={styles.addressText}>📍 {item.vendors?.address ?? "Адресата не е достапна"}</Text>

                      <View style={styles.codeBox}>
                        <Text style={styles.codeLabel}>КОД ЗА ПОДИГНУВАЊЕ:</Text>
                        <Text style={styles.codeValue}>{item.pickup_code}</Text>
                      </View>

                      <View style={styles.cardFooter}>
                        <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        <Text style={styles.priceText}>{item.total_price} ден.</Text>
                      </View>
                    </View>
                ))
            )}
          </View>
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { flexGrow: 1, padding: 16 },
  mainWrapper: { flex: 1, gap: 16 },
  header: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "900", color: "#111827", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 20, gap: 12, marginTop: 40 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#111827", textAlign: "center" },
  emptySubText: { fontSize: 13, color: "#6B7280", textAlign: "center", lineHeight: 19 },
  orderCard: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  vendorName: { fontSize: 12, fontWeight: "700", color: "#10B981", textTransform: "uppercase" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusReserved: { backgroundColor: "#FEF3C7" },
  statusDone: { backgroundColor: "#E5E7EB" },
  statusText: { fontSize: 10, fontWeight: "800", color: "#374151" },
  boxTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 4 },
  addressText: { fontSize: 12, color: "#6B7280", marginBottom: 12 },
  codeBox: { backgroundColor: "#ECFDF5", borderWidth: 1, borderColor: "#A7F3D0", borderRadius: 8, padding: 10, alignItems: "center", marginBottom: 12 },
  codeLabel: { fontSize: 10, fontWeight: "700", color: "#047857", marginBottom: 2 },
  codeValue: { fontSize: 20, fontWeight: "900", color: "#065F46", letterSpacing: 2 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingTop: 8 },
  dateText: { fontSize: 12, color: "#9CA3AF" },
  priceText: { fontSize: 15, fontWeight: "800", color: "#111827" },
});