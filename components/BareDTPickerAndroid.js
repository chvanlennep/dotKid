import React from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  formatDate,
  formatTime,
  labelMaker,
  updateLocalState,
} from '../brains/oddBits';

const BareDTPickerAndroid = ({isDate, stateObject, type}) => {
  const [state, setState] = stateObject;
  const localState = isDate ? state.date : state.time;

  const onChange = (event, selected) => {
    let workingObject = {};
    if (event.type === 'set') {
      const current = selected || localState;
      const {text1, text2} = labelMaker(current, current, type, true, false);
      if (isDate) {
        workingObject.showCancel = true;
        workingObject.date = current;
        workingObject.showPickerDateAndroid = false;
        workingObject.changedDate = true;
        workingObject.text1 = text1;
      } else {
        workingObject.showCancelTime = true;
        workingObject.time = current;
        workingObject.showPickerTimeAndroid = false;
        workingObject.changedTime = true;
        workingObject.text2 = text2;
      }
      if (
        isDate &&
        type === 'measured' &&
        formatDate(current) === formatDate(new Date())
      ) {
        workingObject.showCancel = false;
        workingObject.date = null;
      } else if (
        !isDate &&
        type === 'measured' &&
        formatTime(current) === formatTime(new Date())
      ) {
        workingObject.showCancelTime = false;
        workingObject.time = null;
      }
    } else {
      if (isDate) {
        if (!state.showCancel) {
          workingObject.date = null;
        }
        workingObject.showPickerDateAndroid = false;
      } else {
        if (!state.showCancelTime) {
          workingObject.time = null;
        }
        workingObject.showPickerTimeAndroid = false;
      }
    }
    updateLocalState(workingObject, setState);
  };

  return (
    <DateTimePicker
      testID="datePicker"
      value={localState || new Date()}
      mode={isDate ? 'date' : 'time'}
      display="spinner"
      onChange={onChange}
      minuteInterval={15}
    />
  );
};

export default BareDTPickerAndroid;
