import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { ProductCard } from "../components/ProductCard";
import { SectionHeader } from "../components/SectionHeader";
import { products } from "../data/catalog";
import { colors } from "../theme/colors";
import { IconName, Product } from "../types";

type HomeScreenProps = {
  onShopPress: (category?: string, productType?: string) => void;
  onProductPress: (product: Product) => void;
  onWishlistToggle: (productId: string) => void;
  wishlist: string[];
  onAddToCart: (product: Product) => void;
};

export function HomeScreen({
  onShopPress,
  onProductPress,
  onWishlistToggle,
  wishlist,
  onAddToCart,
}: HomeScreenProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <Pressable style={styles.hero} onPress={() => onShopPress()}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1567049677904-d289f35393bf?w=1000&h=800&fit=crop",
          }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroText}>
          <Text style={styles.eyebrow}>Nam, nữ & trẻ em</Text>
          <Text style={styles.heroTitle}>Phong cách cho cả gia đình</Text>
          <View style={styles.heroButton}>
            <Text style={styles.heroButtonText}>Mua sắm ngay</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.primary} />
          </View>
        </View>
      </Pressable>

      <View style={styles.promiseRow}>
        <PromiseItem icon="car-outline" label="Miễn phí giao" />
        <PromiseItem icon="shield-checkmark-outline" label="Đảm bảo chất lượng" />
        <PromiseItem icon="repeat-outline" label="Đổi trả dễ dàng" />
      </View>

      <SectionHeader title="Sản phẩm mới" action="Cửa hàng" onPress={() => onShopPress()} />
      <View style={styles.productGrid}>
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            compact
            isFavorite={wishlist.includes(product.id)}
            onPress={() => onProductPress(product)}
            onWishlistToggle={() => onWishlistToggle(product.id)}
            onAddToCart={() => onAddToCart(product)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function PromiseItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={styles.promiseItem}>
      <Ionicons name={icon} size={22} color={colors.primary} />
      <Text style={styles.promiseLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  hero: {
    height: 430,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.accent,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.34)",
  },
  heroText: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 22,
  },
  eyebrow: {
    color: colors.surface,
    fontSize: 13,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 8,
  },
  heroTitle: {
    color: colors.surface,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    marginBottom: 18,
  },
  heroButton: {
    height: 48,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  heroButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  promiseRow: {
    marginTop: 22,
    flexDirection: "row",
    gap: 10,
  },
  promiseItem: {
    flex: 1,
    minHeight: 86,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    justifyContent: "space-between",
  },
  promiseLabel: {
    color: colors.foreground,
    fontWeight: "700",
    fontSize: 12,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
