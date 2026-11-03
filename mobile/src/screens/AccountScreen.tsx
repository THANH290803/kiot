import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { IconButton } from "../components/IconButton";
import { SectionHeader } from "../components/SectionHeader";
import { ScreenTitle } from "../components/ScreenTitle";
import { StatusBadge } from "../components/StatusBadge";
import { formatProfileAddress } from "../data/profile";
import { orders } from "../data/orders";
import { colors } from "../theme/colors";
import { Order, UserProfile } from "../types";
import { formatPrice } from "../utils/format";

type AccountScreenProps = {
  profile: UserProfile;
  wishlistCount: number;
  onWishlistPress: () => void;
  onEditProfilePress: () => void;
  onOrderPress: (order: Order) => void;
};

export function AccountScreen({
  profile,
  wishlistCount,
  onWishlistPress,
  onEditProfilePress,
  onOrderPress,
}: AccountScreenProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.accountContent}>
      <ScreenTitle title="Tài khoản" subtitle="Thông tin cá nhân và đơn hàng" />

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>PT</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileMeta}>{profile.email}</Text>
          <Text style={styles.profileMeta}>{profile.phone}</Text>
        </View>
        <Pressable onPress={onEditProfilePress}>
          <IconButton name="create-outline" />
        </Pressable>
      </View>

      <View style={styles.addressCard}>
        <Text style={styles.cardTitle}>Địa chỉ mặc định</Text>
        <Text style={styles.addressText}>{formatProfileAddress(profile)}</Text>
      </View>

      <Pressable style={styles.shortcutRow} onPress={onWishlistPress}>
        <View>
          <Text style={styles.shortcutTitle}>Sản phẩm yêu thích</Text>
          <Text style={styles.shortcutMeta}>{wishlistCount} sản phẩm đã lưu</Text>
        </View>
        <Text style={styles.shortcutAction}>Xem</Text>
      </Pressable>

      <SectionHeader title="Lịch sử đơn hàng" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRail}>
        {["Tất cả", "Chờ xác nhận", "Đang giao", "Đã giao", "Đã hủy"].map((status, index) => (
          <View key={status} style={[styles.categoryChip, index === 0 && styles.categoryChipActive]}>
            <Text style={[styles.categoryChipText, index === 0 && styles.categoryChipTextActive]}>{status}</Text>
          </View>
        ))}
      </ScrollView>

      {orders.map((order) => (
        <View key={order.id} style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.deliveryInfo}>
            <OrderInfoLine
              icon="person-outline"
              label="Khách hàng"
              value={`${order.customerName} - ${order.customerPhone}`}
            />
            <OrderInfoLine
              icon="location-outline"
              label="Giao hàng"
              value={order.shippingAddress}
            />
            <OrderInfoLine
              icon="cash-outline"
              label="Thanh toán"
              value={order.paymentMethod}
            />
          </View>

          <View style={styles.orderFooter}>
            <Text style={styles.orderMeta}>{order.items} sản phẩm</Text>
            <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
          </View>
          <Pressable style={styles.outlineButton} onPress={() => onOrderPress(order)}>
            <Ionicons name="eye-outline" size={18} color={colors.primary} />
            <Text style={styles.outlineButtonText}>Chi tiết</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

function OrderInfoLine({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.orderInfoLine}>
      <View style={styles.orderInfoIcon}>
        <Ionicons name={icon} size={17} color={colors.primary} />
      </View>
      <View style={styles.orderInfoText}>
        <Text style={styles.orderInfoLabel}>{label}</Text>
        <Text style={styles.orderInfoValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accountContent: {
    padding: 16,
    paddingBottom: 110,
  },
  profileCard: {
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.surface,
    fontWeight: "900",
    fontSize: 18,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.foreground,
    fontWeight: "900",
    fontSize: 17,
  },
  profileMeta: {
    color: colors.muted,
    marginTop: 2,
  },
  addressCard: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  cardTitle: {
    color: colors.foreground,
    fontWeight: "900",
    marginBottom: 6,
  },
  addressText: {
    color: colors.muted,
    lineHeight: 21,
  },
  shortcutRow: {
    marginTop: 12,
    minHeight: 62,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  shortcutTitle: {
    color: colors.foreground,
    fontWeight: "900",
  },
  shortcutMeta: {
    marginTop: 3,
    color: colors.muted,
    fontWeight: "600",
  },
  shortcutAction: {
    color: colors.primary,
    fontWeight: "900",
  },
  categoryRail: {
    maxHeight: 48,
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
  orderCard: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  orderId: {
    color: colors.foreground,
    fontWeight: "900",
    fontSize: 16,
  },
  orderDate: {
    color: colors.muted,
    marginTop: 3,
  },
  deliveryInfo: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 12,
  },
  orderInfoLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    minHeight: 42,
  },
  orderInfoIcon: {
    width: 18,
    paddingTop: 1,
    alignItems: "center",
  },
  orderInfoText: {
    flex: 1,
    minWidth: 0,
  },
  orderInfoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  orderInfoValue: {
    color: colors.foreground,
    fontWeight: "700",
    lineHeight: 21,
  },
  orderFooter: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderMeta: {
    color: colors.muted,
    fontWeight: "700",
  },
  orderTotal: {
    color: colors.primary,
    fontWeight: "900",
  },
  outlineButton: {
    marginTop: 12,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  outlineButtonText: {
    color: colors.primary,
    fontWeight: "900",
  },
});
