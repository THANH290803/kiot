import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { IconButton } from "./IconButton";

type AppHeaderProps = {
  notificationCount?: number;
  onNotificationPress?: () => void;
};

export function AppHeader({ notificationCount = 0, onNotificationPress }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>ELEGANCE</Text>
        <Text style={styles.headerSubline}>Thời trang nam, nữ & trẻ em</Text>
      </View>
      <View style={styles.headerActions}>
        <IconButton name="search-outline" />
        <Pressable style={styles.iconButton} onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={22} color={colors.foreground} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 70,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0,
  },
  headerSubline: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
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
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
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
