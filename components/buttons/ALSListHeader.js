import React from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";

import colors from "../../config/colors";
import AppText from "../AppText";

const ALSDisplayButton = ({ title, style, onPress }) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.button, style]}>
        <AppText style={styles.text}>{title}</AppText>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ALSDisplayButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    justifyContent: "center",
    margin: 5,
    padding: 10,
    width: "100%",
    backgroundColor: colors.dark,
    alignSelf: "center",
  },
  text: {
    color: colors.white,
    fontWeight: "500",
  },
});
