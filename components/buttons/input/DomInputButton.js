import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";

import AppText from "../../AppText";
import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";
import ErrorMessage from "../../ErrorMessage";
import defaultStyles from "../../../config/styles";

const DomInputButton = ({ name = "dom", renderTime = false }) => {
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
  const userLabel = "Measured";
  const addedTime = 10 * 60000;
  const overshot = new Date(new Date().getTime() + addedTime);
  const [date, setDate] = useState(overshot);
  const [time, setTime] = useState(overshot);
  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState(
    renderTime
      ? `${userLabel}: ${formatDate(date)} at ${formatTime(time)}`
      : `${userLabel}: ${formatDate(date)}`
  );
  const customiseLabel = (date, time) => {
    if (renderTime) {
      setText(`${userLabel}: ${formatDate(date)} at ${formatTime(time)}`);
    } else {
      setText(`${userLabel}: ${formatDate(date)}`);
    }
  };
  const [showReset, setShowReset] = useState(false);

  const { setFieldValue, errors, touched, values } = useFormikContext();

  const onChangeDate = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(Platform.OS === "ios");
    setDate(currentDate);
  };

  const onChangeTime = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPicker(Platform.OS === "ios");
    setTime(currentTime);
  };

  const togglePicker = () => {
    if (showPicker) {
      if (renderTime) {
        const years = date.getFullYear();
        const months = date.getMonth();
        const days = date.getDate();
        const hour = time.getHours();
        const mins = time.getMinutes();
        setFieldValue(name, new Date(years, months, days, hour, mins));
      } else {
        setFieldValue(name, date);
      }
      setShowPicker(false);
      customiseLabel(date, time);
      if (
        formatDate(date) !== formatDate(overshot) ||
        formatTime(time) !== formatTime(overshot)
      ) {
        setShowReset(true);
        setFieldValue("domChanged", true);
      }
    } else {
      setShowPicker(true);
    }
  };

  const resetInput = () => {
    setShowPicker(false);
    customiseLabel(overshot, overshot);
    setDate(overshot);
    if (renderTime) {
      setTime(overshot);
    }
    setShowReset(false);
    setFieldValue(name, overshot);
    setFieldValue("domChanged", false);
  };

  useEffect(() => {
    // reset by formik, but previously changed by user
    if (showReset && !values["domChanged"]) {
      setShowPicker(false);
      setDate(overshot);
      if (renderTime) {
        setTime(overshot);
      }
      customiseLabel(overshot, overshot);
      setShowReset(false);
    }
  });

  return (
    <>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={togglePicker}>
            <View style={styles.textBox}>
              <ButtonIcon name="calendar-range" />
              <AppText style={{ color: colors.white }}>{text}</AppText>
            </View>
          </TouchableOpacity>
          {showReset && (
            <TouchableOpacity onPress={resetInput}>
              <ButtonIcon name="refresh" />
            </TouchableOpacity>
          )}
        </View>
        {showPicker && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
            style={styles.picker}
          />
        )}
        {showPicker && renderTime && (
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
        {showPicker && (
          <TouchableOpacity onPress={togglePicker}>
            <View style={styles.submitButton}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

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
  iosPickerContainer: {
    backgroundColor: colors.light,
    borderRadius: 5,
    alignSelf: "center",
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
    ...defaultStyles.container,
  },
  textBox: {
    flexDirection: "row",
    alignItems: "center",
    width: defaultStyles.container.width - 55,
  },
});

export default DomInputButton;
