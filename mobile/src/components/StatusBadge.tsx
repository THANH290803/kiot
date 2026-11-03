import { StyleSheet, Text, View } from "react-native";
import { OrderStatus } from "../types";

const statusMap: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ xác nhận", color: "#92400e", bg: "#fef3c7" },
  confirmed: { label: "Đã xác nhận", color: "#1d4ed8", bg: "#dbeafe" },
  shipping: { label: "Đang giao", color: "#7c3aed", bg: "#ede9fe" },
  delivered: { label: "Đã giao", color: "#15803d", bg: "#dcfce7" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const value = statusMap[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: value.bg }]}>
      <Text style={[styles.statusText, { color: value.color }]}>{value.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    height: 30,
    borderRadius: 15,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontWeight: "900",
    fontSize: 12,
  },
});
