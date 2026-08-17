import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GREEN, INK, MUTED, PageHeader, RESERVATIONS, StatusPill, styles as shared } from "@/components/vendor-dashboard";

export default function ReservationsScreen() {
  const [filter, setFilter] = useState("All");
  const reservations = useMemo(() => filter === "All" ? RESERVATIONS : RESERVATIONS.filter((item) => item.status === filter), [filter]);
  return <ScreenContainer><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <PageHeader eyebrow="Customer flow" title="Reservations" subtitle="A calm, clear queue for every pickup." />
    <View style={styles.summaryRow}><View style={styles.summaryCard}><Text style={styles.summaryValue}>3</Text><Text style={styles.summaryLabel}>Today&apos;s pickups</Text></View><View style={[styles.summaryCard, styles.summaryCardGreen]}><Text style={styles.summaryValue}>1</Text><Text style={styles.summaryLabel}>Needs attention</Text></View></View>
    <View style={styles.filterRow}>{["All", "Confirmed", "Ready for pickup", "Collected"].map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item === "Ready for pickup" ? "Ready" : item}</Text></Pressable>)}</View>
    <FlatList data={reservations} scrollEnabled={false} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.reservationCard}><View style={styles.reservationTop}><View><Text style={styles.reservationId}>{item.id}</Text><Text style={styles.customer}>{item.customer}</Text></View><StatusPill status={item.status} /></View><View style={styles.divider} /><Text style={styles.boxName}>{item.box}</Text><View style={styles.detailRow}><Text style={styles.detailText}>◷ {item.time}</Text><Text style={styles.detailText}>× {item.count} box{item.count > 1 ? "es" : ""}</Text></View><Pressable onPress={() => Alert.alert("Reservation", `${item.id} for ${item.customer}`)} style={({ pressed }) => [styles.viewButton, pressed && shared.pressed]}><Text style={styles.viewButtonText}>{item.status === "Confirmed" ? "Mark ready" : "View details"}</Text></Pressable></View>} />
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 32 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 20 },
  summaryCard: { flex: 1, padding: 16, borderRadius: 18, backgroundColor: "#FFF4E6" },
  summaryCardGreen: { backgroundColor: "#EAF5EE" },
  summaryValue: { color: INK, fontSize: 28, fontWeight: "800" },
  summaryLabel: { color: MUTED, fontSize: 12, fontWeight: "700", marginTop: 4 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  filter: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F0F3F1" },
  filterActive: { backgroundColor: INK },
  filterText: { color: MUTED, fontSize: 11, fontWeight: "700" },
  filterTextActive: { color: "#fff" },
  list: { gap: 12 },
  reservationCard: { padding: 16, borderRadius: 20, borderWidth: 1, borderColor: "#E8EFEB", backgroundColor: "#fff" },
  reservationTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 10 },
  reservationId: { color: GREEN, fontSize: 12, fontWeight: "900" },
  customer: { color: INK, fontSize: 16, fontWeight: "800", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#EDF1EE", marginVertical: 13 },
  boxName: { color: INK, fontSize: 14, fontWeight: "700" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 9 },
  detailText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  viewButton: { marginTop: 15, borderRadius: 12, backgroundColor: "#EDF3EF", alignItems: "center", paddingVertical: 11 },
  viewButtonText: { color: GREEN, fontWeight: "800", fontSize: 12 },
});
