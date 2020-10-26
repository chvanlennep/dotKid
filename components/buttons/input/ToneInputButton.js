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

const ToneInputButton = ({ global = false, name = "tone" }) => {
  const [showInput, setShowInput] = useState(false);
  const [buttonText, setButtonText] = useState("Tone");
  const [showCancel, setShowCancel] = useState(false);
  const [localTone, setLocalTone] = useState("");

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

  const toggleInput = () => {
    if (showInput) {
      setShowInput(false);
      if (localTone) {
        setButtonText(`Tone: ${localTone}`);
        setShowCancel(true);
        if (!global) {
          setFieldValue(name, localTone);
        }
      } else {
        setButtonText(`Tone`);
        setShowCancel(false);
      }
    } else {
      if (!localTone) {
        setLocalTone("Good Tone");
      }
      setShowInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText("Tone");
    setShowInput(false);
    setLocalTone("");
    if (!global) {
      setFieldValue(name, "");
    }
    setShowCancel(false);
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && localTone && !showInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowInput(false);
          setShowCancel(false);
          setButtonText("Tone");
          setLocalTone("");
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
              <ButtonIcon name="human-handsdown" />
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
                setLocalTone(itemValue);
              }}
              selectedValue={localTone}
            >
              <Picker.Item label="Floppy" value="Floppy" />
              <Picker.Item label="Poor Tone" value="Poor Tone" />
              <Picker.Item label="Good Tone" value="Good Tone" />
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

export default ToneInputButton;

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
