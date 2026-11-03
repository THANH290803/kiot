import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { Product } from "../types";
import { formatPrice } from "../utils/format";

type ProductCardProps = {
  product: Product;
  isFavorite: boolean;
  compact?: boolean;
  onPress: () => void;
  onWishlistToggle: () => void;
  onAddToCart: () => void;
};

export function ProductCard({
  product,
  isFavorite,
  compact,
  onPress,
  onWishlistToggle,
  onAddToCart,
}: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Pressable style={[styles.productCard, compact && styles.compactCard]} onPress={onPress}>
      <View style={styles.productImageWrap}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        {discount > 0 && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleText}>-{discount}%</Text>
          </View>
        )}
        <Pressable style={styles.favoriteButton} onPress={onWishlistToggle}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? colors.sale : colors.foreground}
          />
        </Pressable>
      </View>

      <View style={styles.productBody}>
        <Text numberOfLines={2} style={styles.productName}>
          {product.name}
        </Text>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.warning} />
          <Text style={styles.smallRating}>{product.rating}</Text>
          <Text style={styles.reviewText}>({product.reviews})</Text>
        </View>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        <Text style={styles.productOriginalPrice}>{formatPrice(product.originalPrice)}</Text>
        <Pressable style={styles.addButton} onPress={onAddToCart}>
          <Ionicons name="bag-add-outline" size={16} color={colors.surface} />
          <Text style={styles.addButtonText}>Giỏ hàng</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  productCard: {
    width: "47.8%",
    minWidth: 0,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 14,
  },
  compactCard: {
    width: "48%",
  },
  productImageWrap: {
    position: "relative",
    aspectRatio: 1,
    backgroundColor: colors.border,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  saleBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: colors.sale,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  saleText: {
    color: colors.surface,
    fontWeight: "800",
    fontSize: 11,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  productBody: {
    padding: 10,
    minWidth: 0,
  },
  productName: {
    minHeight: 38,
    color: colors.foreground,
    fontWeight: "700",
    lineHeight: 19,
  },
  ratingRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  smallRating: {
    color: colors.foreground,
    fontSize: 12,
    fontWeight: "700",
  },
  reviewText: {
    color: colors.muted,
    fontSize: 12,
  },
  productPrice: {
    marginTop: 8,
    color: colors.primary,
    fontWeight: "900",
    fontSize: 15,
  },
  productOriginalPrice: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  addButton: {
    marginTop: 10,
    height: 38,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 8,
  },
  addButtonText: {
    color: colors.surface,
    fontWeight: "800",
  },
});
