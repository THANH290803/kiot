import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { categoryGroups } from "../data/catalog";
import { colors } from "../theme/colors";

type CategoriesScreenProps = {
  initialCategory: string;
  onBack?: () => void;
  onShopPress: (category: string, productType: string) => void;
};

export function CategoriesScreen({
  initialCategory,
  onBack,
  onShopPress,
}: CategoriesScreenProps) {
  const [activeCategory, setActiveCategory] = useState(
    categoryGroups.some((group) => group.category === initialCategory)
      ? initialCategory
      : categoryGroups[0]?.category || "Nam",
  );
  const activeGroup =
    categoryGroups.find((group) => group.category === activeCategory) || categoryGroups[0];

  return (
    <View style={styles.fullScreen}>
      <View style={styles.topbar}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </Pressable>
        )}
        <View style={styles.topbarText}>
          <Text style={styles.title}>Danh mục</Text>
          <Text style={styles.subtitle}>Duyệt sản phẩm theo nhóm</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.audienceTabs}>
          {categoryGroups.map((group) => {
            const active = group.category === activeCategory;

            return (
              <Pressable
                key={group.category}
                style={[styles.audienceTab, active && styles.audienceTabActive]}
                onPress={() => setActiveCategory(group.category)}
              >
                <Text style={[styles.audienceTabText, active && styles.audienceTabTextActive]}>
                  {group.category}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          style={styles.allCard}
          onPress={() => onShopPress(activeGroup.category, "Tất cả")}
        >
          <View style={styles.allTextBlock}>
            <Text style={styles.allTitle}>Tất cả {activeGroup.category}</Text>
            <Text style={styles.allMeta}>{activeGroup.count} sản phẩm</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>

        <View style={styles.typeGrid}>
          {activeGroup.types.map(({ type, count }) => (
            <Pressable
              key={type}
              style={styles.typeCard}
              onPress={() => onShopPress(activeGroup.category, type)}
            >
              <Text numberOfLines={1} style={styles.typeTitle}>
                {type}
              </Text>
              <Text style={styles.typeMeta}>{count} sản phẩm</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topbar: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  topbarText: {
    flex: 1,
  },
  title: {
    color: colors.foreground,
    fontSize: 22,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 2,
    color: colors.muted,
    fontWeight: "600",
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  audienceTabs: {
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    flexDirection: "row",
    gap: 4,
  },
  audienceTab: {
    flex: 1,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  audienceTabActive: {
    backgroundColor: colors.primary,
  },
  audienceTabText: {
    color: colors.muted,
    fontWeight: "800",
  },
  audienceTabTextActive: {
    color: colors.surface,
  },
  allCard: {
    marginTop: 16,
    minHeight: 72,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  allTextBlock: {
    flex: 1,
  },
  allTitle: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "900",
  },
  allMeta: {
    marginTop: 3,
    color: colors.muted,
    fontWeight: "700",
  },
  typeGrid: {
    marginTop: 14,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  typeCard: {
    width: "48%",
    minHeight: 88,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    justifyContent: "space-between",
  },
  typeTitle: {
    color: colors.foreground,
    fontSize: 16,
    fontWeight: "900",
  },
  typeMeta: {
    marginTop: 3,
    color: colors.muted,
    fontWeight: "700",
  },
});
