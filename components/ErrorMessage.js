import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import AppText from "./AppText";

function ErrorMessage({ error, visible }) {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  if (!visible || !error) return null;

  return (
    <View style={[styles.container, { width: buttonWidth }]}>
      <AppText style={styles.error}>{error}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
  },
  error: { color: "red", textAlign: "center" },
});

export default ErrorMessage;
