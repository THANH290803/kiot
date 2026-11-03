import { FlatList, StyleSheet } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { ScreenTitle } from "../components/ScreenTitle";
import { Product } from "../types";

type WishlistScreenProps = {
  wishlistProducts: Product[];
  onProductPress: (product: Product) => void;
  onWishlistToggle: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onShopPress: () => void;
};

export function WishlistScreen({
  wishlistProducts,
  onProductPress,
  onWishlistToggle,
  onAddToCart,
  onShopPress,
}: WishlistScreenProps) {
  if (wishlistProducts.length === 0) {
    return (
      <EmptyState
        icon="heart-outline"
        title="Chưa có sản phẩm yêu thích"
        text="Lưu những sản phẩm bạn thích để xem lại nhanh hơn."
        action="Khám phá sản phẩm"
        onAction={onShopPress}
      />
    );
  }

  return (
    <FlatList
      data={wishlistProducts}
      keyExtractor={(item) => item.id}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      columnWrapperStyle={styles.productGridRow}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={<ScreenTitle title="Yêu thích" subtitle={`${wishlistProducts.length} sản phẩm đã lưu`} />}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          isFavorite
          onPress={() => onProductPress(item)}
          onWishlistToggle={() => onWishlistToggle(item.id)}
          onAddToCart={() => onAddToCart(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  productGridRow: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 110,
  },
});
