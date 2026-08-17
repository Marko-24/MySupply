import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ActionButton, BOXES, GREEN, INK, MUTED, PageHeader, StatCard } from "@/components/vendor-dashboard";

export default function SurpriseBoxesScreen() {
  const [filter, setFilter] = useState<"All" | "Live" | "Paused">("All");
  const boxes = useMemo(() => BOXES.filter((box) => filter === "All" || (filter === "Live" ? box.active : !box.active)), [filter]);
  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <PageHeader eyebrow="Vendor workspace" title="Surprise boxes" subtitle="Turn today's surplus into happy customers." action="Create surprise box" />
        <View style={styles.statsRow}>
          <StatCard label="Live boxes" value="2" caption="8 total portions" />
          <StatCard label="Reserved today" value="12" caption="+18% this week" tone="amber" />
          <StatCard label="Revenue" value="€148" caption="Today" tone="dark" />
        </View>
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Your offers</Text><Text style={styles.sectionMeta}>{boxes.length} shown</Text></View>
        <View style={styles.filterRow}>{(["All", "Live", "Paused"] as const).map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[styles.filter, filter === item && styles.filterActive]}><Text style={[styles.filterText, filter === item && styles.filterTextActive]}>{item}</Text></Pressable>)}</View>
        <FlatList data={boxes} scrollEnabled={false} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.boxCard}>
          <View style={[styles.boxArtwork, { backgroundColor: item.accent }]}><Text style={styles.boxEmoji}>✦</Text><View style={styles.liveBadge}><View style={[styles.liveDot, { backgroundColor: item.active ? GREEN : MUTED }]} /><Text style={styles.liveText}>{item.active ? "LIVE" : "PAUSED"}</Text></View></View>
          <View style={styles.boxBody}><View style={styles.boxTitleRow}><Text style={styles.boxTitle}>{item.name}</Text><Text style={styles.boxPrice}>{item.price}</Text></View><Text style={styles.boxDetail}>{item.detail}</Text><View style={styles.metaRow}><Text style={styles.metaText}>◷ {item.pickup}</Text><Text style={styles.metaText}>{item.remaining} left</Text></View><View style={styles.cardActions}><ActionButton label="Edit" secondary onPress={() => Alert.alert("Edit box", `Editing ${item.name}`)} /><ActionButton label="Manage stock" onPress={() => Alert.alert("Manage stock", `Stock for ${item.name}: ${item.remaining} remaining`)} /></View></View>
        </View>} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 30 },
  statsRow: { flexDirection: "row", marginBottom: 28 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { color: INK, fontSize: 19, fontWeight: "800" },
  sectionMeta: { color: MUTED, fontSize: 12, fontWeight: "700" },
  filterRow: { flexDirection: "row", marginBottom: 14, gap: 8 },
  filter: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F0F3F1" },
  filterActive: { backgroundColor: INK },
  filterText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  filterTextActive: { color: "#fff" },
  list: { gap: 14 },
  boxCard: { overflow: "hidden", borderRadius: 20, borderWidth: 1, borderColor: "#E8EFEB", backgroundColor: "#fff" },
  boxArtwork: { height: 84, padding: 16, justifyContent: "center" },
  boxEmoji: { color: GREEN, fontSize: 34, fontWeight: "800" },
  liveBadge: { position: "absolute", right: 14, top: 14, flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.75)", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  liveDot: { width: 7, height: 7, borderRadius: 7 },
  liveText: { color: INK, fontSize: 10, fontWeight: "900", letterSpacing: 0.7 },
  boxBody: { padding: 16 },
  boxTitleRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  boxTitle: { flex: 1, color: INK, fontSize: 16, fontWeight: "800" },
  boxPrice: { color: GREEN, fontSize: 16, fontWeight: "900" },
  boxDetail: { color: MUTED, fontSize: 13, marginTop: 5 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14 },
  metaText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  cardActions: { flexDirection: "row", gap: 8, marginTop: 16 },
  actionButton: { flex: 1 },
});
