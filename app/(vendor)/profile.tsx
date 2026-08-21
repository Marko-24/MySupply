import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { signOutFromDevice } from "@/lib/sign-out";
import { ActionButton, PageHeader, styles as shared } from "@/components/vendor-dashboard";

// 3D & Стаклени Награди
const BADGES = [
  { id: "1", title: "Zero Waste", desc: "100+ оброци", icon: "🌱", unlocked: true },
  { id: "2", title: "Fast Verification", desc: "Брз PIN", icon: "⚡", unlocked: true },
  { id: "3", title: "5 Star Hero", desc: "Рејтинг 4.9★", icon: "⭐", unlocked: true },
  { id: "4", title: "CO₂ Shield", desc: "500+ кг спречено", icon: "🛡️", unlocked: false },
];

const MENU = [
  { label: "Бизнис информации", detail: "Адреса, телефон и работно време", icon: "🏢" },
  { label: "Интервали за подигање", detail: "Управувајте со временските прозорци", icon: "⏱️" },
  { label: "Известувања & Сигнали", detail: "Звучни и push известувања", icon: "🔔" },
  { label: "Тимски Пристап", detail: "Поканете вработени за управување", icon: "🔑" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleSignOut = async () => {
    const error = await signOutFromDevice();
    if (error) {
      Alert.alert("Грешка при одјава", error.message);
      return;
    }
    router.replace("/(auth)/login");
  };

  return (
      <ScreenContainer style={{ backgroundColor: "#F2F4F7" }}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <PageHeader
              eyebrow="Бизнис Профил"
              title="Бизнис Профил"
              subtitle="Вашиот зелен отисок, награди и дигитални поставки."
          />

          {/* 3D Glass Profile Header */}
          <View style={styles.glassProfileCard}>
            <View style={styles.avatar3D}>
              <Text style={styles.avatarText}>M</Text>
              <View style={styles.onlineGlow} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameBadgeRow}>
                <Text style={styles.businessName}>MySupply Локација</Text>
              </View>
              <Text style={styles.businessType}>Ресторан & Пекара · Скопје</Text>

              <View style={styles.glassPill}>
                <Text style={styles.glassPillText}>✨ Златен Партнер</Text>
              </View>
            </View>
          </View>

          {/* 3D Glass Impact Banner */}
          <View style={styles.glassImpactCard}>
            <View style={styles.impactHeader}>
              <Text style={styles.impactTitle}>🌍 Вашето Еколошко Влијание</Text>
              <Text style={styles.impactBadge}>Топ 5% овој месец</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.glassStatBox}>
                <Text style={styles.statIcon}>📦</Text>
                <Text style={styles.statValue}>142</Text>
                <Text style={styles.statLabel}>Спасени</Text>
              </View>

              <View style={styles.glassStatBox}>
                <Text style={styles.statIcon}>🍃</Text>
                <Text style={styles.statValue}>355<Text style={{ fontSize: 12 }}>кг</Text></Text>
                <Text style={styles.statLabel}>CO₂ Спречен</Text>
              </View>

              <View style={styles.glassStatBox}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statValue}>4.9</Text>
                <Text style={styles.statLabel}>Оценка</Text>
              </View>
            </View>

            {/* iOS Style Progress Bar */}
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Награда: Бесплатна Push Промоција</Text>
                <Text style={styles.progressSub}>142 / 200</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: "71%" }]} />
              </View>
            </View>
          </View>

          {/* 3D Badges Carousel */}
          <Text style={styles.sectionTitle}>Бизнис Награди & Значки</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgesScroll} contentContainerStyle={styles.badgesRow}>
            {BADGES.map((badge) => (
                <Pressable
                    key={badge.id}
                    onPress={() => Alert.alert(badge.title, `${badge.desc} ${badge.unlocked ? "(Отклучено ✓)" : "(Заклучено 🔒)"}`)}
                    style={({ pressed }) => [
                      styles.badgeGlassCard,
                      !badge.unlocked && styles.badgeLocked,
                      pressed && { transform: [{ scale: 0.96 }] }
                    ]}
                >
                  <View style={styles.badge3DIconWrapper}>
                    <Text style={styles.badge3DIcon}>{badge.icon}</Text>
                  </View>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDesc}>{badge.desc}</Text>
                </Pressable>
            ))}
          </ScrollView>

          {/* Dynamic Status Switch Card */}
          <View style={styles.glassStatusCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusLabel}>СТАТУС НА ЛОКАЦИЈАТА</Text>
              <Text style={styles.statusTitle}>{isOpen ? "Отворено за подигање" : "Затворено"}</Text>
              <Text style={styles.statusSub}>{isOpen ? "Примате нови нарачки за денес" : "Паузирано"}</Text>
            </View>

            <Pressable
                onPress={() => setIsOpen(!isOpen)}
                style={[styles.iosToggle, !isOpen && styles.iosToggleOff]}
            >
              <View style={[styles.iosToggleKnob, !isOpen && styles.iosToggleKnobOff]} />
            </Pressable>
          </View>

          {/* Glass Settings Menu */}
          <Text style={styles.sectionTitle}>Поставки</Text>
          <View style={styles.glassMenuContainer}>
            {MENU.map((item, index) => (
                <Pressable
                    key={item.label}
                    onPress={() => Alert.alert(item.label, item.detail)}
                    style={({ pressed }) => [
                      styles.glassMenuItem,
                      index === MENU.length - 1 && { borderBottomWidth: 0 },
                      pressed && styles.menuItemPressed
                    ]}
                >
                  <View style={styles.menuIconGlass}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                  </View>
                  <View style={styles.menuTextGroup}>
                    <Text style={styles.menuTitle}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.detail}</Text>
                  </View>
                  <Text style={styles.iosChevron}>›</Text>
                </Pressable>
            ))}
          </View>

          {/* Sign Out Button */}
          <ActionButton
              label="Одјави се"
              secondary
              onPress={() =>
                  Alert.alert("Одјава", "Дали сте сигурни дека сакате да се одјавите?", [
                    { text: "Откажи", style: "cancel" },
                    { text: "Одјави се", style: "destructive", onPress: handleSignOut },
                  ])
              }
          />

          <Text style={styles.versionText}>MySupply Vendor · iOS Edition v1.0.0</Text>
        </ScrollView>
      </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 110 },

  // Glassmorphic Profile Card
  glassProfileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
  },
  avatar3D: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    position: "relative",
  },
  avatarText: { color: "#FFFFFF", fontSize: 26, fontWeight: "900" },
  onlineGlow: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#34D399",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  profileInfo: { flex: 1, gap: 2 },
  nameBadgeRow: { flexDirection: "row", alignItems: "center" },
  businessName: { color: "#0F172A", fontSize: 17, fontWeight: "800" },
  businessType: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  glassPill: {
    alignSelf: "flex-start",
    marginTop: 6,
    backgroundColor: "rgba(245, 158, 11, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.25)",
  },
  glassPillText: { color: "#D97706", fontSize: 11, fontWeight: "800" },

  // Glass Impact Banner
  glassImpactCard: {
    padding: 20,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.05,
    shadowRadius: 24,
  },
  impactHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  impactTitle: { color: "#0F172A", fontSize: 15, fontWeight: "800" },
  impactBadge: { color: "#10B981", fontSize: 11, fontWeight: "700", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  glassStatBox: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: { color: "#0F172A", fontSize: 18, fontWeight: "900" },
  statLabel: { color: "#64748B", fontSize: 10, fontWeight: "700", marginTop: 2 },

  // Progress Section
  progressSection: { backgroundColor: "#F1F5F9", padding: 12, borderRadius: 16 },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  progressTitle: { color: "#334155", fontSize: 11, fontWeight: "700" },
  progressSub: { color: "#10B981", fontSize: 11, fontWeight: "800" },
  progressTrack: { height: 7, backgroundColor: "#CBD5E1", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#10B981", borderRadius: 4 },

  sectionTitle: { color: "#0F172A", fontSize: 18, fontWeight: "800", marginBottom: 12 },

  // 3D Badges Carousel
  badgesScroll: { marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 24 },
  badgesRow: { flexDirection: "row", gap: 12 },
  badgeGlassCard: {
    width: 125,
    padding: 14,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
  },
  badgeLocked: { opacity: 0.45 },
  badge3DIconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  badge3DIcon: { fontSize: 24 },
  badgeTitle: { color: "#0F172A", fontSize: 12, fontWeight: "800", textAlign: "center" },
  badgeDesc: { color: "#64748B", fontSize: 10, textAlign: "center", marginTop: 2, fontWeight: "600" },

  // iOS Toggle Card
  glassStatusCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#0F172A",
    marginBottom: 24,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  statusLabel: { color: "#64748B", fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  statusTitle: { color: "#FFFFFF", fontSize: 16, fontWeight: "800", marginTop: 2 },
  statusSub: { color: "#94A3B8", fontSize: 11, marginTop: 2 },

  iosToggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#10B981",
    padding: 2,
    justifyContent: "center",
  },
  iosToggleOff: { backgroundColor: "#334155" },
  iosToggleKnob: { width: 26, height: 26, borderRadius: 13, backgroundColor: "#FFFFFF", alignSelf: "flex-end" },
  iosToggleKnobOff: { alignSelf: "flex-start" },

  // Settings Menu Glass
  glassMenuContainer: {
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 24,
    overflow: "hidden",
  },
  glassMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  menuItemPressed: { backgroundColor: "rgba(0, 0, 0, 0.03)" },
  menuIconGlass: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuTextGroup: { flex: 1 },
  menuTitle: { color: "#0F172A", fontSize: 14, fontWeight: "800" },
  menuSub: { color: "#64748B", fontSize: 11, marginTop: 2 },
  iosChevron: { color: "#94A3B8", fontSize: 20, fontWeight: "300" },

  versionText: { color: "#94A3B8", textAlign: "center", fontSize: 11, marginTop: 16, fontWeight: "600" },
});