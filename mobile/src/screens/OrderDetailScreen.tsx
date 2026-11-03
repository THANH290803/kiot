import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { StatusBadge } from "../components/StatusBadge";
import { colors } from "../theme/colors";
import { IconName, Order } from "../types";
import { formatPrice } from "../utils/format";

type OrderDetailScreenProps = {
  order: Order;
  onBack: () => void;
};

export function OrderDetailScreen({ order, onBack }: OrderDetailScreenProps) {
  return (
    <View style={styles.fullScreen}>
      <View style={styles.topbar}>
        <Pressable onPress={onBack} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.topbarTitleWrap}>
          <Text style={styles.topbarTitle}>Chi tiết đơn hàng</Text>
          <Text style={styles.topbarSubtitle}>{order.id}</Text>
        </View>
        <View style={styles.topbarSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>{order.id}</Text>
              <Text style={styles.orderDate}>Ngày đặt: {order.date}</Text>
            </View>
            <StatusBadge status={order.status} />
          </View>

          <View style={styles.statusTimeline}>
            <StatusStep active icon="receipt-outline" label="Đặt hàng" />
            <View style={styles.statusConnector} />
            <StatusStep active={order.status !== "pending"} icon="cube-outline" label="Xử lý" />
            <View style={styles.statusConnector} />
            <StatusStep active={["shipping", "delivered"].includes(order.status)} icon="car-outline" label="Giao" />
            <View style={styles.statusConnector} />
            <StatusStep active={order.status === "delivered"} icon="checkmark-outline" label="Xong" />
          </View>
        </View>

        <InfoCard title="Thông tin nhận hàng">
          <InfoLine icon="person-outline" label="Khách hàng" value={order.customerName} />
          <InfoLine icon="call-outline" label="Số điện thoại" value={order.customerPhone} />
          <InfoLine icon="location-outline" label="Địa chỉ giao hàng" value={order.shippingAddress} />
        </InfoCard>

        <InfoCard title="Phương thức thanh toán">
          <InfoLine icon="cash-outline" label="Thanh toán" value={order.paymentMethod} />
          <InfoLine icon="shield-checkmark-outline" label="Trạng thái" value="Thanh toán khi nhận hàng" />
        </InfoCard>

        <InfoCard title={`Sản phẩm (${order.items})`}>
          {order.products.map((item) => (
            <View key={`${item.id}-${item.color}-${item.size}`} style={styles.productRow}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
                <Text style={styles.productMeta}>
                  {item.color} | Size {item.size}
                </Text>
                <Text style={styles.productMeta}>x{item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
        </InfoCard>

        <InfoCard title="Tổng thanh toán">
          <PriceLine label="Tạm tính" value={formatPrice(order.subtotal)} />
          <PriceLine label="Phí vận chuyển" value={order.shippingFee > 0 ? formatPrice(order.shippingFee) : "Miễn phí"} />
          <View style={styles.totalDivider} />
          <PriceLine label="Tổng cộng" value={formatPrice(order.total)} strong />
        </InfoCard>

        {order.status === "pending" && (
          <Pressable style={styles.cancelButton}>
            <Ionicons name="close-circle-outline" size={20} color={colors.sale} />
            <Text style={styles.cancelButtonText}>Hủy đơn hàng</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function InfoLine({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.infoLine}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function PriceLine({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.priceLine}>
      <Text style={[styles.priceLabel, strong && styles.priceStrong]}>{label}</Text>
      <Text style={[styles.priceValue, strong && styles.totalValue]}>{value}</Text>
    </View>
  );
}

function StatusStep({ active, icon, label }: { active: boolean; icon: IconName; label: string }) {
  return (
    <View style={styles.statusStep}>
      <View style={[styles.statusDot, active && styles.statusDotActive]}>
        <Ionicons name={icon} size={15} color={active ? colors.surface : colors.muted} />
      </View>
      <Text style={[styles.statusStepText, active && styles.statusStepTextActive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topbar: {
    height: 68,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  topbarTitleWrap: {
    flex: 1,
    alignItems: "center",
  },
  topbarTitle: {
    color: colors.foreground,
    fontWeight: "900",
    fontSize: 17,
  },
  topbarSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontWeight: "700",
    fontSize: 12,
  },
  topbarSpacer: {
    width: 42,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
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
    fontSize: 20,
  },
  orderDate: {
    marginTop: 4,
    color: colors.muted,
    fontWeight: "700",
  },
  statusTimeline: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  statusStep: {
    width: 58,
    alignItems: "center",
  },
  statusDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusDotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusStepText: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
  statusStepTextActive: {
    color: colors.primary,
  },
  statusConnector: {
    flex: 1,
    height: 1,
    marginTop: 17,
    backgroundColor: colors.border,
  },
  card: {
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
    fontSize: 17,
    marginBottom: 12,
  },
  cardBody: {
    gap: 12,
  },
  infoLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoIcon: {
    width: 20,
    paddingTop: 1,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    minWidth: 0,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  infoValue: {
    color: colors.foreground,
    fontWeight: "700",
    lineHeight: 21,
  },
  productRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  productImage: {
    width: 62,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.border,
  },
  productInfo: {
    flex: 1,
    minWidth: 0,
  },
  productName: {
    color: colors.foreground,
    fontWeight: "900",
    lineHeight: 20,
  },
  productMeta: {
    color: colors.muted,
    fontWeight: "700",
    marginTop: 3,
    fontSize: 12,
  },
  productPrice: {
    color: colors.primary,
    fontWeight: "900",
  },
  priceLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  priceLabel: {
    color: colors.muted,
    fontWeight: "700",
  },
  priceValue: {
    color: colors.foreground,
    fontWeight: "800",
  },
  priceStrong: {
    color: colors.foreground,
    fontWeight: "900",
    fontSize: 16,
  },
  totalValue: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 17,
  },
  totalDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  cancelButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.sale,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonText: {
    color: colors.sale,
    fontWeight: "900",
  },
});
