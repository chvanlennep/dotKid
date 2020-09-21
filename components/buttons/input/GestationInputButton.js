import React, { useState } from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-community/picker";

import AppText from "../../AppText";
import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";

const GestationInputButton = ({ weeksState, daysState }) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const [showCancel, setShowCancel] = useState(true);
  const [showPicker, setShowPicker] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("Birth Gestation: Term");

  const gestationWeeks = weeksState.value;
  const setGestationWeeks = weeksState.setValue;
  const gestationDays = daysState.value;
  const setGestationDays = daysState.setValue;

  const toggleGestPicker = (name) => {
    if (showPicker) {
      setShowPicker(false);
      if (gestationWeeks >= 37 && gestationDays) {
        setButtonLabel("Birth Gestation: Term");
      } else if (!gestationWeeks || !gestationDays) {
        setButtonLabel("Birth Gestation");
        setShowCancel(false);
      } else {
        setButtonLabel(`Birth Gestation: ${gestationWeeks}+${gestationDays}`);
      }
    } else {
      setShowPicker(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setShowPicker(false);
    setButtonLabel("Birth Gestation");
    setGestationWeeks(null);
    setGestationDays(null);
    setShowCancel(false);
  };

  return (
    <>
      <View style={[styles.button, { width: buttonWidth }]}>
        <TouchableOpacity onPress={toggleGestPicker}>
          <View style={[styles.textBox, { width: buttonWidth - 55 }]}>
            <ButtonIcon name="human-pregnant" />
            <AppText>{buttonLabel}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={cancelInput}>
            <ButtonIcon name="delete-forever" />
          </TouchableOpacity>
        )}
      </View>
      {showPicker && (
        <>
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setGestationWeeks(itemValue);
              }}
              selectedValue={gestationWeeks}
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
              <Picker.Item label="Not Selected" value={null} />
            </Picker>
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setGestationDays(itemValue);
              }}
              selectedValue={gestationDays}
            >
              <Picker.Item label="0" value={0} />
              <Picker.Item label="1" value={1} />
              <Picker.Item label="2" value={2} />
              <Picker.Item label="3" value={3} />
              <Picker.Item label="4" value={4} />
              <Picker.Item label="5" value={5} />
              <Picker.Item label="6" value={6} />
              <Picker.Item label="Not Selected" value={null} />
            </Picker>
          </View>
          <TouchableOpacity onPress={toggleGestPicker}>
            <View style={[styles.submitButton, { width: buttonWidth }]}>
              <AppText>Submit</AppText>
            </View>
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default GestationInputButton;

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
  picker: {
    height: 200,
    width: 150,
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
  textBox: {
    flexDirection: "row",
    alignItems: "center",
  },
});
