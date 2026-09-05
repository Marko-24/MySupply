import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ActionButton, PRIMARY, PRIMARY_LIGHT, INK, MUTED, BORDER, SURFACE, PageHeader, RESERVATIONS, StatusPill, styles as shared } from "@/components/vendor-dashboard";

export default function ReservationsScreen() {
  const [filter, setFilter] = useState<"Сите" | "Подготвено" | "Подигнато">("Сите");

  const reservations = useMemo(() => {
    return filter === "Сите"
        ? RESERVATIONS
        : RESERVATIONS.filter((item) => {
          if (filter === "Подготвено") return item.status === "Ready for pickup" || item.status === "Confirmed";
          if (filter === "Подигнато") return item.status === "Collected";
          return true;
        });
  }, [filter]);

  const handleVerifyCode = (reservation: typeof RESERVATIONS[0]) => {
    Alert.prompt(
        "Потврди подигање",
        `Внесете го 4-цифрениот PIN код од корисникот ${reservation.customer}:`,
        [
          { text: "Откажи", style: "cancel" },
          {
            text: "Потврди",
            onPress: (pin) => {
              if (pin && pin.length === 4) {
                Alert.alert("Успешно подигнато!", `Резервацијата ${reservation.id} е завршена.`);
              } else {
                Alert.alert("Грешка", "Невалиден PIN код. Обидете се повторно.");
              }
            },
          },
        ],
        "plain-text"
    );
  };

  return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <PageHeader
              eyebrow="Денешен тек"
              title="Резервации"
              subtitle="Брза верификација и преглед на корисници кои доаѓаат за подигање."
          />

          {/* Статистика за денешни подигања */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>3</Text>
              <Text style={styles.summaryLabel}>За подигање денес</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardActive]}>
              <Text style={[styles.summaryValue, { color: PRIMARY }]}>1</Text>
              <Text style={styles.summaryLabel}>Чека потврда</Text>
            </View>
          </View>

          {/* Филтри */}
          <View style={styles.filterRow}>
            {(["Сите", "Подготвено", "Подигнато"] as const).map((item) => (
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
            <Text style={styles.sectionTitle}>Активен редослед</Text>
            <Text style={styles.sectionMeta}>{reservations.length} нарачки</Text>
          </View>

          {/* Листа на резервации */}
          <FlatList
              data={reservations}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
                const isCollected = item.status === "Collected";

                return (
                    <View style={[styles.reservationCard, isCollected && styles.cardCollected]}>
                      <View style={styles.reservationTop}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.reservationId}>{item.id}</Text>
                          <Text style={styles.customerName}>{item.customer}</Text>
                        </View>
                        <StatusPill status={item.status} />
                      </View>

                      <View style={styles.divider} />

                      <Text style={styles.boxTitle}>{item.box}</Text>

                      <View style={styles.detailRow}>
                        <Text style={styles.detailText}>🕒 Време: {item.time}</Text>
                        <Text style={styles.detailText}>📦 Количина: {item.count}  пакет{item.count > 1 ? "и" : ""}</Text>
                      </View>

                      {/* Копче за затворање нарачка */}
                      {!isCollected ? (
                          <Pressable
                              onPress={() => handleVerifyCode(item)}
                              style={({ pressed }) => [styles.verifyButton, pressed && shared.pressed]}
                          >
                            <Text style={styles.verifyButtonText}>🔑 Внеси PIN / Потврди</Text>
                          </Pressable>
                      ) : (
                          <View style={styles.collectedBadge}>
                            <Text style={styles.collectedText}>✓ Успешно завршено</Text>
                          </View>
                      )}
                    </View>
                );
              }}
          />
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },

  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 18,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: BORDER,
  },
  summaryCardActive: {
    backgroundColor: PRIMARY_LIGHT,
    borderColor: PRIMARY,
  },
  summaryValue: { color: INK, fontSize: 26, fontWeight: "900" },
  summaryLabel: { color: MUTED, fontSize: 12, fontWeight: "700", marginTop: 2 },

  filterRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  filter: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F3F4F6" },
  filterActive: { backgroundColor: PRIMARY },
  filterText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },

  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: INK, fontSize: 18, fontWeight: "800" },
  sectionMeta: { color: MUTED, fontSize: 12, fontWeight: "600" },

  list: { gap: 14 },
  reservationCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  cardCollected: {
    opacity: 0.7,
    backgroundColor: "#F9FAFB",
  },
  reservationTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  reservationId: { color: PRIMARY, fontSize: 12, fontWeight: "800", letterSpacing: 0.5 },
  customerName: { color: INK, fontSize: 16, fontWeight: "800", marginTop: 2 },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: 12 },

  boxTitle: { color: INK, fontSize: 14, fontWeight: "700" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  detailText: { color: MUTED, fontSize: 12, fontWeight: "600" },

  verifyButton: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: "center",
    paddingVertical: 12,
  },
  verifyButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },

  collectedBadge: {
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    paddingVertical: 10,
  },
  collectedText: { color: MUTED, fontWeight: "800", fontSize: 12 },
});