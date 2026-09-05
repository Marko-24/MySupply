import React, { useMemo, useState } from "react";
import { Alert, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import {
  ActionButton,
  BOXES,
  PRIMARY,
  PRIMARY_LIGHT,
  INK,
  MUTED,
  BORDER,
  SURFACE,
  PageHeader,
  AMBER_LIGHT
} from "@/components/vendor-dashboard";

export default function SurpriseBoxesScreen() {
  const [filter, setFilter] = useState<"Сите" | "Активни" | "Паузирани">("Сите");

  const boxes = useMemo(() => {
    return BOXES.filter((box) => {
      if (filter === "Сите") return true;
      if (filter === "Активни") return box.active;
      return !box.active;
    });
  }, [filter]);

  return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <PageHeader
              eyebrow="Работен простор"
              title="Пакети изненадување"
              subtitle="Претворете го вишокот храна во задоволни корисници."
          />

          {/* Нов редизајниран блок за статистика */}
          <View style={styles.statsContainer}>
            {/* Главен фокус: Приход */}
            <View style={styles.mainStatCard}>
              <View style={styles.mainStatHeader}>
                <Text style={styles.mainStatLabel}>Денешен приход</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>+18%</Text>
                </View>
              </View>
              <Text style={styles.mainStatValue}>9,100 <Text style={styles.currencyText}>ден.</Text></Text>
              <Text style={styles.mainStatSub}>Вкупно остварен промет од сите пакети</Text>
            </View>

            {/* Секундарни брзи метрики */}
            <View style={styles.subStatsRow}>
              <View style={styles.subStatCard}>
                <View style={[styles.iconCircle, { backgroundColor: PRIMARY_LIGHT }]}>
                  <Text style={{ fontSize: 14 }}>📦</Text>
                </View>
                <View>
                  <Text style={styles.subStatValue}>2</Text>
                  <Text style={styles.subStatLabel}>Активни пакети</Text>
                  <Text style={styles.subStatCaption}>8 порции достапни</Text>
                </View>
              </View>

              <View style={styles.subStatCard}>
                <View style={[styles.iconCircle, { backgroundColor: AMBER_LIGHT }]}>
                  <Text style={{ fontSize: 14 }}>🎟️</Text>
                </View>
                <View>
                  <Text style={styles.subStatValue}>12</Text>
                  <Text style={styles.subStatLabel}>Резервирано</Text>
                  <Text style={styles.subStatCaption}>Подготвено за подигање</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Наслов и филтри */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Вашите понуди</Text>
            <Text style={styles.sectionMeta}>{boxes.length} пакети</Text>
          </View>

          <View style={styles.filterRow}>
            {(["Сите", "Активни", "Паузирани"] as const).map((item) => (
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

          {/* Листа на пакети со ГОЛЕМИ слики */}
          <FlatList
              data={boxes}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                  <View style={styles.boxCard}>
                    {/* Голема слика на пакетот со статус индикатор */}
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.image }} style={styles.boxImage} />
                      <View style={styles.liveBadge}>
                        <View style={[styles.liveDot, { backgroundColor: item.active ? PRIMARY : MUTED }]} />
                        <Text style={styles.liveText}>{item.active ? "АКТИВНО" : "ПАУЗИРАНО"}</Text>
                      </View>
                    </View>

                    {/* Тело на картичката */}
                    <View style={styles.boxBody}>
                      <View style={styles.boxTitleRow}>
                        <Text style={styles.boxTitle}>{item.name}</Text>
                        <Text style={styles.boxPrice}>{item.price}</Text>
                      </View>

                      <Text style={styles.boxDetail}>{item.detail}</Text>

                      <View style={styles.metaRow}>
                        <Text style={styles.metaText}>🕒 {item.pickup}</Text>
                        <Text style={styles.metaText}>Преостанати: {item.remaining}</Text>
                      </View>

                      {/* Копчиња за акција */}
                      <View style={styles.cardActions}>
                        <View style={styles.actionBtnWrapper}>
                          <ActionButton
                              label="Уреди"
                              secondary
                              onPress={() => Alert.alert("Уреди пакет", `Измена на пакетот: "${item.name}"`)}
                          />
                        </View>
                        <View style={styles.actionBtnWrapper}>
                          <ActionButton
                              label="Залиха"
                              onPress={() => Alert.alert("Управувај со залиха", `Преостанати порции за "${item.name}": ${item.remaining}`)}
                          />
                        </View>
                      </View>
                    </View>
                  </View>
              )}
          />
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },

  // Нов редизајниран блок за статистика
  statsContainer: { gap: 10, marginBottom: 24 },
  mainStatCard: {
    backgroundColor: INK,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
    shadowColor: INK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  mainStatHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  mainStatLabel: { color: "#9CA3AF", fontSize: 12, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  trendBadge: { backgroundColor: "rgba(16, 185, 129, 0.2)", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 },
  trendText: { color: PRIMARY, fontSize: 11, fontWeight: "800" },
  mainStatValue: { color: "#FFFFFF", fontSize: 30, fontWeight: "900", marginTop: 6 },
  currencyText: { fontSize: 18, color: "#9CA3AF", fontWeight: "600" },
  mainStatSub: { color: "#9CA3AF", fontSize: 11, marginTop: 4 },

  subStatsRow: { flexDirection: "row", gap: 10 },
  subStatCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: SURFACE,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  iconCircle: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  subStatValue: { color: INK, fontSize: 18, fontWeight: "800" },
  subStatLabel: { color: INK, fontSize: 12, fontWeight: "700" },
  subStatCaption: { color: MUTED, fontSize: 10 },

  // Заглавие и филтри
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: INK, fontSize: 18, fontWeight: "800" },
  sectionMeta: { color: MUTED, fontSize: 12, fontWeight: "600" },

  filterRow: { flexDirection: "row", marginBottom: 16, gap: 8 },
  filter: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F3F4F6" },
  filterActive: { backgroundColor: PRIMARY },
  filterText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },

  // Пакети (со ГОЛЕМИ слики)
  list: { gap: 16 },
  boxCard: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageContainer: { height: 130, width: "100%", position: "relative" },
  boxImage: { width: "100%", height: "100%" },
  liveBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  liveText: { color: INK, fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  boxBody: { padding: 16 },
  boxTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  boxTitle: { flex: 1, color: INK, fontSize: 16, fontWeight: "800" },
  boxPrice: { color: PRIMARY, fontSize: 16, fontWeight: "800" },
  boxDetail: { color: MUTED, fontSize: 13, marginTop: 4 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  metaText: { color: INK, fontSize: 12, fontWeight: "600" },

  cardActions: { flexDirection: "row", gap: 10, marginTop: 16 },
  actionBtnWrapper: { flex: 1 },
});