import React, { useState, useEffect, useContext } from "react";
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { useFormikContext } from "formik";

import colors from "../../../config/colors";
import defaultStyles from "../../../config/styles";
import ButtonIcon from "../ButtonIcon";
import AppText from "../../AppText";
import ErrorMessage from "../../ErrorMessage";
import { GlobalStateContext } from "../../GlobalStateContext";

const BreathingInputButton = ({ global = false, name = "breathing" }) => {
  const [showInput, setShowInput] = useState(false);
  const [buttonText, setButtonText] = useState("Breathing");
  const [showCancel, setShowCancel] = useState(false);
  const [localBreathing, setLocalBreathing] = useState("");

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (localBreathing) {
        setButtonText(`Breathing: ${localBreathing}`);
        setShowCancel(true);
        if (!global) {
          setFieldValue(name, localBreathing);
        }
      } else {
        setButtonText(`Breathing`);
        setShowCancel(false);
      }
    } else {
      if (!localBreathing) {
        setLocalBreathing("Adequate Breathing");
      }
      setShowInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText("Breathing");
    setShowInput(false);
    setLocalBreathing("");
    if (!global) {
      setFieldValue(name, "");
    }
    setShowCancel(false);
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && localBreathing && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowInput(false);
          setShowCancel(false);
          setButtonText("Breathing");
          setLocalBreathing("");
        }
      }
    }
  });

  return (
    <>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="weather-windy" />
              <AppText style={{ color: colors.white }}>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="delete-forever" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {showInput && (
        <>
          <View
            style={
              scheme === "dark"
                ? styles.darkPickerContainer
                : styles.lightPickerContainer
            }
          >
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocalBreathing(itemValue);
              }}
              selectedValue={localBreathing}
            >
              <Picker.Item label="Apnoeic" value="Apnoeic" />
              <Picker.Item
                label="Inadequate Breathing"
                value="Inadequate Breathing"
              />
              <Picker.Item
                label="Adequate Breathing"
                value="Adequate Breathing"
              />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleInput}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default BreathingInputButton;

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
    width: Dimensions.get("window").width * 0.85,
  },
  buttonTextBox: {
    flexDirection: "row",
    alignItems: "center",
    width: Dimensions.get("window").width * 0.85,
  },
  picker: {
    height: 200,
    width: 280,
  },
  lightPickerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.85,
  },
  darkPickerContainer: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderRadius: 5,
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: colors.light,
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
    width: Dimensions.get("window").width * 0.85,
  },
});
