import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";

import AppText from "../../AppText";
import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";
import ErrorMessage from "../../ErrorMessage";
import defaultStyles from "../../../config/styles";

const DomInputButton = ({ renderTime = false }) => {
  let android = false;
  let ios = false;
  Platform.OS === "android" ? (android = true) : (ios = true);

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
    if (android) {
      minutes = "" + workingMinutes;
    }
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;
    return [hours, minutes].join(":");
  };

  const addedTime = 10 * 60000;
  const overshot = new Date(new Date().getTime() + addedTime);
  const [date, setDate] = useState(overshot);
  const [time, setTime] = useState(overshot);
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerTime, setShowPickerTime] = useState(false);
  const [showCancelTime, setShowCancelTime] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  let startingLabel1 = `Measured on ${formatDate(date)}`;
  let startingLabel2 = `Measured at ${formatTime(time)}`;
  if (ios && renderTime) {
    startingLabel1 = `Measured on ${formatDate(date)} at ${formatTime(time)}`;
  }

  const [text1, setText1] = useState(startingLabel1);
  const [text2, setText2] = useState(startingLabel2);

  const customiseLabel = (inputDate, inputTime) => {
    if (renderTime && ios) {
      setText1(
        `Measured on ${formatDate(inputDate)} at ${formatTime(inputTime)}`
      );
    } else if (renderTime && android) {
      if (inputDate) setText1(`Measured on ${formatDate(inputDate)}`);
      if (inputTime) setText2(`Measured at ${formatTime(inputTime)}`);
    } else {
      if (inputDate) {
        setText1(`Measured on ${formatDate(inputDate)}`);
      }
    }
  };

  const { setFieldValue, errors, touched, values } = useFormikContext();

  const onChangeDate = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(ios);
    setDate(currentDate);
    if (android) {
      setFieldValue("dom", currentDate);
      customiseLabel(currentDate, null);
      setFieldValue("domChanged", true);
      setShowCancel(true);
    }
  };

  const onChangeTimeIos = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  const onChangeTimeAndroid = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPickerTime(false);
    setTime(currentTime);
    setFieldValue("tom", currentTime);
    customiseLabel(null, currentTime);
    setFieldValue("domChanged", true);
    setShowCancelTime(true);
  };

  const togglePicker = () => {
    if (showPicker && ios) {
      if (renderTime) {
        setFieldValue("dom", date);
        setFieldValue("tom", time);
      } else {
        setFieldValue("dom", date);
      }
      setFieldValue("domChanged", true);
      customiseLabel(date, time);
      setShowPicker(false);
      setShowCancel(true);
    } else {
      setShowPicker(true);
    }
  };

  const openPickerTimeAndroid = () => {
    setShowPickerTime(true);
  };

  const cancelInput = () => {
    setShowPicker(false);
    setDate(overshot);
    if (renderTime) {
      setTime(overshot);
    }
    setShowCancel(false);
    setFieldValue("dom", overshot);
    setFieldValue("domChanged", false);
    if (ios && renderTime) {
      setFieldValue("tob", overshot);
      setText1(
        `Measured on ${formatDate(overshot)} at ${formatTime(overshot)}`
      );
    } else {
      setText1(`Measured on ${formatDate(overshot)}`);
    }
  };

  const cancelTimeInputAndroid = () => {
    setText2(`Measured at ${formatTime(overshot)}`);
    setTime(overshot);
    setShowCancelTime(false);
    setFieldValue("tom", overshot);
    setFieldValue("domChanged", false);
  };

  useEffect(() => {
    // reset by formik, but previously changed by user
    if (showCancel && !values["domChanged"]) {
      setShowPicker(false);
      setDate(overshot);
      if (renderTime) {
        setTime(overshot);
      }
      customiseLabel(overshot, overshot);
      setShowCancel(false);
    }
  });

  return (
    <>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={togglePicker}>
            <View style={styles.textBox}>
              <ButtonIcon name="calendar-range" />
              <AppText style={{ color: colors.white }}>{text1}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="refresh" />
            </TouchableOpacity>
          )}
        </View>
        {showPicker && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            display="spinner"
            onChange={onChangeDate}
            style={[styles.iosPickerContainer]}
          />
        )}
        {showPicker && ios && renderTime && (
          <DateTimePicker
            testID="timePicker"
            value={time}
            mode="time"
            minuteInterval={15}
            display="default"
            onChange={onChangeTimeIos}
            style={styles.iosPickerContainer}
          />
        )}
        {showPickerTime && android && renderTime && (
          <DateTimePicker
            testID="timePicker"
            value={time}
            mode="time"
            minuteInterval={5}
            display="default"
            onChange={onChangeTimeAndroid}
            style={styles.iosPickerContainer}
          />
        )}
        {showPicker && ios && (
          <TouchableOpacity onPress={togglePicker}>
            <View style={[styles.submitButton]}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        )}
        {android && renderTime && (
          <>
            <View style={styles.button}>
              <TouchableOpacity onPress={openPickerTimeAndroid}>
                <View style={styles.textBox}>
                  <ButtonIcon name="clock" />
                  <AppText style={{ color: colors.white }}>{text2}</AppText>
                </View>
              </TouchableOpacity>
              {showCancelTime && (
                <TouchableOpacity onPress={cancelTimeInputAndroid}>
                  <ButtonIcon name="refresh" />
                </TouchableOpacity>
              )}
            </View>
          </>
        )}
      </View>
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
    width: defaultStyles.container.width - 55,
  },
});

export default DomInputButton;
