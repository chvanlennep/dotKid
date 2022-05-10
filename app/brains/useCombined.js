import {useEffect, useContext, useState} from 'react';
import {useFormikContext} from 'formik';
import {GlobalStatsContext, initialState} from '../components/GlobalStats';

// custom hook can only be used in components that are children of AppForm and GlobalStats

export default (kind, name) => {
  const {globalStats, setGlobalStats} = useContext(GlobalStatsContext);
  const {setFieldValue, handleReset} = useFormikContext();
  const [reset, setReset] = useState(false);

  const buttonState = globalStats[kind][name];
  const value = globalStats[kind][name].value;

  const combinedSetter = (localState) => {
    setGlobalStats((state) => {
      const merge = {...state[kind][name], ...localState};
      if (name === 'dob' || name === 'dom') {
        if (merge.date1 && !merge.modalVisible) {
          if (merge.date2) {
            merge.value = new Date(
              merge.date1.getFullYear(),
              merge.date1.getMonth(),
              merge.date1.getDate(),
              merge.date2.getHours(),
              merge.date2.getMinutes(),
            );
          } else {
            merge.value = new Date(merge.date1);
          }
        }
      }
      let changedValue = false;
      if (merge.value) {
        changedValue =
          initialState[kind][name].value === merge.value ? false : true;
      }
      merge.timeStamp = changedValue ? new Date() : null;
      const mutableState = {...state};
      mutableState[kind][name] = merge;
      return mutableState;
    });
  };

  const combinedReset = (initialFormikValues) => {
    setGlobalStats((state) => {
      const mutableState = {...state};
      const relevantHalf = state[kind];
      for (const [formikKey, formikValue] of Object.entries(
        initialFormikValues,
      )) {
        for (const [key, value] of Object.entries(relevantHalf)) {
          if (formikKey === key) {
            mutableState[kind][key] = initialState[kind][key];
            break;
          }
        }
      }
      return mutableState;
    });
    setReset(true);
  };

  useEffect(() => {
    let localName = name;
    if (localName.length === 2 && localName !== 'hc') {
      localName = 'day' + localName.charAt(1);
    }
    if (!reset) {
      setFieldValue(localName, value);
    } else {
      handleReset();
      setReset(false);
    }
  }, [value, reset, kind, name, setFieldValue, handleReset]);

  return {combinedSetter, combinedReset, buttonState, initialState};
};
