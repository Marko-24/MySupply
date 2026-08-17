import React, { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ActionButton, GREEN, INK, MUTED, PageHeader, PRODUCTS, StatusPill, styles as shared } from "@/components/vendor-dashboard";

export default function ProductsScreen() {
  const [query, setQuery] = useState("All");
  const products = useMemo(() => query === "All" ? PRODUCTS : PRODUCTS.filter((product) => product.category === query), [query]);
  return <ScreenContainer><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <PageHeader eyebrow="Catalog" title="Products" subtitle="Keep your everyday inventory accurate and ready." action="Add product" />
    <View style={styles.summary}><View><Text style={styles.summaryLabel}>Catalog health</Text><Text style={styles.summaryValue}>92%</Text><Text style={styles.summaryCaption}>4 products · updated just now</Text></View><View style={styles.healthRing}><Text style={styles.healthRingText}>A</Text></View></View>
    <View style={styles.categoryRow}>{["All", "Bakery", "Prepared food", "Pantry"].map((item) => <Pressable key={item} onPress={() => setQuery(item)} style={[styles.category, query === item && styles.categoryActive]}><Text style={[styles.categoryText, query === item && styles.categoryTextActive]}>{item}</Text></Pressable>)}</View>
    <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Inventory</Text><Text style={styles.sectionMeta}>{products.length} products</Text></View>
    <FlatList data={products} scrollEnabled={false} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <View style={styles.productCard}><View style={styles.productIcon}><Text style={styles.productIconText}>{item.category === "Bakery" ? "⌁" : item.category === "Pantry" ? "◇" : "＋"}</Text></View><View style={styles.productInfo}><Text style={styles.productName}>{item.name}</Text><Text style={styles.productCategory}>{item.category} · {item.price}</Text><View style={styles.stockRow}><Text style={styles.stockText}>{item.stock} units</Text><StatusPill status={item.status} /></View></View><Pressable onPress={() => Alert.alert("Edit product", `Editing ${item.name}`)} style={({ pressed }) => [styles.moreButton, pressed && shared.pressed]}><Text style={styles.moreText}>•••</Text></Pressable></View>} />
    <ActionButton label="Import or add products" secondary onPress={() => Alert.alert("Add products", "Choose between creating a product or importing your catalog.")} />
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 34 },
  summary: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 18, borderRadius: 20, backgroundColor: INK, marginBottom: 20 },
  summaryLabel: { color: "#B9C9BF", fontSize: 12, fontWeight: "700" },
  summaryValue: { color: "#fff", fontSize: 32, fontWeight: "800", marginTop: 4 },
  summaryCaption: { color: "#B9C9BF", fontSize: 12, marginTop: 2 },
  healthRing: { width: 62, height: 62, borderWidth: 5, borderColor: "#5BB77D", borderRadius: 40, alignItems: "center", justifyContent: "center" },
  healthRingText: { color: "#fff", fontSize: 22, fontWeight: "800" },
  categoryRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  category: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: "#F0F3F1" },
  categoryActive: { backgroundColor: GREEN },
  categoryText: { color: MUTED, fontSize: 12, fontWeight: "700" },
  categoryTextActive: { color: "#fff" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { color: INK, fontSize: 19, fontWeight: "800" },
  sectionMeta: { color: MUTED, fontSize: 12, fontWeight: "700" },
  list: { gap: 10, marginBottom: 18 },
  productCard: { flexDirection: "row", alignItems: "center", padding: 13, borderRadius: 18, borderWidth: 1, borderColor: "#E8EFEB", backgroundColor: "#fff" },
  productIcon: { width: 48, height: 48, borderRadius: 15, backgroundColor: "#EAF5EE", alignItems: "center", justifyContent: "center", marginRight: 12 },
  productIconText: { color: GREEN, fontSize: 26, fontWeight: "800" },
  productInfo: { flex: 1 },
  productName: { color: INK, fontSize: 15, fontWeight: "800" },
  productCategory: { color: MUTED, fontSize: 12, marginTop: 4 },
  stockRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 9, paddingRight: 4 },
  stockText: { color: INK, fontSize: 12, fontWeight: "800" },
  moreButton: { padding: 8, alignSelf: "flex-start" },
  moreText: { color: MUTED, fontWeight: "900", letterSpacing: 1 },
});
