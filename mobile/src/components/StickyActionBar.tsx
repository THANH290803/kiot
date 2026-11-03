import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type StickyActionBarProps = {
  label: string;
  value: string;
  action: string;
  onPress: () => void;
};

export function StickyActionBar({ label, value, action, onPress }: StickyActionBarProps) {
  return (
    <View style={styles.stickyActionBar}>
      <View>
        <Text style={styles.stickyLabel}>{label}</Text>
        <Text style={styles.stickyPrice}>{value}</Text>
      </View>
      <Pressable style={styles.primaryButton} onPress={onPress}>
        <Text style={styles.primaryButtonText}>{action}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  stickyActionBar: {
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
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  stickyLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
  stickyPrice: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "900",
  },
  primaryButton: {
    height: 46,
    minWidth: 140,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.surface,
    fontWeight: "900",
    fontSize: 14,
  },
});
