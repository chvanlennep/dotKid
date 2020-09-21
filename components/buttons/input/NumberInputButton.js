import React, { useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import colors from "../../../config/colors";
import globalStyles from "../../../config/styles";
import ButtonIcon from "../ButtonIcon";
import AppText from "../../AppText";

const NumberInputButton = ({
  iconName,
  name,
  userLabel,
  unitsOfMeasurement,
  value,
  setValue,
}) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const textInputValue = value;
  const setTextInputValue = setValue;

  const [showTextInput, setShowTextInput] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [buttonText, setButtonText] = useState(`${userLabel}`);

  const cancelInput = () => {
    setShowTextInput(false);
    setButtonText(`${userLabel}`);
    setShowCancel(false);
    setTextInputValue(null);
  };

  const toggleTextInput = () => {
    if (showTextInput) {
      // only if onBlur() isn't activated, therefore textInputValue must be null
      cancelInput();
    } else {
      userLabel === "Head Circumference"
        ? setButtonText(`Enter HC below (in ${unitsOfMeasurement})`)
        : setButtonText(`Enter ${userLabel} below (in ${unitsOfMeasurement}):`);
      setShowTextInput(true);
      setShowCancel(true);
    }
  };

  return (
    <>
      <View>
        <View style={[styles.button, { width: buttonWidth }]}>
          <TouchableOpacity onPress={toggleTextInput}>
            <View style={[styles.buttonTextBox, { width: buttonWidth - 55 }]}>
              <ButtonIcon name={iconName} />
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
      {showTextInput && (
        <View style={[styles.inputBox, { width: buttonWidth }]}>
          <TextInput
            style={[
              globalStyles.text,
              { color: colors.white },
              { width: buttonWidth },
            ]}
            onChangeText={(text) => {
              setTextInputValue(text);
              setShowCancel(true);
            }}
            value={textInputValue}
            clearTextOnFocus={true}
            keyboardType={"decimal-pad"}
            placeholder="Enter here"
            placeholderTextColor={colors.white}
            multiline={false}
            textAlignVertical="top"
            onBlur={() => {
              if (textInputValue) {
                setButtonText(
                  `${userLabel}: ${textInputValue}${unitsOfMeasurement}`
                );
              } else {
                setButtonText(`${userLabel}`);
                setShowCancel(false);
              }
              setShowTextInput(false);
            }}
          />
        </View>
      )}
    </>
  );
};

export default NumberInputButton;

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
  inputBox: {
    alignItems: "center",
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.dark,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
  },
});
