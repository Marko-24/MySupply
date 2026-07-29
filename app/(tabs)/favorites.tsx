import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";

export default function FavoritesScreen() {
  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View>
            <Text className="text-3xl font-bold text-foreground">Favorites</Text>
            <Text className="text-sm text-muted mt-1">Your saved items and restaurants</Text>
          </View>

          {/* Empty State */}
          <View className="flex-1 items-center justify-center gap-4">
            <Text className="text-5xl">❤️</Text>
            <Text className="text-lg font-semibold text-foreground">No favorites yet</Text>
            <Text className="text-sm text-muted text-center">
              Save items and restaurants to view them here
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
