import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useFormikContext } from "formik";

import AppText from "../AppText";
import colors from "../../config/colors";
import defaultStyles from "../../config/styles";

const SubmitButton = ({ name = "Submit", kind, style }) => {
  const { handleSubmit } = useFormikContext();
  return (
    <TouchableOpacity onPress={handleSubmit}>
      <View
        style={[
          styles.submitButton,
          {
            backgroundColor:
              kind === "child" ? colors.primary : colors.secondary,
          },
          style,
        ]}
      >
        <AppText style={{ color: colors.white }}>{name}</AppText>
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
    ...defaultStyles.container,
  },
});
