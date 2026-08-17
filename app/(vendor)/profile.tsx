import React from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { signOutFromDevice } from "@/lib/sign-out";
import { ActionButton, GREEN, INK, MUTED, PageHeader, styles as shared } from "@/components/vendor-dashboard";

const MENU = [{ label: "Business information", detail: "Address, phone and opening hours", icon: "⌂" }, { label: "Pickup preferences", detail: "Manage your pickup windows", icon: "◷" }, { label: "Notifications", detail: "Reservations and stock alerts", icon: "·" }, { label: "Team access", detail: "Invite staff to manage the shop", icon: "+" }];

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    const error = await signOutFromDevice();
    if (error) {
      Alert.alert("Sign out failed", error.message);
      return;
    }
    router.replace("/(auth)/login");
  };

  return <ScreenContainer><ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
    <PageHeader eyebrow="Your business" title="Profile" subtitle="Keep your vendor details polished and current." />
    <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>G</Text></View><View style={styles.profileInfo}><Text style={styles.businessName}>Green Table Bakery</Text><Text style={styles.businessType}>Bakery · Local vendor</Text><Text style={styles.location}>▾ 14 Market Street, Skopje</Text></View><Pressable onPress={() => Alert.alert("Edit profile", "Your business profile editor is ready to connect.")} style={({ pressed }) => [styles.editButton, pressed && shared.pressed]}><Text style={styles.editText}>Edit</Text></Pressable></View>
    <View style={styles.statusCard}><View><Text style={styles.statusKicker}>SHOP STATUS</Text><Text style={styles.statusTitle}>Open for pickups</Text><Text style={styles.statusDescription}>Your next window starts at 08:00</Text></View><View style={styles.statusToggle}><View style={styles.statusDot} /></View></View>
    <Text style={styles.sectionTitle}>Workspace settings</Text>
    <View style={styles.menu}>{MENU.map((item) => <Pressable key={item.label} onPress={() => Alert.alert(item.label, item.detail)} style={({ pressed }) => [styles.menuItem, pressed && shared.pressed]}><View style={styles.menuIcon}><Text style={styles.menuIconText}>{item.icon}</Text></View><View style={styles.menuBody}><Text style={styles.menuLabel}>{item.label}</Text><Text style={styles.menuDetail}>{item.detail}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}</View>
    <ActionButton label="Sign out" secondary onPress={() => Alert.alert("Sign out", "Are you sure you want to sign out?", [{ text: "Cancel", style: "cancel" }, { text: "Sign out", style: "destructive", onPress: handleSignOut }])} />
    <Text style={styles.version}>MySupply Vendor · v1.0.0</Text>
  </ScrollView></ScreenContainer>;
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 34 },
  profileCard: { flexDirection: "row", alignItems: "center", padding: 16, borderRadius: 20, borderWidth: 1, borderColor: "#E8EFEB", backgroundColor: "#fff", marginBottom: 14 },
  avatar: { width: 56, height: 56, borderRadius: 18, backgroundColor: "#EAF5EE", alignItems: "center", justifyContent: "center", marginRight: 12 },
  avatarText: { color: GREEN, fontSize: 25, fontWeight: "900" },
  profileInfo: { flex: 1 },
  businessName: { color: INK, fontSize: 16, fontWeight: "800" },
  businessType: { color: MUTED, fontSize: 12, marginTop: 4 },
  location: { color: MUTED, fontSize: 11, marginTop: 8 },
  editButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9, backgroundColor: "#EDF3EF" },
  editText: { color: GREEN, fontSize: 12, fontWeight: "800" },
  statusCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 17, borderRadius: 20, backgroundColor: INK, marginBottom: 26 },
  statusKicker: { color: "#8FD2A7", fontSize: 10, fontWeight: "900", letterSpacing: 1.1 },
  statusTitle: { color: "#fff", fontSize: 17, fontWeight: "800", marginTop: 7 },
  statusDescription: { color: "#B9C9BF", fontSize: 12, marginTop: 4 },
  statusToggle: { width: 47, height: 28, borderRadius: 20, backgroundColor: "#5BB77D", justifyContent: "center", alignItems: "flex-end", paddingHorizontal: 4 },
  statusDot: { width: 20, height: 20, borderRadius: 20, backgroundColor: "#fff" },
  sectionTitle: { color: INK, fontSize: 19, fontWeight: "800", marginBottom: 10 },
  menu: { borderTopWidth: 1, borderTopColor: "#EDF1EE", marginBottom: 18 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "#EDF1EE" },
  menuIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#F0F5F1", alignItems: "center", justifyContent: "center", marginRight: 11 },
  menuIconText: { color: GREEN, fontSize: 20, fontWeight: "800" },
  menuBody: { flex: 1 },
  menuLabel: { color: INK, fontSize: 14, fontWeight: "800" },
  menuDetail: { color: MUTED, fontSize: 11, marginTop: 4 },
  chevron: { color: "#A4B0A9", fontSize: 25, fontWeight: "300", paddingLeft: 8 },
  version: { color: "#A4B0A9", textAlign: "center", fontSize: 11, marginTop: 17 },
});
