import React, {useState} from 'react';

const GlobalStatsContext = React.createContext({});

const textListChild = [
  {height: ''},
  {weight: ''},
  {hc: ''},
  {systolic: ''},
  {diastolic: ''},
  {rrinterval: ''},
  {qtinterval: ''},
  {correction: '100'},
];
const textListNeonate = [
  {length: ''},
  {weight: ''},
  {hc: ''},
  {correction: '100'},
  {sbr: ''},
  {t1: '60'},
  {t2: '80'},
  {t3: '100'},
  {t4: '120'},
  {t5: '150'},
  {p1: '60'},
  {p2: '80'},
  {p3: '100'},
  {p4: '120'},
  {p5: '150'},
];
const blanksBoth = {
  text: {
    showTextInput: false,
    showCancel: false,
    value: '',
    timeStamp: null,
    text: '',
  },
  gestationInDays: {
    modalVisible: false,
    showReset: false,
    timeStamp: null,
    days: 0,
  },
  sex: {
    buttonText: 'Sex',
    modalVisible: false,
    showCancel: false,
    timeStamp: null,
    value: '',
    sex: 'Female',
  },
  date: {
    showCancel: false,
    modalVisible: false,
    showCancelTime: false,
    showPickerDateAndroid: false,
    showPickerTimeAndroid: false,
    value: null,
    timeStamp: null,
    date1: null,
    date2: null,
  },
};
const gestChild = {
  weeks: 40,
  value: 280,
};
const gestNeonate = {
  weeks: 37,
  value: 0,
};
const dates = {
  dob: {
    text1: 'Date of Birth',
    text2: 'Time of Birth',
  },
  dom: {
    text1: 'Measured: Today',
    text2: 'Measured: Now',
  },
};
const generateInitialState = () => {
  const mutableObject = {child: {}, neonate: {}};
  for (let i = 0; i < textListChild.length; i++) {
    const [key] = Object.keys(textListChild[i]);
    const value = textListChild[i][key];
    mutableObject.child[key] = {...blanksBoth.text, ...{value: value}};
  }
  for (let i = 0; i < textListNeonate.length; i++) {
    const [key] = Object.keys(textListNeonate[i]);
    const value = textListNeonate[i][key];
    mutableObject.neonate[key] = {...blanksBoth.text, ...{value: value}};
  }
  for (const [key, value] of Object.entries(blanksBoth)) {
    if (key === 'gestationInDays') {
      mutableObject.child[key] = {...value, ...gestChild};
      mutableObject.neonate[key] = {...value, ...gestNeonate};
    } else if (key === 'date') {
      for (const [dateKey, dateValue] of Object.entries(dates)) {
        mutableObject.child[dateKey] = {...value, ...dateValue};
        mutableObject.neonate[dateKey] = {...value, ...dateValue};
      }
    } else if (key !== 'text') {
      mutableObject.child[key] = value;
      mutableObject.neonate[key] = value;
    }
  }
  return mutableObject;
};
const initialState = generateInitialState();

const GlobalStatsProvider = ({children}) => {
  const [globalStats, setGlobalStats] = useState(generateInitialState());

  const moveDataAcrossGlobal = (movingTo, initialFormikValues) => {
    const swapParts = (oldMeasurements, newMeasurements) => {
      const mutableObject = {...newMeasurements};
      for (const [key, value] of Object.entries(oldMeasurements)) {
        let newKey = '';
        let newValue = {};
        for (const [k, v] of Object.entries(initialFormikValues)) {
          if (k === key) {
            newKey = key;
            newValue = value;
            break;
          }
        }
        if (movingTo === 'neonate') {
          if (key === 'height') {
            newKey = 'length';
          }
        } else if (movingTo === 'child') {
          if (key === 'length') {
            newKey = 'height';
          }
        }
        if (newKey) {
          mutableObject[newKey] = newValue;
        }
      }
      return mutableObject;
    };
    setGlobalStats((state) => {
      let oldMeasurements = {...state.child};
      let newMeasurements = {...state.neonate};
      if (movingTo === 'child') {
        oldMeasurements = {...state.neonate};
        newMeasurements = {...state.child};
      }
      newMeasurements = swapParts(oldMeasurements, newMeasurements);
      let child;
      let neonate;
      if (movingTo === 'neonate') {
        child = oldMeasurements;
        neonate = newMeasurements;
      } else if (movingTo === 'child') {
        child = newMeasurements;
        neonate = oldMeasurements;
      }

      return {child, neonate};
    });
  };

  const setSingleGlobalStats = (kind, name, value, timeStamp = 'add') => {
    setGlobalStats((oldState) => {
      const mutableState = {...oldState};
      mutableState[kind][name].value = value;
      if (timeStamp === 'add') {
        mutableState[kind][name].timeStamp = new Date();
      } else if (timeStamp === 'remove') {
        mutableState[kind][name].timeStamp = null;
      }
      return mutableState;
    });
  };

  return (
    <GlobalStatsContext.Provider
      value={{
        globalStats,
        setGlobalStats,
        setSingleGlobalStats,
        moveDataAcrossGlobal,
      }}>
      {children}
    </GlobalStatsContext.Provider>
  );
};

export {GlobalStatsContext, GlobalStatsProvider, initialState};
