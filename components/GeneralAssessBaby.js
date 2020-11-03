import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '../../app/config/colors';
import defaultStyles from '../../app/config/styles';
import ALSDisplayButton from './buttons/ALSDisplayButton';
import AppText from './AppText';
import AppForm from '../components/AppForm';
import O2Slider from './buttons/input/O2Slider';
import AssessBabyTimer from './AssessBabyTimer';
import AssessBabyInput from '../components/buttons/input/AssessBabyInput';
import AssessBabyTitle from './AssessBabyTitle';

const GeneralAssessBaby = ({
  assessmentState,
  assessmentTime,
  logState,
  resetState,
  timerState,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const nameArray = [
    'Chest Movement',
    'Breathing',
    'Heart Rate',
    'Saturations',
    'Inhaled O2',
    'Tone',
  ];

  const makeInitialPickerState = () => {
    let i = 0;
    const workingObject = {};
    while (i < nameArray.length) {
      workingObject[nameArray[i]] = {
        open: nameArray[i] === 'Chest Movement' ? true : false,
        color: false,
        filled: false,
        cancelled: false,
        submit: false,
      };
      i++;
    }
    return workingObject;
  };

  const [pickerState, setPickerState] = useState(makeInitialPickerState());
  const [pickerText, setPickerText] = useState(nameArray[0]);
  const [submitForm, setSubmitForm] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const allPickerDetails = [
    {
      name: 'Chest Movement',
      iconName: 'circle-expand',
      pickerContent: [{ value: 'Chest Not Moving' }, { value: 'Chest Moving' }],
    },
    {
      name: 'Breathing',
      iconName: 'weather-windy',
      pickerContent: [
        { value: 'Apnoeic' },
        { value: 'Inadequate Breathing' },
        { value: 'Adequate Breathing' },
      ],
    },
    {
      name: 'Heart Rate',
      iconName: 'heart-pulse',
      pickerContent: [{ value: '<60' }, { value: '60-100' }, { value: '>100' }],
    },
    {
      name: 'Saturations',
      iconName: 'percent',
    },
    {
      name: 'Inhaled O2',
      iconName: 'gas-cylinder',
    },
    {
      name: 'Tone',
      iconName: 'human-handsdown',
      pickerContent: [
        { value: 'Floppy' },
        { value: 'Poor Tone' },
        { value: 'Good Tone' },
      ],
    },
  ];
  const renderTopButtons = allPickerDetails.map((item, index) => (
    <TouchableOpacity onPress={() => togglePicker(item.name)} key={index}>
      <View
        style={[
          styles.miniButton,
          {
            backgroundColor:
              (pickerState[item.name]['color'] &&
                !pickerState[item.name]['open'] &&
                colors.secondary) ||
              (!pickerState[item.name]['open'] && colors.dark) ||
              (pickerState[item.name]['open'] && colors.black),
          },
        ]}
      >
        <MaterialCommunityIcons
          name={item.iconName}
          size={35}
          color={colors.white}
        />
      </View>
    </TouchableOpacity>
  ));

  const renderInputs = allPickerDetails.map((item, index) => {
    if (item.name === 'Inhaled O2') {
      return (
        <O2Slider
          key={index}
          type="fi"
          pickerStateObject={[pickerState, setPickerState]}
        />
      );
    } else if (item.name === 'Saturations') {
      return (
        <O2Slider
          key={index}
          type="sp"
          pickerStateObject={[pickerState, setPickerState]}
        />
      );
    } else {
      return (
        <AssessBabyInput
          key={index}
          pickerDetails={allPickerDetails[index]}
          pickerStateObject={[pickerState, setPickerState]}
        />
      );
    }
  });

  const changePickerState = (name, key, value) => {
    setPickerState((pickerState) => {
      const workingState = { ...pickerState };
      workingState[name][key] = value;
      return workingState;
    });
  };

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const assessBaby = assessmentState.value;
  const setAssessBaby = assessmentState.setValue;

  const setIsTimerActive = timerState.setValue;

  const initialValues = {};
  nameArray.map((item) => (initialValues[item] = ''));

  // logs time with event button
  const updateTime = (title, oldState, oxygen) => {
    const timeStamp = new Date();
    if (title === 'Inhaled O2' || title === 'Saturations') {
      oldState[`${title}: ${oxygen}%`] = [];
      const oldButtonArray = oldState[`${title}: ${oxygen}%`];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[`${title}: ${oxygen}%`] = newButtonArray;
        return updatingState;
      });
    } else {
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    }
  };

  //form submission
  const handleFormikSubmit = (values) => {
    for (const [key, value] of Object.entries(values)) {
      if (key === 'Inhaled O2') {
        updateTime('Inhaled O2', functionButtons, value);
      } else if (key === 'Saturations') {
        updateTime('Saturations', functionButtons, value);
      } else {
        updateTime(value, functionButtons);
      }
    }
    setModalVisible(false);
    setPickerText(nameArray[0]);
    setAssessBaby(true);
    setPickerState(makeInitialPickerState());
  };

  //starts timer and opens modal
  const handlePress = () => {
    setModalVisible(true);
    setIsTimerActive(true);
  };

  // user tries to close modal before completion:
  const handleClosePress = () => {
    Alert.alert(
      'Assessment Not Completed',
      '',
      [
        {
          text: 'Return to Assessment',
          style: 'cancel',
        },
        {
          text: 'Cancel Assessment',
          onPress: () => {
            setResetForm(true);
            setPickerText(nameArray[0]);
            setModalVisible(false);
            setPickerState(makeInitialPickerState());
          },
        },
      ],
      { cancelable: false }
    );
  };

  const togglePicker = (name) => {
    for (let i = 0; i < nameArray.length; i++) {
      if (name !== nameArray[i]) {
        if (pickerState[nameArray[i]]['open']) {
          if (!pickerState[nameArray[i]['color']]) {
            //Alert.alert('');
          }
          changePickerState(nameArray[i], 'open', false);
          changePickerState(name, 'open', true);
          setPickerText(name);
          break;
        }
      }
    }
  };

  // Logic for when the tick button is pressed:
  useEffect(() => {
    for (let i = 0; i < nameArray.length; i++) {
      if (pickerState[nameArray[i]]['filled']) {
        // checks for all buttons filled in and starts logic to submit and close modal if true:
        let completed = 0;
        for (let i = 0; i < nameArray.length; i++) {
          if (pickerState[nameArray[i]]['color']) completed++;
        }
        if (completed === nameArray.length - 1 && !submitForm) {
          setSubmitForm(true);
          break;
        }
        // fill in button colour and move onto next picker:
        changePickerState(nameArray[i], 'color', true);
        changePickerState(nameArray[i], 'filled', false);
        changePickerState(nameArray[i], 'open', false);
        let newName;
        if (i === nameArray.length - 1) {
          newName = nameArray[0];
        } else {
          newName = nameArray[i + 1];
        }
        changePickerState(newName, 'open', true);
        setPickerText(newName);
        break;
      }
    }
  }, [pickerState]);

  // Cancel button pressed
  useEffect(() => {
    for (let i = 0; i < nameArray.length; i++) {
      if (pickerState[nameArray[i]]['cancelled']) {
        changePickerState(nameArray[i], 'cancelled', false);
        changePickerState(nameArray[i], 'open', false);
        if (i === 0) {
          changePickerState(nameArray[nameArray.length - 1], 'open', true);
          setPickerText(nameArray[nameArray.length - 1]);
        } else {
          changePickerState(nameArray[i - 1], 'open', true);
          setPickerText(nameArray[i - 1]);
        }
        break;
      }
    }
  }, [pickerState]);

  return (
    <React.Fragment>
      <ALSDisplayButton
        onPress={handlePress}
        style={[style, assessBaby && styles.buttonPressed]}
      >
        Assess Baby
        {assessBaby && (
          <AssessBabyTimer
            assessmentState={assessmentState}
            assessmentTime={assessmentTime}
            resetState={resetState}
          />
        )}
      </ALSDisplayButton>

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Window has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <AppForm
              initialValues={initialValues}
              onSubmit={handleFormikSubmit}
            >
              <View style={styles.modalView}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={handleClosePress}
                >
                  <View style={styles.closeIcon}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={colors.white}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
                <AppText style={styles.heading}>Assess Baby</AppText>
                <View style={styles.sats}>
                  <AppText style={styles.text}>
                    Acceptable Pre-ductal Saturations:
                  </AppText>
                  <AppText style={styles.satsText}>
                    2 min: 60% | 3 min: 70% | 4 min: 80% {'\n'}5 min: 85% | 10
                    min: 90%
                  </AppText>
                </View>
                <View style={styles.buttonRow}>{renderTopButtons}</View>
                <AssessBabyTitle
                  submitObject={[submitForm, setSubmitForm]}
                  resetObject={[resetForm, setResetForm]}
                >{`${pickerText}:`}</AssessBabyTitle>
                {renderInputs}
              </View>
            </AppForm>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default GeneralAssessBaby;
const styles = StyleSheet.create({
  miniButton: {
    borderRadius: 10,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 5,
    paddingRight: 5,
    //backgroundColor: 'white',
    //flexWrap: 'wrap',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    //backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    alignSelf: 'center',
    color: colors.white,
    fontWeight: '500',
    fontSize: 20,
    marginTop: -30,
    marginBottom: 5,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    paddingBottom: 10,
    elevation: 5,
    width: defaultStyles.container.width - 10,
    //height: 500,
    backgroundColor: colors.darkSecondary,
  },
  options: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  sats: {
    justifyContent: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    height: 95,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 5,
    padding: 10,
  },
  satsText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 4,
    color: colors.white,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 3,
    color: colors.white,
  },
  buttonPressed: {
    backgroundColor: colors.secondary,
    flexWrap: 'nowrap',
    height: 80,
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  timerText: {
    textAlign: 'center',
    color: colors.white,
  },
});
