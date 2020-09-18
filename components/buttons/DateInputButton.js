import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import AppText from "../AppText";
import colors from "../../config/colors";
import ButtonIcon from "./ButtonIcon";

const DateInputButton = ({ buttonName, iconName, fillInToday = false }) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let year = date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };

  let initialName;
  let initialDate;

  const [showCancel, setShowCancel] = useState(false);

  if (fillInToday) {
    initialName = `${buttonName}: ${formatDate(new Date())}`;
    initialDate = new Date();
  } else {
    initialName = buttonName;
  }

  const [date, setDate] = useState(initialDate);
  const [show, setShow] = useState(false);
  const [text, setText] = useState(`${initialName}`);

  const onChange = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const toggleDatepicker = () => {
    if (!date) {
      setDate(new Date());
    }
    if (show) {
      setShow(false);
      setText(`${buttonName}: ${formatDate(date)}`);
      setShowCancel(true);
    } else {
      setText("Tap here when selected");
      setShow(true);
      setShowCancel(true);
    }
  };

  const cancelInput = () => {
    setShow(false);
    setText(`${buttonName}`);
    setDate(null);
    setShowCancel(false);
  };

  return (
    <View>
      <View style={[styles.button, { width: buttonWidth }]}>
        <TouchableOpacity onPress={toggleDatepicker}>
          <View style={[styles.textBox, { width: buttonWidth * 0.8 }]}>
            <ButtonIcon name={iconName} />
            <AppText>{text}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={cancelInput}>
            <ButtonIcon name="cancel" />
          </TouchableOpacity>
        )}
      </View>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

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
  textBox: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default DateInputButton;
