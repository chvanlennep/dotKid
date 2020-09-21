import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import AppText from "../../AppText";
import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";

const DateInputButton = ({
  userLabel,
  iconName,
  name,
  renderFilledIn = false,
  dateValue,
  setDateValue,
  timeValue = new Date(),
  setTimeValue = null,
}) => {
  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - 10;

  const formatDate = (date) => {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    let yearArray = date.getFullYear().toString().split("");
    let shortArray = [yearArray[2], yearArray[3]];
    let year = shortArray.join("");
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [day, month, year].join("/");
  };

  const formatTime = (time) => {
    let hours = "" + time.getHours();
    let workingMinutes = time.getMinutes();
    let minutes = "" + Math.floor(workingMinutes / 15) * 15;
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;
    return [hours, minutes].join(":");
  };

  const date = dateValue;
  const setDate = setDateValue;

  const time = timeValue;
  const setTime = setTimeValue;

  let initialName;

  if (date) {
    initialName = `${userLabel}: ${formatDate(date)}`;
  } else {
    initialName = userLabel;
  }

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [text, setText] = useState(`${initialName}`);
  const [showCancel, setShowCancel] = useState(renderFilledIn);

  const onChangeDate = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onChangeTime = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(Platform.OS === "ios");
    setTime(currentTime);
  };

  const togglePicker = () => {
    if (setDate && setTime) {
      if (!date && !time) {
        setDate(new Date());
        setTime(new Date());
      }
      if (showDatePicker && showTimePicker) {
        setShowDatePicker(false);
        setShowTimePicker(false);
        setText(`${userLabel}: ${formatDate(date)} at ${formatTime(time)}`);
        setShowCancel(true);
      } else {
        setShowDatePicker(true);
        setShowTimePicker(true);
      }
    } else {
      if (!date) {
        setDate(new Date());
      }
      if (showDatePicker) {
        setShowDatePicker(false);
        setText(`${userLabel}: ${formatDate(date)}`);
        setShowCancel(true);
      } else {
        setShowDatePicker(true);
        setShowCancel(true);
      }
    }
  };

  const cancelInput = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setText(`${userLabel}`);
    setDate(null);
    if (setTime) {
      setTime(null);
    }
    setShowCancel(false);
  };

  return (
    <View>
      <View style={[styles.button, { width: buttonWidth }]}>
        <TouchableOpacity onPress={togglePicker}>
          <View style={[styles.textBox, { width: buttonWidth - 55 }]}>
            <ButtonIcon name={iconName} />
            <AppText>{text}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={cancelInput}>
            <ButtonIcon name="delete-forever" />
          </TouchableOpacity>
        )}
      </View>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          style={styles.picker}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          minuteInterval={15}
          display="default"
          onChange={onChangeTime}
          style={styles.picker}
        />
      )}
      {showDatePicker && (
        <TouchableOpacity onPress={togglePicker}>
          <View style={[styles.submitButton, { width: buttonWidth }]}>
            <AppText>Submit</AppText>
          </View>
        </TouchableOpacity>
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
  picker: {
    height: 120,
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

export default DateInputButton;
