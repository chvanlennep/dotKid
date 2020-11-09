import React, { useEffect, useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import colors from '../../app/config/colors';
import defaultStyles from '../../app/config/styles';
import AppText from './AppText';
import ALSListHeader from './buttons/ALSListHeader';
import AppForm from '../components/AppForm';
import AssessBabyInput from '../components/buttons/input/AssessBabyInput';
import AssessBabyTitle from './AssessBabyTitle';

const InitialAssessBabyModal = ({
  initialAssessmentState,
  assessmentState,
  logState,
  resetState,
  timerState,
}) => {
  const nameArray = [
    'Dry and Wrap Baby',
    'Hat On',
    'Heart Rate',
    'Breathing',
    'Colour',
    'Tone',
  ];

  const makeInitialPickerState = () => {
    let i = 0;
    const workingObject = {};
    while (i < nameArray.length) {
      workingObject[nameArray[i]] = {
        open: nameArray[i] === 'Dry and Wrap Baby' ? true : false,
        color: false,
        filled: false,
        cancelled: false,
        submitForm: false,
      };
      i++;
    }
    return workingObject;
  };

  const setAssessBaby = assessmentState.setValue;
  const [modalVisible, setModalVisible] = useState(false);
  const [pickerState, setPickerState] = useState(makeInitialPickerState());
  const [pickerText, setPickerText] = useState(nameArray[0]);
  const [submitForm, setSubmitForm] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const allPickerDetails = [
    {
      name: 'Dry and Wrap Baby',
      iconName: 'tumble-dryer',
      pickerContent: [{ value: 'Done' }, { value: 'Not Done' }],
    },
    {
      name: 'Hat On',
      iconName: 'hat-fedora',
      pickerContent: [{ value: 'Done' }, { value: 'Not Done' }],
    },
    {
      name: 'Heart Rate',
      iconName: 'heart-pulse',
      pickerContent: [{ value: '<60' }, { value: '60-100' }, { value: '>100' }],
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
      name: 'Colour',
      iconName: 'percent',
      pickerContent: [
        { value: 'Pale' },
        { value: 'Blue' },
        { value: 'Blue extremities' },
        { value: 'Pink' },
      ],
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
    return (
      <AssessBabyInput
        key={index}
        pickerDetails={allPickerDetails[index]}
        pickerStateObject={[pickerState, setPickerState]}
      />
    );
  });

  const changePickerState = (name, key, value) => {
    setPickerState((pickerState) => {
      const workingState = { ...pickerState };
      workingState[name][key] = value;
      return workingState;
    });
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
          name === 'Saturations'
            ? setPickerText(`Colour +/- Saturations`)
            : setPickerText(name);
          break;
        }
      }
    }
  };

  const reset = resetState.value;

  const functionButtons = logState.value;
  const setFunctionButtons = logState.setValue;

  const initialAssessmentComplete = initialAssessmentState.value;
  const setInitialAssessmentComplete = initialAssessmentState.setValue;

  const setIsTimerActive = timerState.setValue;

  const initialValues = {};
  nameArray.map((item) => (initialValues[item] = ''));

  // logs time with event button. This has been modified from the others to make sure dry / wrap and hat on appear in order
  const updateTime = (submitArray, oldState) => {
    for (let i = 0; i < submitArray.length; i++) {
      const addTime = (date, millisecs) => {
        date.setTime(date.getTime() + millisecs);
        return date;
      };
      const timeStamp = addTime(new Date(), i * 5);
      const title = submitArray[i];
      const oldButtonArray = oldState[title];
      const newButtonArray = oldButtonArray.concat(timeStamp);
      setFunctionButtons((oldState) => {
        const updatingState = oldState;
        updatingState[title] = newButtonArray;
        return updatingState;
      });
    }
  };

  const handleFormikSubmit = (values) => {
    let submitArray = [];
    for (let i = 0; i < nameArray.length; i++) {
      const key = nameArray[i];
      const value = values[nameArray[i]];
      if (key === 'Dry and Wrap Baby' || key === 'Hat On') {
        if (value === 'Done') submitArray.push(key);
      } else {
        submitArray.push(value);
      }
    }
    updateTime(submitArray, functionButtons);
    setPickerText(nameArray[0]);
    setPickerState(makeInitialPickerState());
    setInitialAssessmentComplete(true);
    setAssessBaby(true);
    setModalVisible(false);
  };

  const handlePress = () => {
    if (initialAssessmentComplete) {
      Alert.alert(
        'One initial assessment per encounter. Please press "Assess Baby" if you wish to complete a further assessment',
        '',
        [
          {
            text: 'Ok',
            onPress: () => 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      setIsTimerActive(true);
      setModalVisible(true);
    }
  };

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

  // reset button logic
  useEffect(() => {
    if (reset === true) {
      setInitialAssessmentComplete(false);
    }
  }, [reset]);

  // tick button pressed
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
        setPickerText(
          newName === 'Saturations' ? `Colour +/- Saturations` : newName
        );
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
      <ALSListHeader
        iconColor={initialAssessmentComplete ? colors.secondary : colors.dark}
        isModal={true}
        initialAssessmentState={initialAssessmentState}
        onPress={handlePress}
        style={[
          !initialAssessmentComplete && styles.headingButton,
          initialAssessmentComplete && styles.buttonPressed,
        ]}
        title="Initial Assessment..."
      />
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
              <AppText style={styles.heading}>Initial Assessment</AppText>
              <AppForm
                initialValues={initialValues}
                onSubmit={handleFormikSubmit}
              >
                <View style={styles.buttonRow}>{renderTopButtons}</View>
                <AssessBabyTitle
                  submitObject={[submitForm, setSubmitForm]}
                  resetObject={[resetForm, setResetForm]}
                >{`${pickerText}:`}</AssessBabyTitle>
                {renderInputs}
              </AppForm>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default InitialAssessBabyModal;
const styles = StyleSheet.create({
  assessment: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    margin: 10,
    padding: 7,
    paddingBottom: 15,
  },
  buttonPressed: {
    backgroundColor: colors.secondary,
    width: defaultStyles.container.width - 5,
    alignSelf: 'center',
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
    marginBottom: 10,
  },
  headingButton: {
    width: defaultStyles.container.width - 5,
    alignSelf: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#096534',
  },
  options: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  buttonRow: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
    //backgroundColor: 'white',
    //flexWrap: 'wrap',
  },
  miniButton: {
    borderRadius: 10,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
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
  touchable: {
    alignSelf: 'flex-start',
    //backgroundColor: "blue",
  },
});
