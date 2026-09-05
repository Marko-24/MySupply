import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { PageHeader, HISTORY, styles as shared } from "@/components/vendor-dashboard";

export default function HistoryScreen() {
  const [filter, setFilter] = useState<"Сите" | "Резервации" | "Залиха">("Сите");

  const filteredHistory = useMemo(() => {
    return filter === "Сите"
        ? HISTORY
        : HISTORY.filter((item) => {
          if (filter === "Резервации") return item.title.includes("нарачка") || item.title.includes("Reservation") || item.title.includes("подигнато");
          if (filter === "Залиха") return item.title.includes("пакет") || item.title.includes("објавено") || item.title.includes("Stock");
          return true;
        });
  }, [filter]);

  return (
      <ScreenContainer style={{ backgroundColor: "#F2F4F7" }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <PageHeader
              eyebrow="Ревизија & Дневник"
              title="Историја"
              subtitle="Транспарентен преглед на сите промени и активни настани во вашата локација."
          />

          {/* 3D Glass Insight Card */}
          <View style={styles.glassInsightCard}>
            <View style={styles.insightHeader}>
              <Text style={styles.insightKicker}>ОВАА НЕДЕЛА</Text>
              <View style={styles.glassBadge}>
                <Text style={styles.glassBadgeText}>📈 +24% од минатата</Text>
              </View>
            </View>
            <Text style={styles.insightTitle}>Локацијата работи одлично!</Text>
            <Text style={styles.insightText}>
              Завршени се 18 резервации и обновени 6 Surprise Box понуди.
            </Text>
          </View>

          {/* Филтри */}
          <View style={styles.filterRow}>
            {(["Сите", "Резервации", "Залиха"] as const).map((item) => (
                <Pressable
                    key={item}
                    onPress={() => setFilter(item)}
                    style={[styles.filter, filter === item && styles.filterActive]}
                >
                  <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                    {item}
                  </Text>
                </Pressable>
            ))}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Неодамнешни активности</Text>
            <Text style={styles.sectionMeta}>Последни 7 дена</Text>
          </View>

          {/* Glass List Container */}
          <View style={styles.glassListContainer}>
            <FlatList
                data={filteredHistory}
                scrollEnabled={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  const isWarning = item.tone === "warning";
                  const isNeutral = item.tone === "neutral";

                  return (
                      <Pressable
                          onPress={() => Alert.alert(item.title, item.description)}
                          style={({ pressed }) => [
                            styles.activityItem,
                            index === filteredHistory.length - 1 && { borderBottomWidth: 0 },
                            pressed && styles.itemPressed,
                          ]}
                      >
                        <View
                            style={[
                              styles.icon3DWrapper,
                              isWarning
                                  ? styles.warningIcon
                                  : isNeutral
                                      ? styles.neutralIcon
                                      : styles.successIcon,
                            ]}
                        >
                          <Text style={styles.icon3DText}>
                            {isWarning ? "⚠️" : isNeutral ? "🔄" : "✅"}
                          </Text>
                        </View>

                        <View style={styles.activityBody}>
                          <Text style={styles.activityTitle}>{item.title}</Text>
                          <Text style={styles.activityDescription}>{item.description}</Text>
                          <Text style={styles.activityTime}>🕒 {item.time}</Text>
                        </View>

                        <Text style={styles.iosChevron}>›</Text>
                      </Pressable>
                  );
                }}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },

  // Glass Insight Card
  glassInsightCard: {
    padding: 20,
    borderRadius: 24,
    backgroundColor: "#0F172A",
    marginBottom: 20,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 4,
  },
  insightHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  insightKicker: { color: "#34D399", fontSize: 10, fontWeight: "900", letterSpacing: 1.2 },
  glassBadge: { backgroundColor: "rgba(255, 255, 255, 0.12)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  glassBadgeText: { color: "#FFFFFF", fontSize: 10, fontWeight: "700" },
  insightTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginTop: 8 },
  insightText: { color: "#94A3B8", fontSize: 12, lineHeight: 18, marginTop: 4 },

  // iOS Style Filters
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  filter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  filterActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  filterText: { color: "#64748B", fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: "#0F172A", fontSize: 18, fontWeight: "800" },
  sectionMeta: { color: "#64748B", fontSize: 12, fontWeight: "600" },

  // Glass List Group
  glassListContainer: {
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  itemPressed: { backgroundColor: "rgba(0, 0, 0, 0.03)" },

  icon3DWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  successIcon: { backgroundColor: "#DCFCE7" },
  warningIcon: { backgroundColor: "#FEF3C7" },
  neutralIcon: { backgroundColor: "#F1F5F9" },
  icon3DText: { fontSize: 18 },

  activityBody: { flex: 1 },
  activityTitle: { color: "#0F172A", fontSize: 14, fontWeight: "800" },
  activityDescription: { color: "#64748B", fontSize: 11, marginTop: 2, fontWeight: "500" },
  activityTime: { color: "#94A3B8", fontSize: 10, marginTop: 4, fontWeight: "600" },

  iosChevron: { color: "#94A3B8", fontSize: 20, fontWeight: "300", paddingLeft: 8 },
});