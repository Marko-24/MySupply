import { ScrollView, Text, View, Pressable, FlatList, TextInput } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

interface FoodItem {
  id: string;
  restaurant: string;
  name: string;
  originalPrice: number;
  discountPrice: number;
  discount: number;
  timeRemaining: string;
  distance: string;
  category: "item" | "box";
  description?: string;
}

const MOCK_ITEMS: FoodItem[] = [
  {
    id: "1",
    restaurant: "The Pasta House",
    name: "Margherita Pizza",
    originalPrice: 18.99,
    discountPrice: 9.49,
    discount: 50,
    timeRemaining: "2h 30m",
    distance: "0.5 km",
    category: "item",
    description: "Fresh homemade pizza",
  },
  {
    id: "2",
    restaurant: "Green Garden Cafe",
    name: "Surprise Lunch Box",
    originalPrice: 15.0,
    discountPrice: 7.5,
    discount: 50,
    timeRemaining: "1h 45m",
    distance: "1.2 km",
    category: "box",
    description: "Random assorted lunch items",
  },
  {
    id: "3",
    restaurant: "Burger Kingdom",
    name: "Gourmet Burger Combo",
    originalPrice: 16.99,
    discountPrice: 8.49,
    discount: 50,
    timeRemaining: "3h 15m",
    distance: "0.8 km",
    category: "item",
    description: "Burger with fries and drink",
  },
  {
    id: "4",
    restaurant: "Sweet Bakery",
    name: "Surprise Pastry Box",
    originalPrice: 12.0,
    discountPrice: 6.0,
    discount: 50,
    timeRemaining: "1h 20m",
    distance: "0.3 km",
    category: "box",
    description: "Assorted fresh pastries",
  },
  {
    id: "5",
    restaurant: "Sushi Express",
    name: "California Roll Pack",
    originalPrice: 14.99,
    discountPrice: 7.49,
    discount: 50,
    timeRemaining: "2h 00m",
    distance: "1.5 km",
    category: "item",
    description: "Fresh sushi rolls",
  },
];

function FoodItemCard({ item, colors }: { item: FoodItem; colors: any }) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      className="bg-surface rounded-lg overflow-hidden mb-4 border border-border"
    >
      {/* Image Placeholder */}
      <View
        className="w-full h-40 bg-primary items-center justify-center"
        style={{ backgroundColor: item.category === "box" ? "#8B5CF6" : colors.primary }}
      >
        <Text className="text-4xl">{item.category === "box" ? "📦" : "🍽️"}</Text>
      </View>

      {/* Content */}
      <View className="p-4 gap-3">
        {/* Restaurant Name */}
        <Text className="text-xs text-muted font-medium uppercase">{item.restaurant}</Text>

        {/* Item Name */}
        <Text className="text-lg font-bold text-foreground">{item.name}</Text>

        {/* Description */}
        {item.description && (
          <Text className="text-sm text-muted">{item.description}</Text>
        )}

        {/* Price Section */}
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-primary">${item.discountPrice.toFixed(2)}</Text>
          <Text className="text-sm text-muted line-through">${item.originalPrice.toFixed(2)}</Text>
          <View className="bg-error px-2 py-1 rounded">
            <Text className="text-xs font-bold text-white">{item.discount}% OFF</Text>
          </View>
        </View>

        {/* Meta Info */}
        <View className="flex-row justify-between pt-2 border-t border-border">
          <View className="flex-row items-center gap-1">
            <Text className="text-lg">⏱️</Text>
            <Text className="text-xs text-muted">{item.timeRemaining}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-lg">📍</Text>
            <Text className="text-xs text-muted">{item.distance}</Text>
          </View>
        </View>

        {/* Add to Cart Button */}
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: colors.primary,
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 6,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            },
          ]}
        >
          <Text className="text-center font-semibold text-white">Add to Cart</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function FeedScreen() {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = MOCK_ITEMS.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScreenContainer className="p-4">
      <View className="flex-1">
        {/* Header */}
        <View className="mb-4 gap-2">
          <Text className="text-3xl font-bold text-foreground">FoodRescue</Text>
          <Text className="text-sm text-muted">Save food, save money</Text>
        </View>

        {/* Search Bar */}
        <View className="mb-6 flex-row items-center gap-2">
          <View className="flex-1 bg-surface rounded-lg px-3 py-2 border border-border flex-row items-center gap-2">
            <Text className="text-lg">🔍</Text>
            <TextInput
              placeholder="Search items or restaurants..."
              placeholderTextColor={colors.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground"
            />
          </View>
          <Pressable
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 6,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <Text className="text-lg">⚙️</Text>
          </Pressable>
        </View>

        {/* Items List */}
        {filteredItems.length > 0 ? (
          <FlatList
            data={filteredItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <FoodItemCard item={item} colors={colors} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="items-center justify-center py-8 gap-2">
            <Text className="text-4xl">🔍</Text>
            <Text className="text-lg font-semibold text-foreground">No items found</Text>
            <Text className="text-sm text-muted">Try a different search</Text>
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}
