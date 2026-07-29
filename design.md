# FoodRescue Mobile App - Design Document

## Overview
FoodRescue is a mobile app that connects restaurants with customers to reduce food waste. Restaurants can sell leftover food as discounted items and offer surprise boxes containing daily random food articles.

---

## Screen List

### 1. **Feed Screen** (Home Tab)
- **Purpose**: Browse available discounted items and surprise boxes
- **Content**:
  - Search/filter bar (by restaurant, cuisine type, discount level)
  - Horizontal carousel of featured items
  - Vertical list of available items and boxes
  - Item cards showing: restaurant name, item photo, original price, discount price, time remaining, distance
  - Surprise box cards showing: restaurant name, box photo, price, contents preview, time remaining
- **Actions**: Tap item → Detail screen, Add to cart, Save favorite

### 2. **Item Detail Screen**
- **Purpose**: View detailed information about a specific discounted item
- **Content**:
  - Large item photo
  - Restaurant name and rating
  - Item name and description
  - Original price, discount price, savings percentage
  - Quantity available
  - Pickup time window
  - Restaurant location and distance
  - Customer reviews (if available)
- **Actions**: Add to cart, Save to favorites, Share, View restaurant profile

### 3. **Surprise Box Detail Screen**
- **Purpose**: View details about a surprise box
- **Content**:
  - Box photo/illustration
  - Restaurant name
  - Box price
  - Contents description (e.g., "Random assorted pastries", "Today's leftover lunch items")
  - Pickup time window
  - Restaurant location
  - Customer reviews
- **Actions**: Add to cart, Save to favorites, Share, View restaurant profile

### 4. **Cart Screen** (Tab)
- **Purpose**: Review and manage items before checkout
- **Content**:
  - List of items in cart with quantities
  - Item prices and total discount savings
  - Estimated pickup time
  - Checkout button
- **Actions**: Increase/decrease quantity, Remove item, Proceed to checkout

### 5. **Checkout Screen**
- **Purpose**: Complete the purchase
- **Content**:
  - Order summary
  - Pickup location and time
  - Payment method selection
  - Total price breakdown
- **Actions**: Select payment method, Confirm order

### 6. **Orders Screen** (Tab)
- **Purpose**: View order history and active orders
- **Content**:
  - Active orders section (with status: confirmed, ready for pickup, completed)
  - Order history section
  - Each order showing: restaurant, items, order date, pickup time, status
- **Actions**: View order details, Rate restaurant/items, Reorder

### 7. **Favorites Screen** (Tab)
- **Purpose**: Access saved items and restaurants
- **Content**:
  - Saved items list
  - Saved restaurants list
- **Actions**: Remove from favorites, View item/restaurant, Add to cart

### 8. **Profile Screen** (Tab)
- **Purpose**: Manage user account and preferences
- **Content**:
  - User name and profile photo
  - Email and phone
  - Saved addresses
  - Payment methods
  - Dietary preferences
  - Notification settings
  - About and help
- **Actions**: Edit profile, Manage addresses, Manage payment methods, Logout

---

## Primary User Flows

### Flow 1: Browse and Purchase Discounted Item
1. User opens app → Feed screen
2. User browses items or uses search/filter
3. User taps item → Item Detail screen
4. User reviews details and taps "Add to Cart"
5. User navigates to Cart screen
6. User reviews cart and taps "Checkout"
7. User completes payment
8. Order confirmed with pickup time

### Flow 2: Purchase Surprise Box
1. User opens app → Feed screen
2. User scrolls to surprise boxes section
3. User taps surprise box → Surprise Box Detail screen
4. User reviews details and taps "Add to Cart"
5. User navigates to Cart screen
6. User completes checkout
7. Order confirmed

### Flow 3: View Order Status
1. User navigates to Orders tab
2. User views active orders
3. User can tap order to see details and pickup instructions

---

## Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Primary (CTA, highlights) | Green | #10B981 |
| Background | White | #FFFFFF |
| Surface (cards) | Light Gray | #F3F4F6 |
| Text Primary | Dark Gray | #1F2937 |
| Text Secondary | Medium Gray | #6B7280 |
| Border | Light Gray | #E5E7EB |
| Success | Green | #10B981 |
| Warning | Orange | #F59E0B |
| Error | Red | #EF4444 |

---

## Typography

- **Heading 1** (Screen titles): 28px, Bold, #1F2937
- **Heading 2** (Section titles): 20px, Semibold, #1F2937
- **Body** (Regular text): 16px, Regular, #1F2937
- **Caption** (Secondary text): 14px, Regular, #6B7280
- **Small** (Metadata): 12px, Regular, #9CA3AF

---

## Key Interactions

- **Item Cards**: Tap to view details, long-press to add to favorites
- **Add to Cart**: Button with scale feedback (0.97) and haptic feedback
- **Quantity Controls**: +/- buttons with visual feedback
- **Swipe Gestures**: Swipe left on cart items to delete (optional)
- **Pull-to-Refresh**: Refresh feed to see new items

---

## Navigation Structure (Expo Router)

```
app/
  (tabs)/
    _layout.tsx          ← Tab bar with 5 tabs
    index.tsx            ← Feed screen
    cart.tsx             ← Cart screen
    orders.tsx           ← Orders screen
    favorites.tsx        ← Favorites screen
    profile.tsx          ← Profile screen
  item/
    [id].tsx             ← Item detail (dynamic route)
  box/
    [id].tsx             ← Surprise box detail (dynamic route)
  checkout/
    index.tsx            ← Checkout screen
```

---

## Notes

- All screens use `ScreenContainer` for proper SafeArea handling
- NativeWind (Tailwind CSS) for styling
- Use `FlatList` for scrollable lists (never `ScrollView` with `.map()`)
- Haptic feedback on primary actions (button taps, successful actions)
- Dark mode support via theme provider
