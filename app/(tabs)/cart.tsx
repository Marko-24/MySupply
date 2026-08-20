import React from "react";
import { ScrollView, Text, View, Pressable, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function CartScreen() {
  return (
      <ScreenContainer style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mainWrapper}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Кошничка</Text>
              <Text style={styles.subtitle}>Твои избрани производи</Text>
            </View>

            {/* Empty State */}
            <View style={styles.emptyContainer}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 44 }}>🛒</Text>
              </View>
              <Text style={styles.emptyTitle}>Кошничката е празна</Text>
              <Text style={styles.emptySubText}>
                Разгледај ги понудите од локалните фарми и ресторани и додај производи во кошничката.
              </Text>
            </View>

            {/* Checkout Button */}
            <Pressable
                style={({ pressed }) => [
                  styles.checkoutBtn,
                  { transform: [{ scale: pressed ? 0.98 : 1 }] },
                ]}
            >
              <Text style={styles.checkoutBtnText}>Продолжи кон наплата</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { flexGrow: 1, padding: 16 },
  mainWrapper: { flex: 1, justifyContent: "space-between", gap: 20 },
  header: { marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "900", color: "#111827", letterSpacing: -0.5 },
  subtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#111827", textAlign: "center" },
  emptySubText: { fontSize: 13, color: "#6B7280", textAlign: "center", lineHeight: 19 },
  checkoutBtn: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 120
  },
  checkoutBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 15 },
});