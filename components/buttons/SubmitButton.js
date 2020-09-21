import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

import AppText from "../AppText";
import colors from "../../config/colors";

const SubmitButton = ({
  onPress,
  name = "Submit",
  backgroundColor = colors.medium,
}) => {
  const buttonWidth = useWindowDimensions().width - 10;
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.submitButton,
          { width: buttonWidth },
          { backgroundColor: backgroundColor },
        ]}
      >
        <AppText>{name}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default SubmitButton;

const styles = StyleSheet.create({
  submitButton: {
    alignItems: "center",
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: "center",
  },
});
