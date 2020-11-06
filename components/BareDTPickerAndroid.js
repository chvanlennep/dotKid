import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

const BareDTPickerAndroid = ({ isDate, stateObject, type }) => {
  const [state, setState] = stateObject;
  const localState = isDate
    ? state.date || new Date()
    : state.time || new Date();

  const manageState = (object, state) => {
    setState((state) => {
      const mutableState = { ...state };
      for (const [key, value] of Object.entries(object)) {
        mutableState[key] = value;
      }
      return mutableState;
    });
  };

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

  const customiseLabel = (inputDate, inputTime) => {
    if (inputDate && !inputTime) {
      if (type === 'measured') {
        if (formatDate(inputDate) === formatDate(new Date())) {
          return `Measured: Today`;
        } else {
          return `Measured on ${formatDate(inputDate)}`;
        }
      } else {
        return `Date of Birth: ${formatDate(inputDate)}`;
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
  };

  const onChange = (event, selected) => {
    let workingObject = {};
    if (event.type === 'set') {
      const current = selected || localState;
      if (
        isDate &&
        type === 'measured' &&
        formatDate(current) === formatDate(new Date())
      ) {
        workingObject.showCancel = false;
      } else if (
        !isDate &&
        type === 'measured' &&
        formatTime(current) === formatTime(new Date())
      ) {
        workingObject.showCancelTime = false;
      } else {
        isDate
          ? (workingObject.text1 = customiseLabel(current, null))
          : (workingObject.text2 = customiseLabel(null, current));
        isDate
          ? (workingObject.showCancel = true)
          : (workingObject.showCancelTime = true);
      }
      isDate ? (workingObject.date = current) : (workingObject.time = current);
      isDate
        ? (workingObject.showPickerDateAndroid = false)
        : (workingObject.showPickerTimeAndroid = false);
      isDate
        ? (workingObject.changedDateAndroid = true)
        : (workingObject.changedTimeAndroid = true);
    } else {
      if (isDate) {
        if (!state.showCancel) workingObject.date = null;
      } else {
        if (!state.showCancelTime) workingObject.time = null;
      }
      isDate
        ? (workingObject.showPickerDateAndroid = false)
        : (workingObject.showPickerTimeAndroid = false);
    }
    manageState(workingObject, state);
  };

  return (
    <DateTimePicker
      testID="datePicker"
      value={localState}
      mode={isDate ? 'date' : 'time'}
      display="spinner"
      onChange={onChange}
      minuteInterval={15}
    />
  );
};

export default BareDTPickerAndroid;
