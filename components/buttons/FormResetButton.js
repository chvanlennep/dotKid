import React from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useFormikContext } from "formik";

import AppText from "../AppText";
import colors from "../../config/colors";
import defaultStyles from "../../config/styles";

const SubmitButton = ({ name = "Reset..." }) => {
  const { handleReset } = useFormikContext();

  const handleResetAlert = () => {
    Alert.alert("Are you sure you want to reset?", "", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => handleReset(),
      },
      { cancelable: false },
    ]);
  };

  return (
    <TouchableOpacity onPress={handleResetAlert}>
      <View style={styles.submitButton}>
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
    backgroundColor: colors.medium,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: "center",
    ...defaultStyles.container,
  },
});
