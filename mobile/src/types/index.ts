import { Ionicons } from "@expo/vector-icons";

export type TabKey = "home" | "categories" | "shop" | "cart" | "account";
export type ScreenKey =
  | TabKey
  | "wishlist"
  | "detail"
  | "checkout"
  | "orderDetail"
  | "editProfile";
export type IconName = keyof typeof Ionicons.glyphMap;

export type Product = {
  id: string;
  name: string;
  category: string;
  type: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  colors: string[];
  sizes: string[];
  stock: number;
  description: string;
};

export type CartItem = {
  product: Product;
  color: string;
  size: string;
  quantity: number;
};

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
};

export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered";

export type Order = {
  id: string;
  status: OrderStatus;
  date: string;
  total: number;
  items: number;
  subtotal: number;
  shippingFee: number;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: string;
  products: Array<{
    id: string;
    name: string;
    image: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
  }>;
};
