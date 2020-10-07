import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, TouchableOpacity, TextInput } from "react-native";
import { useFormikContext } from "formik";
import { GlobalStateContext } from "../../GlobalStateContext";

import colors from "../../../config/colors";
import defaultStyles from "../../../config/styles";
import ButtonIcon from "../ButtonIcon";
import AppText from "../../AppText";
import ErrorMessage from "../../ErrorMessage";

// Must be a child of AppForm and GlobalStateContext
// If global is set to false, values are only managed by Formik and not written to global state
const NumberInputButton = ({
  global = true,
  kind,
  iconName,
  name,
  unitsOfMeasurement,
  userLabel,
}) => {
  const [showTextInput, setShowTextInput] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [buttonText, setButtonText] = useState(`${userLabel}`);
  const [localNumber, setLocalNumber] = useState("");
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const { setFieldValue, errors, touched, values } = useFormikContext();

  const manageStats = {
    read: function (kind, measurementType) {
      return globalStats[kind][measurementType];
    },
    write: function (kind, measurementType, value) {
      if (kind === "child") {
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          child[measurementType] = value;
          return { child, neonate };
        });
      } else if (kind === "neonate")
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          neonate[measurementType] = value;
          return { child, neonate };
        });
    },
  };

  const cancelInput = () => {
    setShowTextInput(false);
    setButtonText(`${userLabel}`);
    setShowCancel(false);
    setFieldValue(name, "");
    if (global) {
      manageStats.write(kind, name, "");
    }
    setLocalNumber("");
  };

  const toggleTextInput = () => {
    if (showTextInput) {
      if (localNumber) {
        const convertCommas = localNumber.replace(/,/g, ".");
        const numberToSubmit = convertCommas.replace(/[^0-9.]/g, "");
        setButtonText(`${userLabel}: ${numberToSubmit}${unitsOfMeasurement}`);
        setShowCancel(true);
        setFieldValue(name, numberToSubmit);
        if (global) {
          manageStats.write(kind, name, numberToSubmit);
        }
      }
      setShowTextInput(false);
    } else {
      setShowTextInput(true);
    }
  };

  useEffect(() => {
    let globalNumber;
    // button has been filled in by user:
    if (showCancel && localNumber && !showTextInput) {
      // Reset by formik:
      if (!values[name]) {
        setShowTextInput(false);
        setShowCancel(false);
        setButtonText(`${userLabel}`);
        manageStats.write(kind, name, "");
        setLocalNumber("");
      }
      if (global) {
        globalNumber = manageStats.read(kind, name);
        // Reset via global state:
        if (!globalNumber) {
          setShowCancel(false);
          setButtonText(`${userLabel}`);
          setLocalNumber("");
          setFieldValue(name, "");
        }
        // value changed by global state (must put no show picker / input otherwise value stuck):
        if (globalNumber && globalNumber !== localNumber) {
          setFieldValue(name, globalNumber);
          setLocalNumber(globalNumber);
          setButtonText(`${userLabel}: ${globalNumber}${unitsOfMeasurement}`);
        }
      }
    }
    if (global) {
      globalNumber = manageStats.read(kind, name);
      // button has not been filled in by user:
      if (!showCancel && !localNumber && !showTextInput) {
        // value updated via global state:
        if (globalNumber) {
          setFieldValue(name, globalNumber);
          setLocalNumber(globalNumber);
          setButtonText(`${userLabel}: ${globalNumber}${unitsOfMeasurement}`);
          setShowCancel(true);
        }
      }
    }
  });

  return (
    <>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleTextInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name={iconName} />
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
      {showTextInput && (
        <View style={styles.inputBox}>
          <TextInput
            style={[
              defaultStyles.text,
              defaultStyles.container,
              { color: colors.white },
            ]}
            onChangeText={(text) => {
              setShowCancel(true);
              setLocalNumber(text);
            }}
            value={localNumber}
            clearTextOnFocus={true}
            keyboardType={"decimal-pad"}
            placeholder={`Enter here (in ${unitsOfMeasurement})`}
            placeholderTextColor={colors.white}
            multiline={false}
            textAlignVertical="top"
            onBlur={toggleTextInput}
            returnKeyType="done"
          />
        </View>
      )}
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default NumberInputButton;

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.container,
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
    width: defaultStyles.container.width - 55,
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
    ...defaultStyles.container,
  },
});
