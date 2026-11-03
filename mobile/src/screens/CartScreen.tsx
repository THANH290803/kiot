import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ScreenTitle } from "../components/ScreenTitle";
import { StickyActionBar } from "../components/StickyActionBar";
import { colors } from "../theme/colors";
import { CartItem } from "../types";
import { formatPrice } from "../utils/format";

type CartScreenProps = {
  cart: CartItem[];
  total: number;
  onQuantityChange: (item: CartItem, nextQuantity: number) => void;
  onShopPress: () => void;
  onCheckoutPress: () => void;
};

export function CartScreen({
  cart,
  total,
  onQuantityChange,
  onShopPress,
  onCheckoutPress,
}: CartScreenProps) {
  if (cart.length === 0) {
    return (
      <EmptyState
        icon="bag-outline"
        title="Giỏ hàng đang trống"
        text="Thêm sản phẩm yêu thích và quay lại thanh toán khi sẵn sàng."
        action="Tiếp tục mua sắm"
        onAction={onShopPress}
      />
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cartContent}>
        <ScreenTitle title="Giỏ hàng" subtitle={`${cart.length} sản phẩm trong giỏ`} />
        {cart.map((item) => (
          <View key={`${item.product.id}-${item.color}-${item.size}`} style={styles.cartItem}>
            <Image source={{ uri: item.product.image }} style={styles.cartImage} />
            <View style={styles.cartInfo}>
              <Text numberOfLines={2} style={styles.cartName}>
                {item.product.name}
              </Text>
              <Text style={styles.cartMeta}>
                {item.color} | Size {item.size}
              </Text>
              <Text style={styles.cartPrice}>{formatPrice(item.product.price)}</Text>
            </View>
            <View style={styles.cartActions}>
              <Pressable onPress={() => onQuantityChange(item, 0)}>
                <Ionicons name="trash-outline" size={20} color={colors.sale} />
              </Pressable>
              <View style={styles.smallStepper}>
                <Pressable onPress={() => onQuantityChange(item, item.quantity - 1)}>
                  <Text style={styles.smallStepperText}>-</Text>
                </Pressable>
                <Text style={styles.smallQuantity}>{item.quantity}</Text>
                <Pressable onPress={() => onQuantityChange(item, item.quantity + 1)}>
                  <Text style={styles.smallStepperText}>+</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.discountBox}>
          <Text style={styles.discountTitle}>Mã giảm giá</Text>
          <View style={styles.discountInputRow}>
            <TextInput placeholder="Nhập mã" placeholderTextColor={colors.muted} style={styles.discountInput} />
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Áp dụng</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <StickyActionBar label="Tổng cộng" value={formatPrice(total)} action="Thanh toán" onPress={onCheckoutPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  cartContent: {
    padding: 16,
    paddingBottom: 120,
  },
  cartItem: {
    minHeight: 124,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    padding: 10,
    marginBottom: 12,
    gap: 10,
  },
  cartImage: {
    width: 92,
    height: 102,
    borderRadius: 8,
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    color: colors.foreground,
    fontWeight: "800",
    lineHeight: 20,
  },
  cartMeta: {
    color: colors.muted,
    marginTop: 4,
    fontSize: 12,
  },
  cartPrice: {
    color: colors.primary,
    fontWeight: "900",
    marginTop: 8,
  },
  cartActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  smallStepper: {
    width: 92,
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  smallStepperText: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
  smallQuantity: {
    color: colors.foreground,
    fontWeight: "800",
  },
  discountBox: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  discountTitle: {
    color: colors.foreground,
    fontWeight: "900",
    marginBottom: 10,
  },
  discountInputRow: {
    flexDirection: "row",
    gap: 8,
  },
  discountInput: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    color: colors.foreground,
  },
  secondaryButton: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: "900",
  },
});
