import React, { useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-community/picker";

import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";
import AppText from "../../AppText";

const SexInputButton = ({ name, value, setValue }) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const sex = value;
  const setSex = setValue;

  const [showSexInput, setShowSexInput] = useState(false);
  const [buttonText, setButtonText] = useState("Sex");
  const [showCancel, setShowCancel] = useState(false);

  const toggleSexInput = () => {
    if (showSexInput) {
      setShowSexInput(false);
      sex ? setButtonText(`Sex: ${sex}`) : setButtonText("Sex");
    } else {
      setShowSexInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText("Sex");
    setShowSexInput(false);
    setSex(null);
    setShowCancel(false);
  };

  return (
    <>
      <View>
        <View style={[styles.button, { width: buttonWidth }]}>
          <TouchableOpacity onPress={toggleSexInput}>
            <View style={[styles.buttonTextBox, { width: buttonWidth - 55 }]}>
              <ButtonIcon name="all-inclusive" />
              <AppText>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="delete-forever" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showSexInput && (
        <>
          <Picker
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => {
              setSex(itemValue);
            }}
            selectedValue={sex}
          >
            <Picker.Item label="Not Selected" value={null} />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
          <TouchableOpacity onPress={toggleSexInput}>
            <View style={[styles.submitButton, { width: buttonWidth }]}>
              <AppText>Submit</AppText>
            </View>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default SexInputButton;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
  },
  buttonTextBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  picker: {
    height: 200,
    width: 280,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: "center",
  },
});
