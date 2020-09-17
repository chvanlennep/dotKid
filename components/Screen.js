import React from "react";
import { StyleSheet, View } from "react-native";
import Constants from "expo-constants";

import colors from "../config/colors";
import LowerNavBar from "./LowerNavBar";

const Screen = ({ children, style }) => {
  const styles = StyleSheet.create({
    screen: {
      paddingTop: Constants.statusBarHeight,
      flex: 1,
    },
    view: {
      flex: 1,
      backgroundColor: colors.white,
    },
  });
  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.screen, style]}>
        <View style={[styles.view, style]}>{children}</View>
        </View>
        </View>
    )
}

export default Screen


