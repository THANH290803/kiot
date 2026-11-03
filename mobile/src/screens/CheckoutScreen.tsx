import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { EmptyState } from "../components/EmptyState";
import { Field, FormSection } from "../components/FormSection";
import { ScreenTitle } from "../components/ScreenTitle";
import { StickyActionBar } from "../components/StickyActionBar";
import { addressOptions } from "../data/address-options";
import { initialProfile } from "../data/profile";
import { colors } from "../theme/colors";
import { CartItem } from "../types";
import { formatPrice } from "../utils/format";

type CheckoutScreenProps = {
  cart: CartItem[];
  total: number;
  orderPlaced: boolean;
  onBack: () => void;
  onPlaceOrder: () => void;
  onAccountPress: () => void;
};

export function CheckoutScreen({
  cart,
  total,
  orderPlaced,
  onBack,
  onPlaceOrder,
  onAccountPress,
}: CheckoutScreenProps) {
  const [address, setAddress] = useState({
    province: initialProfile.province,
    district: initialProfile.district,
    ward: initialProfile.ward,
    detailAddress: initialProfile.detailAddress,
  });
  const [picker, setPicker] = useState<null | "province" | "district" | "ward">(null);

  const selectedProvince = useMemo(
    () => addressOptions.find((province) => province.name === address.province),
    [address.province],
  );
  const districtOptions = selectedProvince?.districts ?? [];
  const selectedDistrict = useMemo(
    () => districtOptions.find((district) => district.name === address.district),
    [address.district, districtOptions],
  );
  const wardOptions = selectedDistrict?.wards ?? [];

  const pickerOptions = useMemo(() => {
    if (picker === "province") return addressOptions.map((province) => province.name);
    if (picker === "district") return districtOptions.map((district) => district.name);
    if (picker === "ward") return wardOptions.map((ward) => ward.name);
    return [];
  }, [districtOptions, picker, wardOptions]);

  const closePicker = () => {
    setPicker(null);
  };

  const handlePickAddress = (value: string) => {
    if (picker === "province") {
      const province = addressOptions.find((item) => item.name === value);
      const firstDistrict = province?.districts[0];
      const firstWard = firstDistrict?.wards[0];

      setAddress((current) => ({
        ...current,
        province: value,
        district: firstDistrict?.name || "",
        ward: firstWard?.name || "",
      }));
    }

    if (picker === "district") {
      const district = districtOptions.find((item) => item.name === value);
      const firstWard = district?.wards[0];

      setAddress((current) => ({
        ...current,
        district: value,
        ward: firstWard?.name || "",
      }));
    }

    if (picker === "ward") {
      setAddress((current) => ({
        ...current,
        ward: value,
      }));
    }

    closePicker();
  };

  if (orderPlaced) {
    return (
      <EmptyState
        icon="checkmark-circle-outline"
        title="Đặt hàng thành công"
        text="Đơn hàng demo đã được tạo. Bạn có thể xem trạng thái trong tài khoản."
        action="Xem tài khoản"
        onAction={onAccountPress}
      />
    );
  }

  return (
    <View style={styles.fullScreen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.checkoutContent}>
        <View style={styles.detailTopbar}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
        </View>
        <ScreenTitle title="Thanh toán" subtitle="Hoàn tất thông tin giao hàng" />

        <FormSection title="Người nhận">
          <Field placeholder="Tên đầy đủ" value="Nguyễn Phúc Thành" />
          <Field placeholder="Email" value="customer@example.com" />
          <Field placeholder="Số điện thoại" value="0901234567" />
        </FormSection>

        <FormSection title="Địa chỉ giao hàng">
          <SelectField
            label="Tỉnh/Thành"
            value={address.province}
            placeholder="Chọn tỉnh/thành"
            onPress={() => setPicker("province")}
          />
          <SelectField
            label="Quận/Huyện"
            value={address.district}
            placeholder="Chọn quận/huyện"
            disabled={!address.province}
            onPress={() => setPicker("district")}
          />
          <SelectField
            label="Phường/Xã"
            value={address.ward}
            placeholder="Chọn phường/xã"
            disabled={!address.district}
            onPress={() => setPicker("ward")}
          />
          <View style={styles.inputWrap}>
            <Text style={styles.inputLabel}>Địa chỉ chi tiết</Text>
            <TextInput
              value={address.detailAddress}
              placeholder="Số nhà, tên đường"
              placeholderTextColor={colors.muted}
              onChangeText={(value) =>
                setAddress((current) => ({
                  ...current,
                  detailAddress: value,
                }))
              }
              style={styles.input}
            />
          </View>
        </FormSection>

        <FormSection title="Phương thức thanh toán">
          <View style={styles.paymentOption}>
            <Ionicons name="cash-outline" size={22} color={colors.primary} />
            <View>
              <Text style={styles.paymentTitle}>Thanh toán khi nhận hàng</Text>
              <Text style={styles.paymentText}>COD đang được hỗ trợ</Text>
            </View>
          </View>
        </FormSection>

        <FormSection title="Tóm tắt đơn hàng">
          {cart.map((item) => (
            <View key={`${item.product.id}-${item.color}-${item.size}`} style={styles.summaryLine}>
              <Text numberOfLines={1} style={styles.summaryName}>
                {item.product.name} x{item.quantity}
              </Text>
              <Text style={styles.summaryPrice}>{formatPrice(item.product.price * item.quantity)}</Text>
            </View>
          ))}
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </FormSection>
      </ScrollView>

      {picker && (
        <View style={styles.pickerOverlay}>
          <Pressable style={styles.pickerBackdrop} onPress={closePicker} />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {picker === "province"
                  ? "Chọn tỉnh/thành"
                  : picker === "district"
                    ? "Chọn quận/huyện"
                    : "Chọn phường/xã"}
              </Text>
              <Pressable onPress={closePicker} style={styles.pickerCloseButton}>
                <Ionicons name="close" size={20} color={colors.foreground} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.pickerList}>
              {pickerOptions.map((option) => {
                const active =
                  option === address.province || option === address.district || option === address.ward;

                return (
                  <Pressable
                    key={option}
                    style={[styles.pickerOption, active && styles.pickerOptionActive]}
                    onPress={() => handlePickAddress(option)}
                  >
                    <Text style={[styles.pickerOptionText, active && styles.pickerOptionTextActive]}>
                      {option}
                    </Text>
                    {active && <Ionicons name="checkmark" size={20} color={colors.primary} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      )}

      <StickyActionBar label="COD" value={formatPrice(total)} action="Hoàn tất đơn" onPress={onPlaceOrder} />
    </View>
  );
}

function SelectField({
  label,
  value,
  placeholder,
  disabled,
  onPress,
}: {
  label: string;
  value: string;
  placeholder: string;
  disabled?: boolean;
  onPress: () => void;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Pressable
        disabled={disabled}
        style={[styles.selectInput, disabled && styles.selectInputDisabled]}
        onPress={onPress}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.selectText,
            !value && styles.selectPlaceholder,
            disabled && styles.selectTextDisabled,
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={disabled ? colors.border : colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  checkoutContent: {
    padding: 16,
    paddingBottom: 124,
  },
  detailTopbar: {
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
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
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 64,
  },
  paymentTitle: {
    color: colors.foreground,
    fontWeight: "900",
  },
  paymentText: {
    color: colors.muted,
    marginTop: 2,
  },
  inputWrap: {
    gap: 6,
  },
  inputLabel: {
    color: colors.muted,
    fontWeight: "800",
    fontSize: 12,
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    color: colors.foreground,
    fontWeight: "700",
    fontSize: 15,
  },
  selectInput: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  selectInputDisabled: {
    opacity: 0.55,
  },
  selectText: {
    flex: 1,
    color: colors.foreground,
    fontWeight: "700",
    fontSize: 15,
  },
  selectPlaceholder: {
    color: colors.muted,
  },
  selectTextDisabled: {
    color: colors.muted,
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 10,
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(17,24,39,0.32)",
  },
  pickerSheet: {
    maxHeight: "58%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: colors.surface,
    paddingTop: 14,
    paddingBottom: 16,
  },
  pickerHeader: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    color: colors.foreground,
    fontSize: 18,
    fontWeight: "900",
  },
  pickerCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  pickerList: {
    padding: 12,
    gap: 8,
  },
  pickerOption: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.background,
  },
  pickerOptionActive: {
    backgroundColor: colors.primarySoft,
  },
  pickerOptionText: {
    flex: 1,
    color: colors.foreground,
    fontWeight: "800",
  },
  pickerOptionTextActive: {
    color: colors.primary,
  },
  summaryLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  summaryName: {
    flex: 1,
    color: colors.foreground,
  },
  summaryPrice: {
    color: colors.foreground,
    fontWeight: "800",
  },
  totalLine: {
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    color: colors.foreground,
    fontWeight: "900",
  },
  totalValue: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 16,
  },
});
