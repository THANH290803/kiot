import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconName, TabKey } from "../types";

type BottomTabsProps = {
  activeTab: TabKey;
  cartCount: number;
  onChange: (tab: TabKey) => void;
};

const tabs: Array<{ key: TabKey; label: string; icon: IconName }> = [
  { key: "home", label: "Trang chủ", icon: "home-outline" },
  { key: "categories", label: "Danh mục", icon: "grid-outline" },
  { key: "shop", label: "Cửa hàng", icon: "storefront-outline" },
  { key: "cart", label: "Giỏ hàng", icon: "bag-outline" },
  { key: "account", label: "Tài khoản", icon: "person-outline" },
];

export function BottomTabs({ activeTab, cartCount, onChange }: BottomTabsProps) {
  return (
    <View style={styles.tabs}>
      {tabs.map((tab) => {
        const active = tab.key === activeTab;

        return (
          <Pressable key={tab.key} style={styles.tabItem} onPress={() => onChange(tab.key)}>
            <View>
              <Ionicons name={tab.icon} size={22} color={active ? colors.primary : colors.muted} />
              {tab.key === "cart" && cartCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    height: 74,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
  },
  tabItem: {
    width: 68,
    alignItems: "center",
    gap: 4,
  },
  tabText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabBadge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.sale,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.surface,
    fontSize: 11,
    fontWeight: "800",
  },
});
