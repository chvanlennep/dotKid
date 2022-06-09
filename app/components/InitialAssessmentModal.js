import React, {useEffect, useState} from 'react';
import {Alert, Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../app/config/colors';
import {containerWidth} from '../../app/config/styles';
import AppText from './AppText';
import ALSListHeader from './buttons/ALSListHeader';
import AppForm from '../components/AppForm';
import AssessBabyInput from '../components/buttons/input/AssessBabyInput';
import AssessBabyTitle from './AssessBabyTitle';
import {initialAssessmentDetails} from '../brains/nlsObjects';
import {nlsStore} from '../brains/stateManagement/nlsState.store';
import {observer} from 'mobx-react';

const InitialAssessBabyModal = observer(({resetState, timerState}) => {
  const nameArray = initialAssessmentDetails.map(({name}) => name);

  const makeInitialPickerState = () => {
    const workingObject = {};
    nameArray.forEach(name => {
      workingObject[name] = {
        open: name === 'Dry and Wrap Baby' ? true : false,
        color: false,
        filled: false,
        cancelled: false,
        submit: false,
      };
    });

    return workingObject;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [pickerState, setPickerState] = useState(makeInitialPickerState());
  const [pickerText, setPickerText] = useState(nameArray[0]);
  const [submitForm, setSubmitForm] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const allPickerDetails = initialAssessmentDetails;
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
        ]}>
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
    setPickerState(pickerState => {
      const workingState = {...pickerState};
      workingState[name][key] = value;
      return workingState;
    });
  };

  console.log({nameArray});
  const togglePicker = name => {
    for (let i = 0; i < nameArray.length; i++) {
      if (name !== nameArray[i]) {
        if (pickerState[nameArray[i]].open) {
          if (!pickerState[nameArray[i].color]) {
          }
          changePickerState(nameArray[i], 'open', false);
          changePickerState(name, 'open', true);
          name === 'Saturations'
            ? setPickerText('Colour +/- Saturations')
            : setPickerText(name);
          break;
        }
      }
    }
  };

  const reset = resetState.value;

  const initialAssessmentComplete = Boolean(
    nlsStore.getFunctionButtonTime('Baby Assessed:').length,
  );

  const setIsTimerActive = timerState.setValue;

  const initialValues = {};
  nameArray.map(item => (initialValues[item] = ''));

  // logs time with event button. This has been modified from the others to make sure dry / wrap and hat on appear in order
  const updateTime = submitArray => {
    nlsStore.addTime('Baby Assessed:');
    for (let i = 0; i < submitArray.length; i++) {
      const title = submitArray[i];
      nlsStore.addTimeHandler(title);
    }
  };

  const handleSubmit = values => {
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
    console.log({submitArray});
    updateTime(submitArray);
    setPickerText(nameArray[0]);
    setPickerState(makeInitialPickerState());
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
        ],
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
      {cancelable: false},
    );
  };

  // tick button pressed
  useEffect(() => {
    for (let i = 0; i < nameArray.length; i++) {
      if (pickerState[nameArray[i]]['filled']) {
        // checks for all buttons filled in and starts logic to submit and close modal if true:
        let completed = 0;
        for (let i = 0; i < nameArray.length; i++) {
          if (pickerState[nameArray[i]]['color']) {
            completed++;
          }
        }
        console.log({completed});
        console.log(nameArray.length);
        console.log({submitForm});
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
          newName === 'Saturations' ? `Colour +/- Saturations` : newName,
        );
        break;
      }
    }
  }, [pickerState, nameArray, submitForm]);

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
  }, [pickerState, nameArray]);

  return (
    <React.Fragment>
      <ALSListHeader
        iconColor={initialAssessmentComplete ? colors.secondary : colors.dark}
        isModal={true}
        onPress={handlePress}
        style={[
          !initialAssessmentComplete && styles.headingButton,
          initialAssessmentComplete && styles.buttonPressed,
        ]}
        title="Initial Assessment..."
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClosePress}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.touchable}
              onPress={handleClosePress}>
              <View style={styles.closeIcon}>
                <MaterialCommunityIcons
                  name="close-circle"
                  color={colors.white}
                  size={30}
                />
              </View>
            </TouchableOpacity>
            <AppText style={styles.heading}>Initial Assessment</AppText>
            <AppForm initialValues={initialValues} onSubmit={handleSubmit}>
              <View style={styles.buttonRow}>{renderTopButtons}</View>
              <AssessBabyTitle
                submitObject={[submitForm, setSubmitForm]}
                resetObject={[
                  resetForm,
                  setResetForm,
                ]}>{`${pickerText}:`}</AssessBabyTitle>
              {renderInputs}
            </AppForm>
          </View>
        </View>
      </Modal>
    </React.Fragment>
  );
});

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
    width: containerWidth - 5,
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
    marginBottom: 10,
  },
  headingButton: {
    width: containerWidth - 5,
    alignSelf: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingBottom: 10,
    elevation: 5,
    width: containerWidth - 10,
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
