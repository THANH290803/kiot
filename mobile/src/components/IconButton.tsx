import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";
import { IconName } from "../types";

export function IconButton({ name }: { name: IconName }) {
  return (
    <View style={styles.iconButton}>
      <Ionicons name={name} size={22} color={colors.foreground} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
