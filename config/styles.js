import { Platform, Dimensions } from "react-native";

import colors from "./colors";

export default {
  colors,
  text: {
    fontSize: 18,
    fontFamily: Platform.OS === "ios" ? "System" : "Roboto",
  },
  container: {
    width: Dimensions.get("window").width - 10,
  },
};
