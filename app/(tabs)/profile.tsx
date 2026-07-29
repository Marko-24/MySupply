import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function ProfileScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Profile</Text>
            <Text className="text-sm text-muted mt-1">Manage your account</Text>
          </View>

          {/* Profile Section */}
          <View className="bg-surface rounded-lg p-4 gap-4">
            <View className="items-center gap-3">
              <Text className="text-5xl">👤</Text>
              <Text className="text-lg font-semibold text-foreground">Sign in to your account</Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderRadius: 8,
                  transform: [{ scale: pressed ? 0.97 : 1 }],
                },
              ]}
            >
              <Text className="text-center font-semibold text-white">Sign In</Text>
            </Pressable>
          </View>

          {/* Menu Items */}
          <View className="gap-2">
            {[
              { label: "Edit Profile", icon: "✏️" },
              { label: "Addresses", icon: "📍" },
              { label: "Payment Methods", icon: "💳" },
              { label: "Notifications", icon: "🔔" },
              { label: "Help & Support", icon: "❓" },
            ].map((item, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed ? colors.border : "transparent",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  },
                ]}
              >
                <Text className="text-xl">{item.icon}</Text>
                <Text className="flex-1 text-foreground font-medium">{item.label}</Text>
                <Text className="text-muted">›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
