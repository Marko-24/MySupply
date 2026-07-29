import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function OrdersScreen() {
  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Orders</Text>
            <Text className="text-sm text-muted mt-1">Your order history</Text>
          </View>

          {/* Empty State */}
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-5xl">📋</Text>
            <Text className="text-lg font-semibold text-foreground">No orders yet</Text>
            <Text className="text-sm text-muted text-center">
              Your orders will appear here once you make a purchase
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
