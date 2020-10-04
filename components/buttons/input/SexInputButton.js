import React, { useState, useEffect, useContext } from "react";
import {
  Platform,
  StyleSheet,
  useWindowDimensions,
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

const SexInputButton = ({ global = false, kind, name = "sex" }) => {
  const [showSexInput, setShowSexInput] = useState(false);
  const [buttonText, setButtonText] = useState("Sex");
  const [showCancel, setShowCancel] = useState(false);
  const [localSex, setLocalSex] = useState("");

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();

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

  const globalSex = manageStats.read(kind, "sex");

  const toggleSexInput = () => {
    if (showSexInput) {
      setShowSexInput(false);
      if (localSex) {
        setButtonText(`Sex: ${localSex}`);
        setShowCancel(true);
        if (!global) {
          setFieldValue(name, localSex);
        }
        manageStats.write(kind, "sex", localSex);
      } else {
        setButtonText(`Sex`);
        setShowCancel(false);
      }
    } else {
      if (!localSex) {
        setLocalSex("Male");
      }
      setShowSexInput(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setButtonText("Sex");
    setShowSexInput(false);
    setLocalSex("");
    if (!global) {
      setFieldValue(name, "");
    }
    manageStats.write(kind, "sex", "");
    setShowCancel(false);
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && localSex && !showSexInput) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowSexInput(false);
          setShowCancel(false);
          setButtonText("Sex");
          manageStats.write(kind, "sex", "");
          setLocalSex("");
        }
      }
      // Reset via global state:
      if (!globalSex) {
        setShowSexInput(false);
        setShowCancel(false);
        setButtonText("Sex");
        setLocalSex("");
        if (!global) {
          setFieldValue(name, "");
        }
      }
      // value changed by global state (must put no show picker / input otherwise value stuck):
      if (globalSex && globalSex !== localSex) {
        if (!global) {
          setFieldValue(name, globalSex);
        }
        setLocalSex(globalSex);
        setButtonText(`Sex: ${globalSex}`);
      }
    }
    // button has not been filled in by user:
    if (!showCancel && !localSex && !showSexInput) {
      // value updated via global state:
      if (globalSex) {
        if (!global) {
          setFieldValue(name, globalSex);
        }
        setLocalSex(globalSex);
        setButtonText(`Sex: ${globalSex}`);
        setShowCancel(true);
      }
    }
  });

  return (
    <>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleSexInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="all-inclusive" />
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
      {showSexInput && (
        <>
          <View
            style={
              Platform.OS === "ios"
                ? [
                    styles.iosPickerContainer,
                    {
                      backgroundColor:
                        scheme === "dark" ? colors.light : colors.white,
                    },
                  ]
                : styles.androidPickerContainer
            }
          >
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocalSex(itemValue);
              }}
              selectedValue={localSex}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleSexInput}>
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
    ...defaultStyles.container,
  },
  buttonTextBox: {
    flexDirection: "row",
    alignItems: "center",
    width: defaultStyles.container.width - 55,
  },
  picker: {
    height: 200,
    width: 280,
  },
  androidPickerContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  iosPickerContainer: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderRadius: 5,
    ...defaultStyles.container,
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
    ...defaultStyles.container,
  },
});
