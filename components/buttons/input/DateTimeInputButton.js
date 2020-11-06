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
import BareDTPickerAndroid from '../../BareDTPickerAndroid';

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
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const darkBackgroundColor =
    kind === 'child' ? colors.darkPrimary : colors.darkSecondary;

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

  let userLabel1 = type === 'birth' ? 'Date of Birth' : `Measured: Today`;
  let userLabel2 = type === 'birth' ? 'Time of Birth' : `Measured: Now`;

  if (renderTime && ios && type === 'birth') {
    userLabel1 = `Date & Time of Birth`;
  }
  if (renderTime && ios && type === 'measured') {
    userLabel1 = `Measured: Now`;
  }

  const dateName = type === 'birth' ? 'dob' : 'dom';
  const timeName = type === 'birth' ? 'tob' : 'tom';
  const cancelIcon = type === 'birth' ? 'delete-forever' : 'refresh';

  const initialState = {
    date: null,
    time: null,
    showCancel: false,
    modalVisible: false,
    text1: userLabel1,
    showCancelTime: false,
    showPickerDateAndroid: false,
    showPickerTimeAndroid: false,
    text2: userLabel2,
    changedDateAndroid: false,
    changedTimeAndroid: false,
  };

  const [state, setState] = useState(initialState);

  const { setFieldValue, errors, touched, values } = useFormikContext();
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);

  const manageState = (object, state) => {
    setState((state) => {
      const mutableState = { ...state };
      for (const [key, value] of Object.entries(object)) {
        mutableState[key] = value;
      }
      return mutableState;
    });
  };

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
    if (android) {
      if (inputDate && !inputTime) {
        if (type === 'measured') {
          if (formatDate(inputDate) === formatDate(new Date())) {
            return `Measured: Today`;
          } else {
            return `Measured on ${formatDate(inputDate)}`;
          }
        } else {
          return `${userLabel1}: ${formatDate(inputDate)}`;
        }
      }
      if (inputTime && !inputDate) {
        if (type === 'measured') {
          if (formatTime(inputTime) === formatTime(new Date())) {
            return `Measured: now`;
          } else {
            return `Measured at ${formatTime(inputTime)}`;
          }
        } else {
          return `Time of Birth: ${formatTime(inputTime)}`;
        }
      }
    }
    if (ios) {
      if (renderTime) {
        if (type === 'birth') {
          return `DOB: ${formatDate(inputDate)} at ${formatTime(
            inputTime || new Date()
          )}`;
        } else if (type === 'measured') {
          if (
            formatDate(inputDate) === formatDate(new Date()) &&
            formatTime(inputTime) === formatTime(new Date())
          ) {
            return `Measured: Now`;
          } else {
            return `Measured: ${formatDate(inputDate)} at ${formatTime(
              inputTime
            )}`;
          }
        }
      } else {
        if (type === 'birth') {
          return `${userLabel1}: ${formatDate(inputDate)}`;
        } else {
          if (formatDate(inputDate) === formatDate(new Date())) {
            return `Measured: Now`;
          } else {
            return `Measured on ${formatDate(inputDate)}`;
          }
        }
      }
    }
  };

  const {
    date,
    time,
    showCancel,
    showCancelTime,
    modalVisible,
    showPickerDateAndroid,
    showPickerTimeAndroid,
    text1,
    text2,
    changedDateAndroid,
    changedTimeAndroid,
  } = state;

  const onChangeDateIos = (e, selectedDate) => {
    const currentDate = selectedDate || date;
    manageState({ date: currentDate }, state);
  };

  const onChangeTimeIos = (e, selectedTime) => {
    const currentTime = selectedTime || time;
    manageState({ time: currentTime }, state);
    if (!global) {
      setFieldValue(timeName, currentTime);
    }
  };

  const togglePicker = () => {
    let workingObject = {};
    if (modalVisible) {
      workingObject.text1 = customiseLabel(date, time);
      if (type === 'birth') {
        if (renderTime) {
          if (!global) {
            setFieldValue(dateName, date);
            setFieldValue(timeName, time);
          }
          manageStats.write(kind, dateName, date);
          manageStats.write(kind, timeName, time);
        } else {
          if (!global) {
            setFieldValue(dateName, date);
          }
          manageStats.write(kind, dateName, date);
        }
        workingObject.showCancel = true;
      } else if (type === 'measured') {
        if (formatDate(date) !== formatDate(new Date())) {
          workingObject.showCancel = true;
        } else {
          setFieldValue(dateName, null);
        }
        if (renderTime) {
          if (formatTime(time) !== formatTime(new Date())) {
            workingObject.showCancel = true;
          } else {
            setFieldValue(timeName, null);
          }
        }
      }
      workingObject.modalVisible = false;
      manageState(workingObject, state);
    } else if (!modalVisible && ios) {
      let workingObject = {};
      if (!state.date) {
        workingObject.date = new Date();
        if (!global) setFieldValue(dateName, new Date());
      }
      if (!state.time && renderTime) {
        workingObject.time = new Date();
        if (!global) setFieldValue(timeName, new Date());
      }
      workingObject.modalVisible = true;
      manageState(workingObject, state);
    } else {
      workingObject.showPickerDateAndroid = true;
    }
    manageState(workingObject, state);
  };

  const openPickerTimeAndroid = () => {
    manageState({ showPickerTimeAndroid: true }, state);
  };

  const cancelInput = (timeButton = false) => {
    let workingObject = {};
    if (modalVisible) {
      workingObject.modalVisible = false;
      workingObject.date = manageStats.read(kind, dateName);
      setFieldValue(dateName, workingObject.date);
      if (renderTime) {
        workingObject.time = manageStats.read(kind, timeName);
        setFieldValue(timeName, workingObject.time);
      }
      manageState(workingObject, state);
    } else {
      if (!timeButton) {
        if (!global) {
          setFieldValue(dateName, null);
          if (renderTime) {
            setFieldValue(timeName, null);
          }
        }
        manageStats.write(kind, dateName, null);
        if (renderTime) {
          manageStats.write(kind, timeName, null);
        }
        workingObject.showCancel = false;
        workingObject.text1 = userLabel1;
        workingObject.date = null;
      } else if (timeButton) {
        if (!global) {
          setFieldValue(timeName, null);
        }
        manageStats.write(kind, timeName, null);
        workingObject.showCancelTime = false;
        workingObject.time = null;
        workingObject.text2 = userLabel2;
      }
      manageState(workingObject, state);
    }
  };

  useEffect(() => {
    if (changedDateAndroid) {
      if (type === 'measured' && formatDate(date) === formatDate(new Date())) {
        setFieldValue(dateName, null);
        manageStats.write(kind, dateName, null);
      } else {
        setFieldValue(dateName, date);
        manageStats.write(kind, dateName, date);
      }
      manageState({ changedDateAndroid: false }, state);
    } else if (changedTimeAndroid) {
      if (type === 'measured' && formatTime(time) === formatTime(new Date())) {
        setFieldValue(timeName, null);
        manageStats.write(kind, timeName, null);
      } else {
        setFieldValue(timeName, time);
        manageStats.write(kind, timeName, time);
      }
      manageState({ changedTimeAndroid: false }, state);
    }
  });

  useEffect(() => {
    if (!changedTimeAndroid && !changedDateAndroid) {
      if (type === 'measured') {
        // reset by formik, but previously changed by user
        if (
          state.showCancel &&
          !values[dateName] &&
          !values[timeName] &&
          !state.modalVisible &&
          !state.showPickerTimeAndroid &&
          !state.showPickerDateAndroid
        )
          manageState(initialState, state);
      }
    }
  }, [state, values[dateName], values[timeName]]);

  useEffect(() => {
    if (!changedTimeAndroid && !changedDateAndroid) {
      if (type === 'birth') {
        const globalDob = manageStats.read(kind, dateName);
        const globalTob = manageStats.read(kind, timeName);
        // button filled out by user (must put no modalVisible otherwise value stuck)
        if (
          showCancel &&
          !modalVisible &&
          !showPickerDateAndroid &&
          !showPickerTimeAndroid &&
          (date || time)
        ) {
          // // reset by formik:
          if (!global) {
            if (!values[dateName] && !values[timeName]) {
              manageStats.write(kind, dateName, null);
              manageStats.write(kind, timeName, null);
              manageState(initialState, state);
            }
          }
          // reset globally:
          if (!globalDob && !globalTob) {
            if (!global) {
              setFieldValue(dateName, null);
              setFieldValue(timeName, null);
            }
            manageState(initialState, state);
          }
          // value changed by global state:
          if (globalDob) {
            if (formatDate(globalDob) !== formatDate(date)) {
              if (!global) {
                setFieldValue(dateName, globalDob);
                setFieldValue(timeName, globalTob);
              }
              let workingObject = {};
              workingObject.date = globalDob;
              if (renderTime) workingObject.time = globalTob || globalDob;
              renderTime && ios
                ? (workingObject.text1 = customiseLabel(
                    globalDob,
                    globalTob || globalDob
                  ))
                : (workingObject.text1 = customiseLabel(globalDob, null));
              if (renderTime && android)
                workingObject.text2 = customiseLabel(
                  null,
                  globalTob || globalDob
                );
              manageState(workingObject, state);
            }
          }
        }
        // not filled in by user:
        if (
          !showCancel &&
          !modalVisible &&
          !showPickerDateAndroid &&
          !showPickerTimeAndroid &&
          date === null &&
          time === null
        ) {
          // value updated via global state:
          if (globalDob) {
            if (!global) {
              setFieldValue(dateName, globalDob);
              if (renderTime && globalTob) {
                setFieldValue(timeName, globalTob);
              }
            }
            let workingObject = {};
            workingObject.date = globalDob;
            if (renderTime) workingObject.time = globalTob || globalDob;
            renderTime && ios
              ? (workingObject.text1 = customiseLabel(
                  globalDob,
                  globalTob || globalDob
                ))
              : (workingObject.text1 = customiseLabel(globalDob, null));
            if (renderTime && android)
              workingObject.text2 = customiseLabel(
                null,
                globalTob || globalDob
              );
            workingObject.showCancel = true;
            workingObject.showCancelTime = true;
            if (globalTob && android) workingObject.showCancelTime = true;
            manageState(workingObject, state);
          }
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
          <TouchableOpacity onPress={() => cancelInput()}>
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
              <TouchableOpacity onPress={() => cancelInput(true)}>
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
                { backgroundColor: dark ? darkBackgroundColor : colors.light },
              ]}
            >
              {ios && (
                <View style={styles.iosDatePicker}>
                  <DateTimePicker
                    testID="datePicker"
                    value={date}
                    mode="date"
                    display="spinner"
                    onChange={onChangeDateIos}
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
                  <TouchableOpacity onPress={() => cancelInput()}>
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
        <BareDTPickerAndroid
          isDate={true}
          stateObject={[state, setState]}
          type={type}
        />
      )}
      {showPickerTimeAndroid && android && renderTime && (
        <BareDTPickerAndroid
          isDate={false}
          stateObject={[state, setState]}
          type={type}
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
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
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
