import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type OptionGroupProps = {
  label: string;
  values: string[];
  value: string;
  onChange: (value: string) => void;
};

export function OptionGroup({ label, values, value, onChange }: OptionGroupProps) {
  return (
    <View style={styles.optionGroup}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionRow}>
        {values.map((item) => (
          <Pressable
            key={item}
            onPress={() => onChange(item)}
            style={[styles.optionChip, value === item && styles.optionChipActive]}
          >
            <Text style={[styles.optionText, value === item && styles.optionTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionGroup: {
    marginTop: 20,
  },
  optionLabel: {
    color: colors.foreground,
    fontWeight: "800",
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionChip: {
    minWidth: 54,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
  },
  optionChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: {
    color: colors.foreground,
    fontWeight: "800",
  },
  optionTextActive: {
    color: colors.surface,
  },
});
