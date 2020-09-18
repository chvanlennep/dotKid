import React, { useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  TouchableOpacity,
} from "react-native";

import colors from "../../config/colors";
import ButtonIcon from "./ButtonIcon";
import AppText from "../AppText";

const SexInputButton = () => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const [showSexInput, setShowSexInput] = useState(false);
  const [selectedMale, setSelectedMale] = useState(false);
  const [selectedFemale, setSelectedFemale] = useState(false);
  const [buttonText, setButtonText] = useState("Sex");
  const [showCancel, setShowCancel] = useState(false);
  const [sex, setSex] = useState(null);

  const toggleSexInput = () => {
    if (showSexInput) {
      setShowSexInput(false);
      sex ? setButtonText(`Sex: ${sex}`) : setButtonText("Sex");
    } else {
      setButtonText("Tap here when entered");
      setShowSexInput(true);
    }
  };

  const handleSelection = (sex) => {
    if (sex === "male") {
      setSelectedFemale(false);
      setSelectedMale(true);
      setShowCancel(true);
      setSex("Male");
    } else {
      setSelectedMale(false);
      setSelectedFemale(true);
      setShowCancel(true);
      setSex("Female");
    }
  };

  const cancelInput = () => {
    setShowSexInput(false);
    setButtonText("Sex");
    setSex(null);
    setShowCancel(false);
    setSelectedFemale(false);
    setSelectedMale(false);
  };

  return (
    <>
      <View>
        <View style={[styles.button, { width: buttonWidth }]}>
          <TouchableOpacity onPress={toggleSexInput}>
            <View style={[styles.buttonTextBox, { width: buttonWidth * 0.8 }]}>
              <ButtonIcon name="all-inclusive" />
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
      {showSexInput && (
        <TouchableOpacity onPress={() => handleSelection("male")}>
          <View style={[styles.inputBox, { width: buttonWidth }]}>
            <View style={[styles.buttonTextBox, { width: buttonWidth * 0.8 }]}>
              <AppText>Male</AppText>
              {selectedMale && (
                <ButtonIcon backgroundColor={colors.medium} name="check" />
              )}
            </View>
          </View>
        </TouchableOpacity>
      )}
      {showSexInput && (
        <TouchableOpacity onPress={() => handleSelection("female")}>
          <View style={[styles.inputBox, { width: buttonWidth }]}>
            <View style={[styles.buttonTextBox, { width: buttonWidth * 0.8 }]}>
              <AppText>Female</AppText>
              {selectedFemale && (
                <ButtonIcon backgroundColor={colors.medium} name="check" />
              )}
            </View>
          </View>
        </TouchableOpacity>
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
