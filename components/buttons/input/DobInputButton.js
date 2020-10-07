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

const DobInputButton = ({ global = false, kind, renderTime = false }) => {
  let android = false;
  let ios = false;
  Platform.OS === "android" ? (android = true) : (ios = true);

  let userLabel1 = "Date of Birth";
  let userLabel2 = "Time of Birth";
  if (renderTime && ios) {
    userLabel1 = "Date & Time of Birth";
  }

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerTime, setShowPickerTime] = useState(false);
  const [text1, setText1] = useState(`${userLabel1}`);
  const [text2, setText2] = useState(`${userLabel2}`);
  const [showCancel, setShowCancel] = useState(false);
  const [showCancelTime, setShowCancelTime] = useState(false);

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
    if (android) {
      minutes = "" + workingMinutes;
    }
    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;
    return [hours, minutes].join(":");
  };

  const customiseLabel = (inputDate, inputTime) => {
    if (inputTime && renderTime && ios) {
      setText1(`DOB: ${formatDate(inputDate)} at ${formatTime(inputTime)}`);
    } else if (renderTime && android) {
      if (inputDate) {
        setText1(`${userLabel1}: ${formatDate(inputDate)}`);
      }
      if (inputTime) {
        setText2(`${userLabel2}: ${formatTime(inputTime)}`);
      }
    } else {
      if (inputDate) {
        setText1(`${userLabel1}: ${formatDate(inputDate)}`);
      }
    }
  };

  const onChangeDate = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPicker(ios);
    setDate(currentDate);
    if (android) {
      manageStats.write(kind, "dob", currentDate);
      if (!global) {
        setFieldValue("dob", currentDate);
      }
      customiseLabel(currentDate, null);
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
    manageStats.write(kind, "tob", currentTime);
    if (!global) {
      setFieldValue("tob", currentTime);
    }
    customiseLabel(null, currentTime);
    setShowCancelTime(true);
  };

  const togglePicker = () => {
    if (!date) {
      setDate(new Date());
    }
    if (!time) {
      setTime(new Date());
    }
    if (showPicker && ios) {
      if (renderTime) {
        if (!global) {
          setFieldValue("dob", date);
          setFieldValue("tob", time);
        }
        manageStats.write(kind, "dob", date);
        manageStats.write(kind, "tob", time);
      } else {
        if (!global) {
          setFieldValue("dob", date);
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

  const openPickerTimeAndroid = () => {
    if (!time) {
      setTime(new Date());
    }
    setShowPickerTime(true);
  };

  const cancelInput = () => {
    setShowPicker(false);
    setText1(`${userLabel1}`);
    setDate(null);
    if (renderTime) {
      setTime(null);
    }
    setShowCancel(false);
    if (!global) {
      setFieldValue("dob", null);
      if (ios && renderTime) {
        setFieldValue("tob", null);
      }
    }
    manageStats.write(kind, "dob", null);
    if (ios && renderTime) {
      manageStats.write(kind, "tob", null);
    }
  };

  const cancelTimeInputAndroid = () => {
    setText2(`${userLabel2}`);
    setTime(null);
    setShowCancelTime(false);
    if (!global) {
      setFieldValue("tob", null);
    }
    manageStats.write(kind, "tob", null);
  };

  useEffect(() => {
    const globalDob = manageStats.read(kind, "dob");
    const globalTob = manageStats.read(kind, "tob");
    if (ios) {
      // button has been filled in by user:
      if (showCancel && date) {
        // Reset by formik:
        if (!global) {
          if (!values["dob"] && !values["tob"]) {
            setShowPicker(false);
            setText1(`${userLabel1}`);
            setDate(null);
            if (renderTime) {
              setTime(null);
            }
            setShowCancel(false);
            manageStats.write(kind, "dob", null);
            manageStats.write(kind, "tob", null);
          }
        }
        // Reset via global state:
        if (!globalDob && !globalTob) {
          setShowPicker(false);
          setText1(`${userLabel1}`);
          setDate(null);
          if (renderTime) {
            setTime(null);
          }
          setShowCancel(false);
          if (!global) {
            setFieldValue("dob", null);
            setFieldValue("tob", null);
          }
        }
        // value changed by global state (must put no show picker otherwise value stuck):
        if (globalDob) {
          let tempLocalDate;
          if (date) {
            tempLocalDate = formatDate(date);
          }
          if (formatDate(globalDob) !== tempLocalDate && !showPicker) {
            if (!global) {
              setFieldValue("dob", globalDob);
            }
            setDate(globalDob);
            customiseLabel(globalDob, renderTime ? new Date() : null);
          }
        }
      }
      //button has not been filled in by user:
      if (!showCancel && !showPicker && !date) {
        // value updated via global state:
        if (globalDob) {
          if (!global) {
            setFieldValue("dob", globalDob);
            if (renderTime && globalTob) {
              setFieldValue("tob", globalTob);
            }
          }
          setDate(globalDob);
          setTime(globalTob ? globalTob : globalDob);
          customiseLabel(globalDob, null);
          if (renderTime) {
            globalTob
              ? customiseLabel(globalDob, globalTob)
              : customiseLabel(globalDob, new Date());
          }
          setShowCancel(true);
        }
      }
    }
    if (android) {
      // button has been filled in by user:
      if (showCancel && date) {
        // Reset by formik:
        if (!global) {
          if (!values["dob"] && !values["tob"]) {
            setText1(`${userLabel1}`);
            setDate(null);
            if (renderTime) {
              setTime(null);
              setText2(`${userLabel2}`);
              setShowCancelTime(false);
            }
            setShowCancel(false);

            manageStats.write(kind, "dob", null);
            manageStats.write(kind, "tob", null);
          }
        }
        // Reset via global state:
        if (!globalDob && !globalTob) {
          setText1(`${userLabel1}`);
          setDate(null);
          if (renderTime) {
            setTime(null);
            setText2(`${userLabel2}`);
            setShowCancelTime(false);
          }
          setShowCancel(false);
          if (!global) {
            setFieldValue("dob", null);
            setFieldValue("tob", null);
          }
        }
        // value changed by global state (must put no show picker otherwise value stuck):
        if (globalDob) {
          let tempLocalDate;
          if (date) {
            tempLocalDate = formatDate(date);
          }
          if (formatDate(globalDob) !== tempLocalDate && !showPicker) {
            if (!global) {
              setFieldValue("dob", globalDob);
            }
            setDate(globalDob);
            customiseLabel(globalDob, renderTime ? new Date() : null);
          }
        }
      }
      //button has not been filled in by user:
      if (!showCancel && !showPicker && !date) {
        // value updated via global state:
        if (globalDob) {
          if (!global) {
            setFieldValue("dob", globalDob);
            if (renderTime && globalTob) {
              setFieldValue("tob", globalTob);
            }
          }
          setDate(globalDob);
          setTime(globalTob ? globalTob : globalDob);
          customiseLabel(globalDob, null);
          if (renderTime) {
            globalTob
              ? customiseLabel(globalDob, globalTob)
              : customiseLabel(globalDob, new Date());
            setShowCancelTime(true);
          }
          setShowCancel(true);
        }
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
              <AppText style={{ color: colors.white }}>{text1}</AppText>
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
            display="spinner"
            onChange={onChangeDate}
            style={[styles.iosPicker]}
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
            style={styles.iosPicker}
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
            style={styles.iosPicker}
          />
        )}
        {showPicker && ios && (
          <TouchableOpacity onPress={togglePicker}>
            <View style={[styles.submitButton]}>
              <AppText style={{ color: colors.white }}>Submit</AppText>
            </View>
          </TouchableOpacity>
        )}
        <ErrorMessage error={errors["dob"]} visible={touched["dob"]} />
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
                  <ButtonIcon name="delete-forever" />
                </TouchableOpacity>
              )}
            </View>
            <ErrorMessage error={errors["tob"]} visible={touched["tob"]} />
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
