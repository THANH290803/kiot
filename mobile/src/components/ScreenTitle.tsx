import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function ScreenTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.screenTitleBlock}>
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.screenSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screenTitleBlock: {
    marginBottom: 18,
  },
  screenTitle: {
    color: colors.foreground,
    fontSize: 28,
    fontWeight: "900",
  },
  screenSubtitle: {
    color: colors.muted,
    marginTop: 5,
  },
});
