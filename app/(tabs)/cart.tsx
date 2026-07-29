import { ScrollView, Text, View, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function CartScreen() {
  const colors = useColors();

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Cart</Text>
            <Text className="text-sm text-muted mt-1">Your items</Text>
          </View>

          {/* Empty State */}
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-5xl">🛒</Text>
            <Text className="text-lg font-semibold text-foreground">Your cart is empty</Text>
            <Text className="text-sm text-muted text-center">
              Browse the Feed to add items to your cart
            </Text>
          </View>

          {/* Checkout Button */}
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
            <Text className="text-center font-semibold text-white">Proceed to Checkout</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
