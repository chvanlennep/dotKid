import React from "react";
import { Text, useColorScheme } from "react-native";

import defaultStyles from "../config/styles";
import colors from "../config/colors";

function AppText({ children, style, ...props }) {
  const scheme = useColorScheme();
  let colorStyle = { color: scheme === "dark" ? colors.white : colors.black };
  if (style) {
    style.color ? (colorStyle = { color: style.color }) : null;
  }
  return (
    <Text {...props} style={[defaultStyles.text, style, colorStyle]}>
      {children}
    </Text>
  );
}

export default AppText;
