import React from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

// Нежна светла палета
export const PRIMARY = "#10B981"; // Нежно зелена
export const PRIMARY_LIGHT = "#ECFDF5"; // Бледа зелена позадина
export const INK = "#1F2937"; // Мек карбон
export const MUTED = "#9CA3AF"; // Сив текст
export const BORDER = "#F3F4F6"; // Светла рамка
export const SURFACE = "#FFFFFF"; // Бела позадина
export const AMBER = "#F59E0B"; // Портокалова/Килибарна
export const AMBER_LIGHT = "#FEF3C7"; // Бледа портокалова

// Пакети (Boxes) со слики и преведени детали
export const BOXES = [
  {
    id: "1",
    name: "Утрински пекарски пакет",
    detail: "Разни свежи кифлички и домашен леб",
    pickup: "08:00–10:00",
    price: "400 ден.",
    remaining: 8,
    active: true,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80",
  },
  {
    id: "2",
    name: "Ручек топлa кутија",
    detail: "Дневен готвен ручек по избор на шефот",
    pickup: "14:00–16:00",
    price: "550 ден.",
    remaining: 4,
    active: true,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
  },
  {
    id: "3",
    name: "Вечерни благи десерти",
    detail: "Торти, колачи и сезонски десерти",
    pickup: "18:30–20:00",
    price: "300 ден.",
    remaining: 0,
    active: false,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80",
  },
];

// Продукти
export const PRODUCTS = [
  { id: "1", name: "Домашен леб со квасец", category: "Пекара", stock: 22, price: "260 ден.", status: "На залиха", image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&q=80" },
  { id: "2", name: "Зеленчукова чорба", category: "Готвена храна", stock: 9, price: "340 ден.", status: "При крај", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80" },
  { id: "3", name: "Ролнички со цимет", category: "Пекара", stock: 0, price: "190 ден.", status: "Нема залиха", image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80" },
  { id: "4", name: "Домашна гранола", category: "Закуски", stock: 16, price: "480 ден.", status: "На залиха", image: "https://images.unsplash.com/photo-1517093725432-a9a753314667?w=500&q=80" },
];

// Резервации
export const RESERVATIONS = [
  { id: "#MS-1048", customer: "Софија Мартин", box: "Утрински пекарски пакет", time: "Денес · 09:00", count: 2, status: "Подготвено за подигање" },
  { id: "#MS-1047", customer: "Даниел Костов", box: "Ручек топлa кутија", time: "Денес · 14:30", count: 1, status: "Потврдено" },
  { id: "#MS-1042", customer: "Мила Петрова", box: "Вечерни благи десерти", time: "Вчера · 19:00", count: 1, status: "Подигнато" },
];

// Историја на активности
export const HISTORY = [
  { id: "1", title: "Подигната резервација", description: "#MS-1042 · Мила Петрова", time: "Вчера, 19:18", tone: "success" },
  { id: "2", title: "Променета количина", description: "Утрински пекарски пакет · 10 → 8 достапни", time: "Вчера, 16:42", tone: "neutral" },
  { id: "3", title: "Производот е rasprodat", description: "Ролнички со цимет", time: "Пон, 12:05", tone: "warning" },
  { id: "4", title: "Нова резервација", description: "#MS-1037 · Ручек топлa кутија", time: "Пон, 11:32", tone: "success" },
];

// Заглавие на страницата
export function PageHeader({ eyebrow, title, subtitle, onAction }: { eyebrow?: string; title: string; subtitle?: string; onAction?: () => void }) {
  return (
      <View style={styles.header}>
        <View style={styles.headerText}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onAction ? (
            <Pressable
                style={({ pressed }) => [styles.headerAction, pressed && styles.pressed]}
                onPress={onAction}
            >
              <Text style={styles.headerActionText}>＋</Text>
            </Pressable>
        ) : null}
      </View>
  );
}

// Картичка за статистика
export function StatCard({ label, value, caption, tone = "green" }: { label: string; value: string; caption: string; tone?: "green" | "amber" | "dark" }) {
  return (
      <View style={[styles.statCard, tone === "amber" && styles.statAmber, tone === "dark" && styles.statDark]}>
        <Text style={[styles.statLabel, tone === "dark" && styles.lightText]}>{label}</Text>
        <Text style={[styles.statValue, tone === "dark" && styles.lightText]}>{value}</Text>
        <Text style={[styles.statCaption, tone === "dark" && styles.lightMuted]}>{caption}</Text>
      </View>
  );
}

// Ознака за статус
export function StatusPill({ status }: { status: string }) {
  const positive = status === "На залиха" || status === "Потврдено" || status === "Подигнато" || status === "Подготвено за подигање";
  const warning = status === "При крај";
  return (
      <View style={[styles.pill, positive ? styles.pillPositive : warning ? styles.pillWarning : styles.pillNeutral]}>
        <Text style={[styles.pillText, positive ? styles.pillPositiveText : warning ? styles.pillWarningText : styles.pillNeutralText]}>
          {status}
        </Text>
      </View>
  );
}

// Функционално копче
export function ActionButton({ label, onPress, secondary = false }: { label: string; onPress?: () => void; secondary?: boolean }) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      Alert.alert("Успешно", `Ацијата "${label}" беше успешно извршена.`);
    }
  };

  return (
      <Pressable
          onPress={handlePress}
          style={({ pressed }) => [styles.actionButton, secondary && styles.actionButtonSecondary, pressed && styles.pressed]}
      >
        <Text style={[styles.actionButtonText, secondary && styles.actionButtonTextSecondary]}>{label}</Text>
      </Pressable>
  );
}

// Картичка за производ со слика
export function ProductCard({ item, onEdit }: { item: typeof PRODUCTS[0]; onEdit?: () => void }) {
  return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardPrice}>{item.price}</Text>
          </View>
          <Text style={styles.cardSub}>{item.category} · Залиха: {item.stock}</Text>
          <View style={styles.cardFooter}>
            <StatusPill status={item.status} />
            <ActionButton label="Уреди" secondary onPress={onEdit} />
          </View>
        </View>
      </View>
  );
}

export const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  headerText: { flex: 1, paddingRight: 10 },
  eyebrow: { color: PRIMARY, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 2 },
  title: { color: INK, fontSize: 26, fontWeight: "800" },
  subtitle: { color: MUTED, fontSize: 13, marginTop: 2 },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
  },
  headerActionText: { color: "#FFFFFF", fontSize: 20, fontWeight: "600" },
  pressed: { opacity: 0.75, transform: [{ scale: 0.97 }] },

  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    backgroundColor: PRIMARY_LIGHT,
    marginRight: 8,
  },
  statAmber: { backgroundColor: AMBER_LIGHT },
  statDark: { backgroundColor: INK },
  statLabel: { color: MUTED, fontSize: 11, fontWeight: "600" },
  statValue: { color: INK, fontSize: 22, fontWeight: "800", marginTop: 4 },
  statCaption: { color: MUTED, fontSize: 10, marginTop: 2 },
  lightText: { color: "#FFFFFF" },
  lightMuted: { color: "#9CA3AF" },

  pill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: "flex-start" },
  pillPositive: { backgroundColor: PRIMARY_LIGHT },
  pillWarning: { backgroundColor: AMBER_LIGHT },
  pillNeutral: { backgroundColor: "#F3F4F6" },
  pillText: { fontSize: 11, fontWeight: "700" },
  pillPositiveText: { color: PRIMARY },
  pillWarningText: { color: AMBER },
  pillNeutralText: { color: MUTED },

  actionButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PRIMARY,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  actionButtonSecondary: { backgroundColor: PRIMARY_LIGHT },
  actionButtonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 12 },
  actionButtonTextSecondary: { color: PRIMARY },

  // Стилирање за картичка со слика
  card: {
    flexDirection: "row",
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: BORDER,
  },
  cardImage: { width: 70, height: 70, borderRadius: 12, backgroundColor: "#F3F4F6" },
  cardContent: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: INK, fontSize: 14, fontWeight: "700" },
  cardPrice: { color: PRIMARY, fontSize: 14, fontWeight: "800" },
  cardSub: { color: MUTED, fontSize: 12 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
});