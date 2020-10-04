import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, Platform, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";

import AppText from "../../AppText";
import colors from "../../../config/colors";
import ButtonIcon from "../ButtonIcon";
import ErrorMessage from "../../ErrorMessage";
import { GlobalStateContext } from "../../GlobalStateContext";
import defaultStyles from "../../../config/styles";

const DobInputButton = ({
  global = false,
  kind,
  name = "dob",
  renderTime = false,
}) => {
  let userLabel;
  if (renderTime) {
    userLabel = "Date & Time of Birth";
  } else {
    userLabel = "Date of Birth";
  }

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState(`${userLabel}`);
  const [showCancel, setShowCancel] = useState(false);

  const { setFieldValue, errors, touched, values } = useFormikContext();
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

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

  const customiseLabel = (date, time) => {
    if (renderTime) {
      if (userLabel === "Date & Time of Birth") {
        setText(`DOB: ${formatDate(date)} at ${formatTime(time)}`);
      } else {
        setText(`${userLabel}: ${formatDate(date)} at ${formatTime(time)}`);
      }
    } else {
      setText(`${userLabel}: ${formatDate(date)}`);
    }
  };

  const togglePicker = () => {
    if (!date) {
      setDate(new Date());
    }
    if (!time) {
      setTime(new Date());
    }
    if (showPicker) {
      if (renderTime) {
        const years = date.getFullYear();
        const months = date.getMonth();
        const days = date.getDate();
        const hour = time.getHours();
        const mins = time.getMinutes();
        if (!global) {
          setFieldValue(name, new Date(years, months, days, hour, mins));
        }
        manageStats.write(
          kind,
          "dob",
          new Date(years, months, days, hour, mins)
        );
      } else {
        if (!global) {
          setFieldValue(name, date);
        }
        manageStats.write(kind, "dob", date);
      }
      setShowPicker(false);
      setShowCancel(true);
      customiseLabel(date, time);
    } else {
      setShowPicker(true);
    }
  };

  const cancelInput = () => {
    setShowPicker(false);
    setText(`${userLabel}`);
    setDate(null);
    if (renderTime) {
      setTime(null);
    }
    setShowCancel(false);
    if (!global) {
      setFieldValue(name, null);
    }
    manageStats.write(kind, "dob", null);
  };

  useEffect(() => {
    const globalDob = manageStats.read(kind, "dob");
    // button has been filled in by user:
    if (showCancel && date) {
      // Reset by formik:
      if (!global) {
        if (!values[name]) {
          setShowPicker(false);
          setText(`${userLabel}`);
          setDate(null);
          if (renderTime) {
            setTime(null);
          }
          setShowCancel(false);
          manageStats.write(kind, "dob", null);
        }
      }
      // Reset via global state:
      if (!globalDob) {
        setShowPicker(false);
        setText(`${userLabel}`);
        setDate(null);
        if (renderTime) {
          setTime(null);
        }
        setShowCancel(false);
        if (!global) {
          setFieldValue(name, null);
        }
      }
      // value changed by global state (must put no show picker otherwise value stuck):
      if (globalDob) {
        let tempLocalDate;
        let tempLocalTime;
        if (date) {
          tempLocalDate = formatDate(date);
        }
        if (time) {
          tempLocalTime = formatTime(time);
        }
        if (
          (formatDate(globalDob) !== tempLocalDate ||
            formatTime(globalDob) !== tempLocalTime) &&
          !showPicker
        ) {
          if (!global) {
            if (renderTime) {
              const years = globalDob.getFullYear();
              const months = globalDob.getMonth();
              const days = globalDob.getDate();
              const hour = globalDob.getHours();
              const mins = globalDob.getMinutes();
              setFieldValue(name, new Date(years, months, days, hour, mins));
            } else {
              setFieldValue(name, globalDob);
            }
          }
          setDate(globalDob);
          setTime(globalDob);
          customiseLabel(globalDob, globalDob);
        }
      }
    }
    // button has not been filled in by user:
    if (!showCancel && !showPicker && !date) {
      // value updated via global state:
      if (globalDob) {
        if (!global) {
          if (renderTime) {
            const years = globalDob.getFullYear();
            const months = globalDob.getMonth();
            const days = globalDob.getDate();
            const hour = globalDob.getHours();
            const mins = globalDob.getMinutes();
            setFieldValue(name, new Date(years, months, days, hour, mins));
          } else {
            setFieldValue(name, globalDob);
          }
        }
        setDate(globalDob);
        setTime(globalDob);
        customiseLabel(globalDob, globalDob);
        setShowCancel(true);
      }
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
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="delete-forever" />
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
            style={[styles.iosPicker]}
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
            style={styles.iosPicker}
          />
        )}
        {showPicker && (
          <TouchableOpacity onPress={togglePicker}>
            <View style={[styles.submitButton]}>
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
  iosPicker: {
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

export default DobInputButton;
