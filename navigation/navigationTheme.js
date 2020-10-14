import { DefaultTheme } from "@react-navigation/native";
import { Platform } from "react-native";

import colors from "../config/colors";

const lightTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.black,
    background: colors.white,
    border: colors.white,
  },
};

const darkTheme = {
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    card: Platform.OS === "ios" ? colors.black : colors.dark,
    border: colors.black,
    primary: colors.white,
    background: colors.black,
    text: colors.white,
  },
};

export { lightTheme, darkTheme };
