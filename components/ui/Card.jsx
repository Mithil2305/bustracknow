import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette, radius, shadow, spacing } from "../../design/tokens";

/**
 * Card — generic elevated card container.
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.title]
 * @param {object} [props.style]
 */
export default function Card({ children, title, style }) {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.text,
    marginBottom: spacing.sm,
  },
});
