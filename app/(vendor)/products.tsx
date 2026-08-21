import React, { useState } from "react";
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { ActionButton, PRIMARY, INK, MUTED, BORDER, SURFACE, PageHeader } from "@/components/vendor-dashboard";

// Стандардни генерални шаблони (Too Good To Go концепт)
const SURPRISE_TEMPLATES = [
  {
    id: "1",
    title: "Пекарски Surprise Box",
    category: "Пекара & Печива",
    estimatedValue: "600 ден.",
    price: "200 ден.",
    icon: "🥐",
    pickupTime: "18:00 - 20:00",
  },
  {
    id: "2",
    title: "Готвена храна Surprise Box",
    category: "Ресторан",
    estimatedValue: "900 ден.",
    price: "300 ден.",
    icon: "🍲",
    pickupTime: "20:30 - 22:00",
  },
  {
    id: "3",
    title: "Десерт & Слаткарница Box",
    category: "Слатки & Колачи",
    estimatedValue: "750 ден.",
    price: "250 ден.",
    icon: "🍰",
    pickupTime: "19:00 - 21:00",
  },
  {
    id: "4",
    title: "Свежи производи Box",
    category: "Овошје, Зеленчук & Млечно",
    estimatedValue: "800 ден.",
    price: "280 ден.",
    icon: "🧺",
    pickupTime: "17:00 - 19:00",
  },
];

export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Сите");

  return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <PageHeader
              eyebrow="Брзо објавување"
              title="Шаблони за Пакети"
              subtitle="Изберете категорија и веднаш пуштете Surprise Box за денес."
              onAction={() => Alert.alert("Нов шаблон", "Креирајте нов генерален тип на Surprise Box.")}
          />

          {/* Минималистичка листа на генерални типови пакети */}
          <FlatList
              data={SURPRISE_TEMPLATES}
              scrollEnabled={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                  <View style={styles.card}>
                    <View style={styles.iconWrapper}>
                      <Text style={styles.iconText}>{item.icon}</Text>
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardCategory}>{item.category}</Text>

                      <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>
                          Вредност: <Text style={styles.oldPrice}>{item.estimatedValue}</Text>
                        </Text>
                        <Text style={styles.finalPrice}>{item.price}</Text>
                      </View>

                      <Text style={styles.pickupText}>🕒 Подигање: {item.pickupTime}</Text>
                    </View>

                    <Pressable
                        onPress={() =>
                            Alert.alert(
                                "Пушти во продажба",
                                `Колку "${item.title}" имате за денес?`,
                                [
                                  { text: "Откажи", style: "cancel" },
                                  {
                                    text: "Пушти 3 пакети",
                                    onPress: () => Alert.alert("Успешно!", "Пакетите се поставени во активни понуди."),
                                  },
                                ]
                            )
                        }
                        style={({ pressed }) => [styles.activateBtn, pressed && { opacity: 0.8 }]}
                    >
                      <Text style={styles.activateBtnText}>+ Пушти</Text>
                    </Pressable>
                  </View>
              )}
          />

          <ActionButton
              label="+ Креирај нов тип Surprise Box"
              secondary
              onPress={() => Alert.alert("Креирај тип", "Внесете категорија, цена и време за подигање.")}
          />
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 100 },

  list: { gap: 14, marginBottom: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: SURFACE,
    gap: 12,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 26 },

  cardContent: { flex: 1, gap: 2 },
  cardTitle: { color: INK, fontSize: 15, fontWeight: "800" },
  cardCategory: { color: MUTED, fontSize: 12, fontWeight: "600" },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  priceLabel: { color: MUTED, fontSize: 11, fontWeight: "600" },
  oldPrice: { textDecorationLine: "line-through", color: MUTED },
  finalPrice: { color: PRIMARY, fontSize: 14, fontWeight: "800" },

  pickupText: { color: INK, fontSize: 11, fontWeight: "700", marginTop: 2 },

  activateBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "center",
  },
  activateBtnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});