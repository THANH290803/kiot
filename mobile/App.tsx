import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { AppHeader } from "./src/components/AppHeader";
import { BottomTabs } from "./src/components/BottomTabs";
import { products } from "./src/data/catalog";
import { orders } from "./src/data/orders";
import { initialProfile } from "./src/data/profile";
import { AccountScreen } from "./src/screens/AccountScreen";
import { CategoriesScreen } from "./src/screens/CategoriesScreen";
import { CartScreen } from "./src/screens/CartScreen";
import { CheckoutScreen } from "./src/screens/CheckoutScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { OrderDetailScreen } from "./src/screens/OrderDetailScreen";
import { ProductDetailScreen } from "./src/screens/ProductDetailScreen";
import { ShopScreen } from "./src/screens/ShopScreen";
import { WishlistScreen } from "./src/screens/WishlistScreen";
import { colors } from "./src/theme/colors";
import { CartItem, Order, Product, ScreenKey, TabKey } from "./src/types";

export default function App() {
  const [screen, setScreen] = useState<ScreenKey>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [selectedOrder, setSelectedOrder] = useState<Order>(orders[0]);
  const [profile, setProfile] = useState(initialProfile);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedProductType, setSelectedProductType] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [wishlist, setWishlist] = useState<string[]>(["2"]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === "Tất cả" || product.category === selectedCategory;
      const matchesType =
        selectedProductType === "Tất cả" || product.type === selectedProductType;
      const searchText = `${product.name} ${product.category} ${product.type}`;
      const matchesQuery = searchText
        .toLowerCase()
        .includes(query.trim().toLowerCase());

      return matchesCategory && matchesType && matchesQuery;
    });
  }, [query, selectedCategory, selectedProductType]);

  const availableProductTypes = useMemo(() => {
    const visibleProducts = products.filter(
      (product) => selectedCategory === "Tất cả" || product.category === selectedCategory,
    );
    const types = Array.from(new Set(visibleProducts.map((product) => product.type)));

    return ["Tất cả", ...types];
  }, [selectedCategory]);

  const activeTab: TabKey =
    screen === "detail" || screen === "checkout"
      ? "shop"
      : screen === "orderDetail" || screen === "editProfile" || screen === "wishlist"
        ? "account"
        : screen;

  const openProduct = (product: Product) => {
    setSelectedProduct(product);
    setScreen("detail");
  };

  const openShop = (category = "Tất cả", productType = "Tất cả") => {
    setSelectedCategory(category);
    setSelectedProductType(productType);
    setQuery("");
    setOrderPlaced(false);
    setScreen("shop");
  };

  const goTab = (tab: TabKey) => {
    setOrderPlaced(false);
    setScreen(tab);
  };

  const handleBottomTabChange = (tab: TabKey) => {
    if (tab === "shop") {
      setSelectedCategory("Tất cả");
      setSelectedProductType("Tất cả");
      setQuery("");
    }

    goTab(tab);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const addToCart = (
    product: Product,
    color = product.colors[0],
    size = product.sizes[0],
  ) => {
    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.product.id === product.id && item.color === color && item.size === size,
      );

      if (existing) {
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...current, { product, color, size, quantity: 1 }];
    });
  };

  const updateQuantity = (item: CartItem, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((cartItem) => cartItem !== item));
      return;
    }

    setCart((current) =>
      current.map((cartItem) =>
        cartItem === item ? { ...cartItem, quantity: nextQuantity } : cartItem,
      ),
    );
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.shell}>
        <StatusBar style="dark" />
        {screen !== "categories" &&
          screen !== "detail" &&
          screen !== "orderDetail" &&
          screen !== "editProfile" && <AppHeader notificationCount={0} />}

        <View style={styles.content}>
          {screen === "home" && (
            <HomeScreen
              onShopPress={openShop}
              onProductPress={openProduct}
              onWishlistToggle={toggleWishlist}
              wishlist={wishlist}
              onAddToCart={addToCart}
            />
          )}

          {screen === "shop" && (
            <ShopScreen
              products={filteredProducts}
              productTypes={availableProductTypes}
              selectedCategory={selectedCategory}
              selectedProductType={selectedProductType}
              query={query}
              wishlist={wishlist}
              onQueryChange={setQuery}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
                setSelectedProductType("Tất cả");
              }}
              onProductTypeChange={setSelectedProductType}
              onProductPress={openProduct}
              onWishlistToggle={toggleWishlist}
              onAddToCart={addToCart}
            />
          )}

          {screen === "wishlist" && (
            <WishlistScreen
              wishlistProducts={products.filter((product) =>
                wishlist.includes(product.id),
              )}
              onProductPress={openProduct}
              onWishlistToggle={toggleWishlist}
              onAddToCart={addToCart}
              onShopPress={() => goTab("shop")}
            />
          )}

          {screen === "cart" && (
            <CartScreen
              cart={cart}
              total={cartTotal}
              onQuantityChange={updateQuantity}
              onShopPress={() => goTab("shop")}
              onCheckoutPress={() => setScreen("checkout")}
            />
          )}

          {screen === "checkout" && (
            <CheckoutScreen
              cart={cart}
              total={cartTotal}
              orderPlaced={orderPlaced}
              onBack={() => goTab("cart")}
              onPlaceOrder={() => {
                setOrderPlaced(true);
                setCart([]);
              }}
              onAccountPress={() => goTab("account")}
            />
          )}

          {screen === "account" && (
            <AccountScreen
              profile={profile}
              wishlistCount={wishlist.length}
              onWishlistPress={() => setScreen("wishlist")}
              onEditProfilePress={() => setScreen("editProfile")}
              onOrderPress={(order) => {
                setSelectedOrder(order);
                setScreen("orderDetail");
              }}
            />
          )}

          {screen === "categories" && (
            <CategoriesScreen
              initialCategory={selectedCategory}
              onShopPress={openShop}
            />
          )}

          {screen === "detail" && (
            <ProductDetailScreen
              product={selectedProduct}
              isFavorite={wishlist.includes(selectedProduct.id)}
              onBack={() => goTab("shop")}
              onWishlistToggle={() => toggleWishlist(selectedProduct.id)}
              onAddToCart={addToCart}
              onCartPress={() => goTab("cart")}
            />
          )}

          {screen === "orderDetail" && (
            <OrderDetailScreen order={selectedOrder} onBack={() => goTab("account")} />
          )}

          {screen === "editProfile" && (
            <EditProfileScreen
              profile={profile}
              onBack={() => goTab("account")}
              onSave={(nextProfile) => {
                setProfile(nextProfile);
                goTab("account");
              }}
            />
          )}
        </View>

        {screen !== "detail" &&
          screen !== "checkout" &&
          screen !== "orderDetail" &&
          screen !== "editProfile" && (
          <BottomTabs
            activeTab={activeTab}
            cartCount={cartCount}
            onChange={handleBottomTabChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  shell: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.border,
  },
  content: {
    flex: 1,
  },
});
