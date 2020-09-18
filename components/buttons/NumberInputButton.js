import React, { useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";

import colors from "../../config/colors";
import globalStyles from "../../config/styles";
import ButtonIcon from "./ButtonIcon";
import AppText from "../AppText";

const NumberInputButton = ({ iconName, buttonName, unitsOfMeasurement }) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const [textInputValue, setTextInputValue] = useState(
    `Enter ${buttonName} here (in ${unitsOfMeasurement})`
  );
  const [showTextInput, setShowTextInput] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [buttonText, setButtonText] = useState(`${buttonName}`);

  const toggleTextInput = () => {
    if (showTextInput) {
      textInputValue !== `Enter ${buttonName} here (in ${unitsOfMeasurement})`
        ? setButtonText(`${buttonName}: ${textInputValue}${unitsOfMeasurement}`)
        : setButtonText(`${buttonName}`);
      setShowTextInput(false);
    } else {
      setShowTextInput(true);
    }
  };
  const cancelInput = () => {
    setShowTextInput(false);
    setButtonText(`${buttonName}`);
    setTextInputValue(`Enter ${buttonName} here (in ${unitsOfMeasurement})`);
    setShowCancel(false);
  };

  return (
    <>
      <View>
        <View style={[styles.button, { width: buttonWidth }]}>
          <TouchableOpacity onPress={toggleTextInput}>
            <View style={[styles.buttonTextBox, { width: buttonWidth * 0.8 }]}>
              <ButtonIcon name={iconName} />
              <AppText>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="cancel" />
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
              { width: buttonWidth - 10 },
            ]}
            onChangeText={(text) => {
              setTextInputValue(text);
              setShowCancel(true);
            }}
            value={textInputValue}
            clearTextOnFocus={true}
            keyboardType={"decimal-pad"}
            multiline={false}
            textAlignVertical="top"
            onBlur={() => {
              textInputValue !==
              `Enter ${buttonName} here (in ${unitsOfMeasurement})`
                ? setButtonText(
                    `${buttonName}: ${textInputValue}${unitsOfMeasurement}`
                  )
                : setButtonText(`${buttonName}`);
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
