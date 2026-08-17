import React, { useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GREEN, HISTORY, INK, MUTED, PageHeader, styles as shared } from "@/components/vendor-dashboard";

export default function HistoryScreen() {
  const [filter, setFilter] = useState("All activity");
  return <ScreenContainer><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <PageHeader eyebrow="Audit trail" title="History log" subtitle="A transparent record of changes across your shop." />
    <View style={styles.insight}><Text style={styles.insightKicker}>THIS WEEK</Text><Text style={styles.insightTitle}>Your shop is moving well.</Text><Text style={styles.insightText}>18 reservations completed and 6 offers refreshed.</Text></View>
    <View style={styles.filterRow}>{["All activity", "Reservations", "Inventory"].map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>
    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Recent activity</Text><Text style={styles.sectionMeta}>Last 7 days</Text></View>
    <FlatList data={HISTORY} scrollEnabled={false} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <Pressable onPress={() => Alert.alert(item.title, item.description)} style={({ pressed }) => [styles.activity, pressed && shared.pressed]}><View style={[styles.activityIcon, item.tone === "warning" ? styles.warningIcon : item.tone === "neutral" ? styles.neutralIcon : styles.successIcon]}><Text style={styles.activityIconText}>{item.tone === "warning" ? "!" : item.tone === "neutral" ? "↻" : "✓"}</Text></View><View style={styles.activityBody}><Text style={styles.activityTitle}>{item.title}</Text><Text style={styles.activityDescription}>{item.description}</Text><Text style={styles.activityTime}>{item.time}</Text></View><Text style={styles.chevron}>›</Text></Pressable>} />
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 34 },
  insight: { padding: 18, borderRadius: 20, backgroundColor: INK, marginBottom: 20 },
  insightKicker: { color: "#8FD2A7", fontSize: 11, fontWeight: "900", letterSpacing: 1.2 },
  insightTitle: { color: "#fff", fontSize: 19, fontWeight: "800", marginTop: 8 },
  insightText: { color: "#B9C9BF", fontSize: 13, lineHeight: 19, marginTop: 5 },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 24 },
  filter: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F0F3F1" },
  filterActive: { backgroundColor: GREEN },
  filterText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: "#fff" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { color: INK, fontSize: 19, fontWeight: "800" },
  sectionMeta: { color: MUTED, fontSize: 12, fontWeight: "700" },
  list: { gap: 10 },
  activity: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  activityIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 12 },
  successIcon: { backgroundColor: "#E4F5EA" },
  warningIcon: { backgroundColor: "#FFF0D8" },
  neutralIcon: { backgroundColor: "#EDF0F0" },
  activityIconText: { color: GREEN, fontSize: 18, fontWeight: "900" },
  activityBody: { flex: 1 },
  activityTitle: { color: INK, fontSize: 14, fontWeight: "800" },
  activityDescription: { color: MUTED, fontSize: 12, marginTop: 4 },
  activityTime: { color: "#9BA8A1", fontSize: 11, marginTop: 6 },
  chevron: { color: "#A4B0A9", fontSize: 26, fontWeight: "300", paddingLeft: 8 },
});
