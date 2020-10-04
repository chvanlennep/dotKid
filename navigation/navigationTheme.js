import { DefaultTheme } from "@react-navigation/native";

import colors from "../config/colors";

const lightTheme = {
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.white,
    border: colors.white,
  },
};

const darkTheme = {
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    card: colors.black,
    border: colors.black,
    primary: colors.primary,
    background: colors.black,
    text: colors.white,
  },
};

export { lightTheme, darkTheme };
