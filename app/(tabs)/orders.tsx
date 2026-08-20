import React from "react";
import { ScrollView, Text, View, StyleSheet } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function OrdersScreen() {
  return (
      <ScreenContainer style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mainWrapper}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Нарачки</Text>
              <Text style={styles.subtitle}>Историја на твоите подигнувања и купони</Text>
            </View>

            {/* Empty State Card */}
            <View style={styles.emptyContainer}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 44 }}>📋</Text>
              </View>
              <Text style={styles.emptyTitle}>Сè уште немаш направено нарачка</Text>
              <Text style={styles.emptySubText}>
                Сите твои активни купони за подигнување и историјата на купувања ќе се појават овде.
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { flexGrow: 1, padding: 16 },
  mainWrapper: { flex: 1, gap: 20 },
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
});