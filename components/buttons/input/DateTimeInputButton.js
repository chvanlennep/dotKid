import React, { useState, useEffect, useContext } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormikContext } from 'formik';

import colors from '../../../config/colors';
import ButtonIcon from '../ButtonIcon';
import ErrorMessage from '../../ErrorMessage';
import { GlobalStateContext } from '../../GlobalStateContext';
import defaultStyles from '../../../config/styles';
import AppText from '../../AppText';

const modalWidth =
  defaultStyles.container.width > 360 ? 360 : defaultStyles.container.width;

const DateTimeInputButton = ({
  global = false,
  kind = 'child',
  renderTime = false,
  type = 'birth',
}) => {
  const android = Platform.OS === 'android' ? true : false;
  const ios = Platform.OS === 'ios' ? true : false;
  scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;

  const formatDate = (date) => {
    if (!date) return null;
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    let yearArray = date.getFullYear().toString().split('');
    let shortArray = [yearArray[2], yearArray[3]];
    let year = shortArray.join('');
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  };

  const formatTime = (time) => {
    if (!time) return null;
    let hours = '' + time.getHours();
    let workingMinutes = time.getMinutes();
    let minutes = '' + Math.floor(workingMinutes / 15) * 15;
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    return [hours, minutes].join(':');
  };

  const addedTime = 10 * 60000;
  const overshot = new Date(new Date().getTime() + addedTime);
  let userLabel1 =
    type === 'birth' ? 'Date of Birth' : `Measured on ${formatDate(overshot)}`;
  let userLabel2 =
    type === 'birth' ? 'Time of Birth' : `Measured at ${formatTime(overshot)}`;

  if (renderTime && ios && type === 'birth') {
    userLabel1 = `Date & Time of Birth`;
  }
  if (renderTime && ios && type === 'measured') {
    userLabel1 = `Measured: ${formatDate(overshot)} at ${formatTime(overshot)}`;
  }

  const dateName = type === 'birth' ? 'dob' : 'dom';
  const timeName = type === 'birth' ? 'tob' : 'tom';
  const resetValue = type === 'measured' ? overshot : null;
  const cancelIcon = type === 'birth' ? 'delete-forever' : 'refresh';

  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(resetValue);
  const [time, setTime] = useState(resetValue);
  const [showPickerDateAndroid, setShowPickerDateAndroid] = useState(false);
  const [showPickerTimeAndroid, setShowPickerTimeAndroid] = useState(false);
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
      if (kind === 'child') {
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          child[measurementType] = value;
          return { child, neonate };
        });
      } else if (kind === 'neonate')
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          neonate[measurementType] = value;
          return { child, neonate };
        });
    },
  };

  const customiseLabel = (inputDate, inputTime) => {
    if (inputTime && renderTime && ios && type === 'birth') {
      setText1(`DOB: ${formatDate(inputDate)} at ${formatTime(inputTime)}`);
    } else if (inputTime && renderTime && ios && type === 'measured') {
      setText1(
        `Measured: ${formatDate(inputDate)} at ${formatTime(inputTime)}`
      );
    } else if (renderTime && android) {
      if (inputDate) {
        setText1(
          type === 'birth'
            ? `${userLabel1}: ${formatDate(inputDate)}`
            : `Measured on ${formatDate(inputDate)}`
        );
      }
      if (inputTime) {
        setText2(
          type === 'birth'
            ? `${userLabel2}: ${formatTime(inputTime)}`
            : `Measured at ${formatTime(inputTime)}`
        );
      }
    } else {
      if (inputDate) {
        setText1(
          type === 'birth'
            ? `${userLabel1}: ${formatDate(inputDate)}`
            : `Measured on ${formatDate(inputDate)}`
        );
      }
    }
  };

  const onChangeDate = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowPickerDateAndroid(false);
    setDate(currentDate);
    if (!global) {
      setFieldValue(dateName, currentDate);
    }
    if (android) {
      manageStats.write(kind, dateName, currentDate);
      if (type === 'measured') setFieldValue('domChanged', true);
      customiseLabel(currentDate, null);
      setShowCancel(true);
    }
  };

  const onChangeTimeIos = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    if (!global) {
      setFieldValue(timeName, currentTime);
    }
  };

  const onChangeTimeAndroid = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowPickerTimeAndroid(false);
    setTime(currentTime);
    manageStats.write(kind, timeName, currentTime);
    if (!global) {
      setFieldValue(timeName, currentTime);
    }
    customiseLabel(null, currentTime);
    setShowCancelTime(true);
    if (type === 'measured') setFieldValue('domChanged', true);
  };

  const togglePicker = () => {
    if (ios && modalVisible) {
      if (renderTime) {
        manageStats.write(kind, dateName, date);
        manageStats.write(kind, timeName, time);
      } else {
        manageStats.write(kind, dateName, date);
      }
      if (type === 'measured') {
        if (formatDate(date) !== formatDate(overshot)) {
          setShowCancel(true);
          setFieldValue('domChanged', true);
        }
        if (renderTime) {
          if (formatTime(time) !== formatTime(overshot)) {
            setShowCancel(true);
            setFieldValue('domChanged', true);
          }
        }
      } else {
        setShowCancel(true);
      }
      customiseLabel(date, time);
      setModalVisible(false);
    } else {
      if (!date) {
        setDate(new Date());
        setFieldValue(dateName, new Date());
      }
      if (!time) {
        setTime(new Date());
        setFieldValue(timeName, new Date());
      }
      ios ? setModalVisible(true) : setShowPickerDateAndroid(true);
    }
  };

  const openPickerTimeAndroid = () => {
    if (!time) {
      setTime(new Date());
    }
    setShowPickerTimeAndroid(true);
  };

  const cancelInput = () => {
    if (modalVisible) {
      setModalVisible(false);
      const globalDob = manageStats.read(kind, dateName);
      setDate(globalDob);
      setFieldValue(dateName, globalDob);
      if (renderTime) {
        const globalTob = manageStats.read(kind, timeName);
        setTime(globalTob);
        setFieldValue(timeName, globalTob);
      }
    } else {
      setText1(`${userLabel1}`);
      setDate(resetValue);
      if (renderTime) {
        setTime(resetValue);
      }
      setShowCancel(false);
      if (!global) {
        setFieldValue(dateName, resetValue);
        if (ios && renderTime) {
          setFieldValue(timeName, resetValue);
        }
      }
      manageStats.write(kind, dateName, resetValue);
      if (ios && renderTime) {
        manageStats.write(kind, timeName, resetValue);
      }
      if (type === 'measured') setFieldValue('domChanged', false);
    }
  };

  const cancelTimeInputAndroid = () => {
    setText2(`${userLabel2}`);
    setTime(resetValue);
    setShowCancelTime(false);
    if (!global) {
      setFieldValue(timeName, resetValue);
    }
    manageStats.write(kind, timeName, resetValue);
  };

  const localReset = () => {
    setText1(`${userLabel1}`);
    setText2(`${userLabel2}`);
    setDate(resetValue);
    if (renderTime) {
      setTime(resetValue);
    }
    setShowCancel(false);
    if (android && renderTime) {
      setShowCancelTime(false);
    }
  };

  useEffect(() => {
    if (type === 'measured') {
      // reset by formik, but previously changed by user
      if (showCancel && !values['domChanged']) localReset();
    }
  });

  useEffect(() => {
    if (type === 'birth') {
      const globalDob = manageStats.read(kind, dateName);
      const globalTob = manageStats.read(kind, timeName);
      // button filled out by user (must put no modalVisible otherwise value stuck)
      if (
        showCancel &&
        !modalVisible &&
        !showPickerDateAndroid &&
        !showPickerTimeAndroid &&
        (date !== resetValue || time !== resetValue)
      ) {
        // // reset by formik:
        if (!global) {
          if (!values[dateName] && !values[timeName]) {
            localReset();
            manageStats.write(kind, dateName, resetValue);
            manageStats.write(kind, timeName, resetValue);
          }
        }
        // reset globally:
        if (!globalDob && !globalTob) {
          localReset();
          if (!global) {
            setFieldValue(dateName, resetValue);
            setFieldValue(timeName, resetValue);
          }
        }
        // value changed by global state:
        if (globalDob) {
          const tempLocalDate = formatDate(date);
          const tempLocalTime = formatTime(time);
          const tempGlobalDate = formatDate(globalDob);
          const tempGlobalTime = formatTime(globalTob);
          if (
            tempGlobalDate !== tempLocalDate ||
            tempGlobalTime !== tempLocalTime
          ) {
            if (!global) {
              setFieldValue(dateName, globalDob);
              setFieldValue(timeName, globalTob);
            }
            setDate(globalDob);
            setTime(globalTob);
            customiseLabel(globalDob, renderTime ? new Date() : null);
          }
        }
      }
      // not filled in by user:
      if (
        !showCancel &&
        !modalVisible &&
        !showPickerDateAndroid &&
        !showPickerTimeAndroid &&
        date === resetValue &&
        time === resetValue
      ) {
        // value updated via global state:
        if (globalDob) {
          if (!global) {
            setFieldValue(dateName, globalDob);
            if (renderTime && globalTob) {
              setFieldValue(timeName, globalTob);
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
          setShowCancelTime(true);
        }
      }
    }
  });

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity onPress={togglePicker}>
          <View style={styles.textBox}>
            <ButtonIcon name="calendar-range" />
            <AppText style={{ color: colors.white }}>{text1}</AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity onPress={cancelInput}>
            <ButtonIcon name={cancelIcon} />
          </TouchableOpacity>
        )}
      </View>
      <ErrorMessage error={errors[dateName]} visible={touched[dateName]} />
      {android && renderTime && (
        <React.Fragment>
          <View style={styles.button}>
            <TouchableOpacity onPress={openPickerTimeAndroid}>
              <View style={styles.textBox}>
                <ButtonIcon name="clock" />
                <AppText style={{ color: colors.white }}>{text2}</AppText>
              </View>
            </TouchableOpacity>
            {showCancelTime && (
              <TouchableOpacity onPress={cancelTimeInputAndroid}>
                <ButtonIcon name={cancelIcon} />
              </TouchableOpacity>
            )}
          </View>
          <ErrorMessage error={errors[dateName]} visible={touched[timeName]} />
        </React.Fragment>
      )}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log('Window closed');
          }}
        >
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                { backgroundColor: dark ? colors.black : colors.light },
              ]}
            >
              {ios && (
                <View style={styles.iosDatePicker}>
                  <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChangeDate}
                    style={{ height: 150 }}
                  />
                </View>
              )}
              {ios && renderTime && (
                <View style={styles.iosTimePicker}>
                  <DateTimePicker
                    testID="timePicker"
                    value={time}
                    mode="time"
                    minuteInterval={15}
                    display="spinner"
                    onChange={onChangeTimeIos}
                    style={{ height: 150 }}
                  />
                </View>
              )}
              <View style={styles.buttonContainer}>
                <View style={styles.closeIcon}>
                  <TouchableOpacity onPress={cancelInput}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={dark ? colors.white : colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.acceptIcon}>
                  <TouchableOpacity onPress={togglePicker}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      color={dark ? colors.white : colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {showPickerDateAndroid && android && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          display="spinner"
          onChange={onChangeDate}
          style={[styles.Picker]}
        />
      )}
      {showPickerTimeAndroid && android && renderTime && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          minuteInterval={15}
          display="spinner"
          onChange={onChangeTimeAndroid}
          style={styles.Picker}
        />
      )}
    </React.Fragment>
  );
};

export default DateTimeInputButton;

const styles = StyleSheet.create({
  buttonContainer: {
    width: modalWidth,
    //backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingRight: 10,
  },
  acceptIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingLeft: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    ...defaultStyles.container,
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  iosDatePicker: {
    height: 150,
    //backgroundColor: 'black',
    width: modalWidth,
  },
  iosTimePicker: {
    height: 150,
    //backgroundColor: 'black',
    width: modalWidth,
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
