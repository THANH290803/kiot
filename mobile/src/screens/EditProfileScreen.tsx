import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { addressOptions } from "../data/address-options";
import { colors } from "../theme/colors";
import { UserProfile } from "../types";

type EditProfileScreenProps = {
  profile: UserProfile;
  onBack: () => void;
  onSave: (profile: UserProfile) => void;
};

export function EditProfileScreen({ profile, onBack, onSave }: EditProfileScreenProps) {
  const [form, setForm] = useState<UserProfile>(profile);
  const [picker, setPicker] = useState<null | "province" | "district" | "ward">(null);

  const selectedProvince = useMemo(
    () => addressOptions.find((province) => province.name === form.province),
    [form.province],
  );
  const districtOptions = selectedProvince?.districts ?? [];
  const selectedDistrict = useMemo(
    () => districtOptions.find((district) => district.name === form.district),
    [districtOptions, form.district],
  );
  const wardOptions = selectedDistrict?.wards ?? [];

  const pickerOptions = useMemo(() => {
    if (picker === "province") {
      return addressOptions.map((province) => province.name);
    }

    if (picker === "district") {
      return districtOptions.map((district) => district.name);
    }

    if (picker === "ward") {
      return wardOptions.map((ward) => ward.name);
    }

    return [];
  }, [districtOptions, picker, wardOptions]);

  const updateField = (field: keyof UserProfile, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: field === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value,
    }));
  };

  const closePicker = () => {
    setPicker(null);
  };

  const handleCancel = () => {
    closePicker();
    setForm(profile);
    onBack();
  };

  const handlePickAddress = (value: string) => {
    if (picker === "province") {
      const province = addressOptions.find((item) => item.name === value);
      const firstDistrict = province?.districts[0];
      const firstWard = firstDistrict?.wards[0];

      setForm((current) => ({
        ...current,
        province: value,
        district: firstDistrict?.name || "",
        ward: firstWard?.name || "",
      }));
    }

    if (picker === "district") {
      const district = districtOptions.find((item) => item.name === value);
      const firstWard = district?.wards[0];

      setForm((current) => ({
        ...current,
        district: value,
        ward: firstWard?.name || "",
      }));
    }

    if (picker === "ward") {
      setForm((current) => ({
        ...current,
        ward: value,
      }));
    }

    closePicker();
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.topbar}>
        <Pressable onPress={handleCancel} style={styles.iconButton}>
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.topbarTitleWrap}>
          <Text style={styles.topbarTitle}>Chỉnh sửa hồ sơ</Text>
          <Text style={styles.topbarSubtitle}>Cập nhật thông tin tài khoản</Text>
        </View>
        <View style={styles.topbarSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(form.name)}</Text>
          </View>
          <Pressable style={styles.avatarButton}>
            <Ionicons name="camera-outline" size={18} color={colors.primary} />
            <Text style={styles.avatarButtonText}>Đổi ảnh</Text>
          </Pressable>
        </View>

        <FormCard title="Thông tin cá nhân">
          <InputField
            label="Tên đầy đủ"
            value={form.name}
            placeholder="Nhập tên đầy đủ"
            onChangeText={(value) => updateField("name", value)}
          />
          <InputField
            label="Email"
            value={form.email}
            placeholder="Nhập email"
            keyboardType="email-address"
            onChangeText={(value) => updateField("email", value)}
          />
          <InputField
            label="Số điện thoại"
            value={form.phone}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
            onChangeText={(value) => updateField("phone", value)}
          />
        </FormCard>

        <FormCard title="Địa chỉ giao hàng">
          <SelectField
            label="Tỉnh/Thành"
            value={form.province}
            placeholder="Chọn tỉnh/thành"
            onPress={() => setPicker("province")}
          />
          <SelectField
            label="Quận/Huyện"
            value={form.district}
            placeholder="Chọn quận/huyện"
            disabled={!form.province}
            onPress={() => setPicker("district")}
          />
          <SelectField
            label="Phường/Xã"
            value={form.ward}
            placeholder="Chọn phường/xã"
            disabled={!form.district}
            onPress={() => setPicker("ward")}
          />
          <InputField
            label="Địa chỉ chi tiết"
            value={form.detailAddress}
            placeholder="Số nhà, tên đường"
            multiline
            onChangeText={(value) => updateField("detailAddress", value)}
          />
        </FormCard>
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
                  option === form.province || option === form.district || option === form.ward;

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

      <View style={styles.actionBar}>
        <Pressable style={styles.secondaryButton} onPress={handleCancel}>
          <Text style={styles.secondaryButtonText}>Hủy</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => onSave(form)}>
          <Text style={styles.primaryButtonText}>Lưu thay đổi</Text>
        </Pressable>
      </View>
    </View>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>{title}</Text>
      <View style={styles.formBody}>{children}</View>
    </View>
  );
}

function InputField({
  label,
  value,
  placeholder,
  keyboardType,
  multiline,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  multiline?: boolean;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        style={[styles.input, multiline && styles.multilineInput]}
      />
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

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "PT";
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
    paddingBottom: 112,
  },
  avatarBlock: {
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.surface,
    fontWeight: "900",
    fontSize: 22,
  },
  avatarButton: {
    marginTop: 10,
    height: 36,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.primarySoft,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarButtonText: {
    color: colors.primary,
    fontWeight: "900",
  },
  formCard: {
    marginTop: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  formTitle: {
    color: colors.foreground,
    fontWeight: "900",
    fontSize: 17,
    marginBottom: 12,
  },
  formBody: {
    gap: 12,
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
  multilineInput: {
    minHeight: 76,
    paddingTop: 12,
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
  actionBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 78,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: colors.foreground,
    fontWeight: "900",
  },
  primaryButton: {
    flex: 1.4,
    height: 46,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "900",
  },
});
