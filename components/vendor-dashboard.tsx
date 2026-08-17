import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export const GREEN = "#2F8F5B";
export const INK = "#17231D";
export const MUTED = "#718078";
export const BORDER = "#E6ECE8";
export const SURFACE = "#F7FAF8";
export const AMBER = "#D58A2D";

export const BOXES = [
  { id: "1", name: "Morning bakery rescue", detail: "Assorted pastries and fresh bread", pickup: "08:00–10:00", price: "€6.50", remaining: 8, active: true, accent: "#EAF5EE" },
  { id: "2", name: "Lunch comfort box", detail: "Chef's choice of today's prepared meals", pickup: "14:00–16:00", price: "€9.00", remaining: 4, active: true, accent: "#FFF4E6" },
  { id: "3", name: "End-of-day sweet treats", detail: "Cakes, cookies and seasonal desserts", pickup: "18:30–20:00", price: "€5.00", remaining: 0, active: false, accent: "#F0EEFA" },
];

export const PRODUCTS = [
  { id: "1", name: "Sourdough loaf", category: "Bakery", stock: 22, price: "€4.20", status: "In stock" },
  { id: "2", name: "Seasonal vegetable soup", category: "Prepared food", stock: 9, price: "€5.50", status: "Low stock" },
  { id: "3", name: "Cinnamon roll", category: "Bakery", stock: 0, price: "€3.10", status: "Out of stock" },
  { id: "4", name: "House granola", category: "Pantry", stock: 16, price: "€7.80", status: "In stock" },
];

export const RESERVATIONS = [
  { id: "#MS-1048", customer: "Sofia Martin", box: "Morning bakery rescue", time: "Today · 09:00", count: 2, status: "Ready for pickup" },
  { id: "#MS-1047", customer: "Daniel Ko", box: "Lunch comfort box", time: "Today · 14:30", count: 1, status: "Confirmed" },
  { id: "#MS-1042", customer: "Mila Petrov", box: "End-of-day sweet treats", time: "Yesterday · 19:00", count: 1, status: "Collected" },
];

export const HISTORY = [
  { id: "1", title: "Reservation collected", description: "#MS-1042 · Mila Petrov", time: "Yesterday, 19:18", tone: "success" },
  { id: "2", title: "Box quantity updated", description: "Morning bakery rescue · 10 → 8 available", time: "Yesterday, 16:42", tone: "neutral" },
  { id: "3", title: "Product marked out of stock", description: "Cinnamon roll", time: "Mon, 12:05", tone: "warning" },
  { id: "4", title: "New reservation received", description: "#MS-1037 · Lunch comfort box", time: "Mon, 11:32", tone: "success" },
];

export function PageHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: string }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action ? <Pressable style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]} onPress={() => Alert.alert(action, "This action is ready to connect to your vendor API.")}><Text style={styles.headerActionText}>＋</Text></Pressable> : null}
    </View>
  );
}

export function StatCard({ label, value, caption, tone = "green" }: { label: string; value: string; caption: string; tone?: "green" | "amber" | "dark" }) {
  return <View style={[styles.statCard, tone === "amber" && styles.statAmber, tone === "dark" && styles.statDark]}><Text style={[styles.statLabel, tone === "dark" && styles.lightText]}>{label}</Text><Text style={[styles.statValue, tone === "dark" && styles.lightText]}>{value}</Text><Text style={[styles.statCaption, tone === "dark" && styles.lightMuted]}>{caption}</Text></View>;
}

export function StatusPill({ status }: { status: string }) {
  const positive = status === "In stock" || status === "Confirmed" || status === "Collected" || status === "Ready for pickup";
  const warning = status === "Low stock";
  return <View style={[styles.pill, positive ? styles.pillPositive : warning ? styles.pillWarning : styles.pillNeutral]}><Text style={[styles.pillText, positive ? styles.pillPositiveText : warning ? styles.pillWarningText : styles.pillNeutralText]}>{status}</Text></View>;
}

export function ActionButton({ label, onPress, secondary = false }: { label: string; onPress?: () => void; secondary?: boolean }) {
  return <Pressable onPress={onPress ?? (() => Alert.alert(label, "This action is ready to connect to your vendor API."))} style={({ pressed }) => [styles.actionButton, secondary && styles.actionButtonSecondary, pressed && styles.pressed]}><Text style={[styles.actionButtonText, secondary && styles.actionButtonTextSecondary]}>{label}</Text></Pressable>;
}

export const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 },
  headerText: { flex: 1, paddingRight: 14 },
  eyebrow: { color: GREEN, fontSize: 12, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 6 },
  title: { color: INK, fontSize: 30, lineHeight: 35, fontWeight: "800" },
  subtitle: { color: MUTED, fontSize: 14, lineHeight: 20, marginTop: 6 },
  headerAction: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: GREEN },
  headerActionText: { color: "#fff", fontSize: 28, lineHeight: 30, fontWeight: "400" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.97 }] },
  statCard: { flex: 1, minHeight: 108, padding: 14, borderRadius: 18, backgroundColor: "#EAF5EE", marginRight: 9 },
  statAmber: { backgroundColor: "#FFF4E6" },
  statDark: { backgroundColor: INK },
  statLabel: { color: MUTED, fontSize: 12, fontWeight: "700" },
  statValue: { color: INK, fontSize: 25, fontWeight: "800", marginTop: 8 },
  statCaption: { color: MUTED, fontSize: 11, marginTop: 3 },
  lightText: { color: "#fff" },
  lightMuted: { color: "#B9C9BF" },
  pill: { alignSelf: "flex-start", paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 },
  pillPositive: { backgroundColor: "#E4F5EA" },
  pillWarning: { backgroundColor: "#FFF0D8" },
  pillNeutral: { backgroundColor: "#F0F2F1" },
  pillText: { fontSize: 11, fontWeight: "800" },
  pillPositiveText: { color: "#287B4D" },
  pillWarningText: { color: "#A76A1B" },
  pillNeutralText: { color: MUTED },
  actionButton: { alignItems: "center", justifyContent: "center", backgroundColor: GREEN, minHeight: 44, paddingHorizontal: 16, borderRadius: 13 },
  actionButtonSecondary: { backgroundColor: "#EDF3EF" },
  actionButtonText: { color: "#fff", fontWeight: "800", fontSize: 13 },
  actionButtonTextSecondary: { color: GREEN },
});
