import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.formSection}>
      <Text style={styles.formTitle}>{title}</Text>
      <View style={styles.formBody}>{children}</View>
    </View>
  );
}

export function Field({ placeholder, value }: { placeholder: string; value: string }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{placeholder}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 14,
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
    gap: 10,
  },
  field: {
    minHeight: 54,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  fieldLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  fieldValue: {
    color: colors.foreground,
    fontWeight: "700",
  },
});
