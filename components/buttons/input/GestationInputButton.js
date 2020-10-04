import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Platform,
  View,
  useWindowDimensions,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { useFormikContext } from "formik";

import AppText from "../../AppText";
import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";
import ErrorMessage from "../../ErrorMessage";
import { GlobalStateContext } from "../../GlobalStateContext";
import defaultStyles from "../../../config/styles";

const GestationInputButton = ({
  global = false,
  kind,
  name = "gestationInDays",
}) => {
  let defaultWeeks = 40;
  let defaultDays = 0;
  let defaultGestationString = ": Term";
  let errorMessage;
  if (kind === "neonate") {
    defaultWeeks = 0;
    defaultDays = 0;
    defaultGestationString = "";
    errorMessage = true;
  }

  const [showPicker, setShowPicker] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(
    `Birth Gestation${defaultGestationString}`
  );
  const [showReset, setShowReset] = useState(false);
  const [localWeeks, setLocalWeeks] = useState(defaultWeeks);
  const [localDays, setLocalDays] = useState(defaultDays);
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, values, errors, touched } = useFormikContext();

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

  const convertGestation = (gestationInDays) => {
    return [gestationInDays % 7, Math.floor(gestationInDays / 7)];
  };

  const toggleGestPicker = () => {
    if (showPicker) {
      setShowPicker(false);
      manageStats.write(kind, "gestationInDays", localWeeks * 7 + localDays);
      if (!global) {
        setFieldValue(name, localWeeks * 7 + localDays);
      }
      if (localWeeks === 40 && localDays === 0 && kind === "child") {
        setButtonLabel("Birth Gestation: Term");
      } else {
        setShowReset(true);
        setButtonLabel(`Birth Gestation: ${localWeeks}+${localDays}`);
      }
    } else {
      if (!localWeeks) {
        setLocalWeeks(37);
        setLocalDays(0);
      }
      setShowPicker(true);
    }
  };

  const resetInput = () => {
    setShowPicker(false);
    setButtonLabel(
      kind === "neonate" ? "Birth Gestation" : `Birth Gestation: Term`
    );
    setLocalWeeks(defaultWeeks);
    setLocalDays(defaultDays);
    manageStats.write(kind, "gestationInDays", defaultWeeks * 7 + defaultDays);
    if (!global) {
      setFieldValue(name, defaultWeeks * 7 + defaultDays);
    }
    setShowReset(false);
  };

  useEffect(() => {
    const localGestationInDays = localWeeks * 7 + localDays;
    const defaultGestationInDays = defaultWeeks * 7 + defaultDays;
    const globalGestation = manageStats.read(kind, "gestationInDays");
    const [gestationDays, gestationWeeks] = convertGestation(globalGestation);
    // button has been filled in by user:
    if (showReset && localGestationInDays !== defaultGestationInDays) {
      if (!global) {
        // Reset by formik:
        if (values[name] === defaultGestationInDays) {
          setShowPicker(false);
          setShowReset(false);
          setButtonLabel(
            kind === "neonate" ? "Birth Gestation" : `Birth Gestation: Term`
          );
          setLocalWeeks(defaultWeeks);
          setLocalDays(defaultDays);
          kind === "neonate"
            ? manageStats.write(kind, "gestationInDays", 0)
            : manageStats.write(kind, "gestationInDays", 280);
        }
      }
      // Reset via global state:
      if (globalGestation === defaultGestationInDays) {
        setShowPicker(false);
        setShowReset(false);
        setButtonLabel(
          kind === "neonate" ? "Birth Gestation" : `Birth Gestation: Term`
        );
        setLocalWeeks(defaultWeeks);
        setLocalDays(defaultDays);
        if (!global) {
          kind === "neonate"
            ? setFieldValue(name, 0)
            : setFieldValue(name, 280);
        }
      }
      // value changed by global state (must put no show picker otherwise value stuck):
      if (
        globalGestation !== localGestationInDays &&
        globalGestation !== defaultGestationInDays &&
        !showPicker
      ) {
        if (!global) {
          setFieldValue(name, globalGestation);
        }
        if (gestationWeeks === 40 && gestationDays === 0 && kind === "child") {
          setButtonLabel("Birth Gestation: Term");
          setShowReset(false);
        } else {
          setButtonLabel(`Birth Gestation: ${gestationWeeks}+${gestationDays}`);
        }
        setLocalWeeks(gestationWeeks);
        setLocalDays(gestationDays);
      }
    }
    // button has not been filled in by user:
    if (!showReset && localGestationInDays === defaultGestationInDays) {
      // value updated via global state:
      if (globalGestation !== localGestationInDays) {
        if (!global) {
          setFieldValue(name, globalGestation);
        }
        setLocalWeeks(gestationWeeks);
        setLocalDays(gestationDays);
        if (gestationWeeks === 40 && gestationDays === 0 && kind === "child") {
          setButtonLabel("Birth Gestation: Term");
        } else {
          setButtonLabel(`Birth Gestation: ${gestationWeeks}+${gestationDays}`);
          setShowReset(true);
        }
      }
    }
  });

  return (
    <>
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleGestPicker}>
          <View style={styles.textBox}>
            <ButtonIcon name="human-pregnant" />
            <AppText style={{ color: colors.white }}>{buttonLabel}</AppText>
          </View>
        </TouchableOpacity>
        {showReset && (
          <TouchableOpacity onPress={resetInput}>
            <ButtonIcon
              name={kind === "neonate" ? "delete-forever" : "refresh"}
            />
          </TouchableOpacity>
        )}
      </View>
      {showPicker && (
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
                setLocalWeeks(itemValue);
              }}
              selectedValue={localWeeks}
            >
              <Picker.Item label="23" value={23} />
              <Picker.Item label="24" value={24} />
              <Picker.Item label="25" value={25} />
              <Picker.Item label="26" value={26} />
              <Picker.Item label="27" value={27} />
              <Picker.Item label="28" value={28} />
              <Picker.Item label="29" value={29} />
              <Picker.Item label="30" value={30} />
              <Picker.Item label="31" value={31} />
              <Picker.Item label="32" value={32} />
              <Picker.Item label="33" value={33} />
              <Picker.Item label="34" value={34} />
              <Picker.Item label="35" value={35} />
              <Picker.Item label="36" value={36} />
              <Picker.Item label="37" value={37} />
              <Picker.Item label="38" value={38} />
              <Picker.Item label="39" value={39} />
              <Picker.Item label="40" value={40} />
              <Picker.Item label="41" value={41} />
              <Picker.Item label="42" value={42} />
            </Picker>
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocalDays(itemValue);
              }}
              selectedValue={localDays}
            >
              <Picker.Item label="0" value={0} />
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
              <Picker.Item label="6" value={6} />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleGestPicker}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        </>
      )}
      {errorMessage && (
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      )}
    </>
  );
};

export default GestationInputButton;

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
  picker: {
    height: 200,
    width: 150,
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
    borderRadius: 5,
    ...defaultStyles.container,
  },
  submitButton: {
    ...defaultStyles.container,
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
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    width: defaultStyles.container.width - 55,
  },
});
