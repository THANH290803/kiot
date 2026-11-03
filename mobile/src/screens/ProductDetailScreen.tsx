import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconButton } from "../components/IconButton";
import { OptionGroup } from "../components/OptionGroup";
import { StickyActionBar } from "../components/StickyActionBar";
import { products } from "../data/catalog";
import { colors } from "../theme/colors";
import { IconName, Product } from "../types";
import { formatPrice } from "../utils/format";

type ProductDetailScreenProps = {
  product: Product;
  isFavorite: boolean;
  onBack: () => void;
  onWishlistToggle: () => void;
  onAddToCart: (product: Product, color: string, size: string) => void;
  onCartPress: () => void;
};

export function ProductDetailScreen({
  product,
  isFavorite,
  onBack,
  onWishlistToggle,
  onAddToCart,
  onCartPress,
}: ProductDetailScreenProps) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const galleryImages = [
    product.image,
    ...products
      .filter((item) => item.id !== product.id)
      .slice(0, 3)
      .map((item) => item.image),
  ];

  return (
    <View style={styles.fullScreen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent}>
        <View style={styles.detailTopbar}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
          <Pressable onPress={onWishlistToggle}>
            <IconButton name={isFavorite ? "heart" : "heart-outline"} />
          </Pressable>
        </View>

        <Image source={{ uri: product.image }} style={styles.detailImage} resizeMode="cover" />

        <View style={styles.thumbnailRow}>
          {galleryImages.map((image, index) => (
            <Image
              key={`${image}-${index}`}
              source={{ uri: image }}
              style={[styles.thumbnail, index === 0 && styles.thumbnailActive]}
              resizeMode="cover"
            />
          ))}
        </View>

        <View style={styles.detailInfo}>
          <Text style={styles.detailCategory}>
            {product.category} / {product.type}
          </Text>
          <Text style={styles.detailTitle}>{product.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviews} đánh giá)
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.detailPrice}>{formatPrice(product.price)}</Text>
            <Text style={styles.originalPrice}>{formatPrice(product.originalPrice)}</Text>
          </View>

          <Text style={styles.stockText}>Tồn kho: {product.stock} sản phẩm</Text>
          <Text style={styles.description}>{product.description}</Text>

          <OptionGroup label="Màu sắc" values={product.colors} value={color} onChange={setColor} />
          <OptionGroup label="Kích thước" values={product.sizes} value={size} onChange={setSize} />

          <View style={styles.quantityBlock}>
            <Text style={styles.optionLabel}>Số lượng</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.stepperButton}>
                <Text style={styles.stepperText}>-</Text>
              </Pressable>
              <View style={styles.quantityValue}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <Pressable
                onPress={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={styles.stepperButton}
              >
                <Text style={styles.stepperText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.policyBlock}>
            <PolicyLine icon="car-outline" title="Giao hàng" text="Miễn phí cho đơn từ 500.000đ" />
            <PolicyLine icon="repeat-outline" title="Đổi trả" text="Hỗ trợ đổi trả trong 30 ngày" />
          </View>
        </View>
      </ScrollView>

      <StickyActionBar
        label="Tạm tính"
        value={formatPrice(product.price * quantity)}
        action="Thêm vào giỏ"
        onPress={() => {
          Array.from({ length: quantity }).forEach(() => onAddToCart(product, color, size));
          onCartPress();
        }}
      />
    </View>
  );
}

function PolicyLine({ icon, title, text }: { icon: IconName; title: string; text: string }) {
  return (
    <View style={styles.policyLine}>
      <Ionicons name={icon} size={20} color={colors.primary} />
      <View>
        <Text style={styles.policyTitle}>{title}</Text>
        <Text style={styles.policyText}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  detailContent: {
    paddingBottom: 116,
  },
  detailTopbar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailImage: {
    marginHorizontal: 16,
    width: "auto",
    aspectRatio: 0.92,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  thumbnailRow: {
    paddingHorizontal: 16,
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  thumbnail: {
    width: 58,
    height: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  thumbnailActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  detailInfo: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
  },
  detailCategory: {
    color: colors.primary,
    fontWeight: "800",
    textTransform: "uppercase",
    fontSize: 12,
  },
  detailTitle: {
    marginTop: 6,
    color: colors.foreground,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "900",
  },
  ratingRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    color: colors.muted,
    fontWeight: "700",
  },
  priceRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 10,
  },
  detailPrice: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
  },
  originalPrice: {
    color: colors.muted,
    fontSize: 16,
    textDecorationLine: "line-through",
  },
  stockText: {
    marginTop: 8,
    color: colors.success,
    fontWeight: "700",
  },
  description: {
    marginTop: 14,
    color: colors.foreground,
    lineHeight: 22,
  },
  optionLabel: {
    color: colors.foreground,
    fontWeight: "800",
    marginBottom: 10,
  },
  quantityBlock: {
    marginTop: 20,
  },
  stepper: {
    flexDirection: "row",
    width: 124,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  stepperButton: {
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperText: {
    color: colors.foreground,
    fontSize: 20,
    fontWeight: "800",
  },
  quantityValue: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontWeight: "800",
    color: colors.foreground,
    fontSize: 16,
    lineHeight: 20,
  },
  policyBlock: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
    gap: 18,
  },
  policyLine: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  policyTitle: {
    color: colors.foreground,
    fontWeight: "800",
  },
  policyText: {
    color: colors.muted,
    marginTop: 2,
  },
});
