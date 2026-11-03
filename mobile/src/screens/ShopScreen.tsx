import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { ProductCard } from "../components/ProductCard";
import { categories } from "../data/catalog";
import { colors } from "../theme/colors";
import { Product } from "../types";

type ShopScreenProps = {
  products: Product[];
  productTypes: string[];
  selectedCategory: string;
  selectedProductType: string;
  query: string;
  wishlist: string[];
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onProductTypeChange: (value: string) => void;
  onProductPress: (product: Product) => void;
  onWishlistToggle: (productId: string) => void;
  onAddToCart: (product: Product) => void;
};

export function ShopScreen({
  products,
  productTypes,
  selectedCategory,
  selectedProductType,
  query,
  wishlist,
  onQueryChange,
  onCategoryChange,
  onProductTypeChange,
  onProductPress,
  onWishlistToggle,
  onAddToCart,
}: ShopScreenProps) {
  const [filtersVisible, setFiltersVisible] = useState(false);

  return (
    <View style={styles.fullScreen}>
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder="Tìm sản phẩm..."
          placeholderTextColor={colors.muted}
          style={styles.searchInput}
        />
        <Pressable
          style={[styles.filterButton, filtersVisible && styles.filterButtonActive]}
          onPress={() => setFiltersVisible((visible) => !visible)}
        >
          <Ionicons name="options-outline" size={18} color={colors.primary} />
          <Text style={styles.filterButtonText}>{filtersVisible ? "Ẩn lọc" : "Lọc"}</Text>
        </Pressable>
      </View>

      {filtersVisible && (
        <View style={styles.filterPanel}>
          <Text style={styles.filterTitle}>Đối tượng</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryRail}
            contentContainerStyle={styles.categoryRailContent}
          >
            {categories.map((category) => (
              <Pressable
                key={category}
                onPress={() => onCategoryChange(category)}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category && styles.categoryChipTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={[styles.filterTitle, styles.typeTitle]}>Loại sản phẩm</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryRail}
            contentContainerStyle={styles.categoryRailContent}
          >
            {productTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => onProductTypeChange(type)}
                style={[
                  styles.categoryChip,
                  selectedProductType === type && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedProductType === type && styles.categoryChipTextActive,
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.shopToolbar}>
        <Text style={styles.resultText}>{products.length} sản phẩm</Text>
        <Pressable style={styles.sortButton}>
          <Text style={styles.sortText}>Mới nhất</Text>
          <Ionicons name="chevron-down" size={16} color={colors.muted} />
        </Pressable>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.productGridRow}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorite={wishlist.includes(item.id)}
            onPress={() => onProductPress(item)}
            onWishlistToggle={() => onWishlistToggle(item.id)}
            onAddToCart={() => onAddToCart(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  searchBox: {
    margin: 16,
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: colors.foreground,
    fontSize: 15,
  },
  filterButton: {
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: "#dce8ff",
  },
  filterButtonText: {
    color: colors.primary,
    fontWeight: "800",
  },
  filterPanel: {
    marginHorizontal: 16,
    marginTop: -4,
    marginBottom: 6,
  },
  filterTitle: {
    paddingHorizontal: 0,
    marginBottom: 8,
    color: colors.foreground,
    fontWeight: "900",
  },
  typeTitle: {
    marginTop: 10,
  },
  categoryRail: {
    height: 44,
    flexGrow: 0,
  },
  categoryRailContent: {
    alignItems: "center",
  },
  categoryChip: {
    height: 38,
    paddingHorizontal: 14,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: colors.foreground,
    fontWeight: "700",
  },
  categoryChipTextActive: {
    color: colors.surface,
  },
  shopToolbar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resultText: {
    color: colors.muted,
    fontWeight: "700",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    color: colors.foreground,
    fontWeight: "700",
  },
  productGridRow: {
    justifyContent: "space-between",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 2,
    paddingBottom: 110,
  },
});
