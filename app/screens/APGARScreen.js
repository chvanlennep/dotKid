import React, {useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../app/config/colors';
import AppText from '../components/AppText';
import AppForm from '../components/AppForm';
import APGARButton from '../components/buttons/input/APGARButton';
import AssessBabyTitle from '../components/AssessBabyTitle';
import NCalcScreen from '../components/NCalcScreen';
import {containerWidth} from '../config/styles';
import defaultStyles from '../config/styles';
import ButtonIcon from '../components/buttons/ButtonIcon';

const allPickerDetails = [
  {
    name: 'Appearance',
    iconName: 'human-handsdown',
    pickerContent: [
      {value: 'Blue or pale all over'},
      {value: 'Blue at extremities'},
      {value: 'Normal colour'},
    ],
  },
  {
    name: 'Pulse rate',
    iconName: 'heart-pulse',
    pickerContent: [
      {value: 'Absent'},
      {value: '<100 beats per minute'},
      {value: '≥100 beats per minute'},
    ],
  },
  {
    name: 'Grimace',
    iconName: 'emoticon-cry-outline',
    pickerContent: [
      {value: 'No response'},
      {value: 'Aggressive stimulation'},
      {value: 'Crying'},
    ],
  },
  {
    name: 'Activity',
    iconName: 'run',
    pickerContent: [
      {value: 'None'},
      {value: 'Some flexion'},
      {value: 'Arms & legs flexed'},
    ],
  },
  {
    name: 'Respiratory Effort',
    iconName: 'weather-windy',
    pickerContent: [
      {value: 'Absent'},
      {value: 'Weak, irregular, gasping'},
      {value: 'Strong, robust cry'},
    ],
  },
];

const apgarArray = [
  'Appearance',
  'Pulse rate',
  'Grimace',
  'Activity',
  'Respiratory Effort',
];

const makeInitialPickerState = () => {
  let i = 0;
  const workingObject = {};
  while (i < apgarArray.length) {
    workingObject[apgarArray[i]] = {
      open: apgarArray[i] === 'Appearance' ? true : false,
      color: false,
      filled: false,
      cancelled: false,
      submitForm: false,
    };
    i++;
  }
  return workingObject;
};

const APGARScreen = () => {
  const [pickerState, setPickerState] = useState(makeInitialPickerState());
  const [pickerText, setPickerText] = useState(apgarArray[0]);
  const [submitForm, setSubmitForm] = useState(false);
  const [resetForm, setResetForm] = useState(false);
  const [results, setResults] = useState('');
  const [totalScore, setTotalScore] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [displayOutput, setDisplayOutput] = useState(false);

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
      <APGARButton
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

  const togglePicker = name => {
    for (let i = 0; i < apgarArray.length; i++) {
      if (name !== apgarArray[i]) {
        if (pickerState[apgarArray[i]].open) {
          changePickerState(apgarArray[i], 'open', false);
          changePickerState(name, 'open', true);
          setPickerText(name);
          break;
        }
      }
    }
  };

  const handlePress = () => {
    setModalVisible(true);
  };

  const handleClosePress = () => {
    setModalVisible(false);
  };

  const initialValues = {};
  apgarArray.map(item => (initialValues[item] = ''));

  const handleFormikSubmit = values => {
    let submitArray = [];
    let localScore = 0;
    for (let i = 0; i < apgarArray.length; i++) {
      const indexValue = values[apgarArray[i]];
      localScore += indexValue;
      const labelValue = allPickerDetails[i].pickerContent[indexValue].value;
      submitArray.push(`${apgarArray[i]}: ${indexValue} (${labelValue})\n\n`);
    }
    setModalVisible(false);
    setTotalScore(`${localScore}`);
    setResults(submitArray);
    setPickerState(makeInitialPickerState());
    setPickerText(apgarArray[0]);
    setDisplayOutput(true);
  };

  // tick button pressed
  useEffect(() => {
    for (let i = 0; i < apgarArray.length; i++) {
      if (pickerState[apgarArray[i]].filled) {
        // checks for all buttons filled in and starts logic to submit and close modal if true:
        let completed = 0;
        for (let i = 0; i < apgarArray.length; i++) {
          if (pickerState[apgarArray[i]]['color']) {
            completed++;
          }
        }
        if (completed === apgarArray.length - 1 && !submitForm) {
          setSubmitForm(true);
          break;
        }
        // fill in button colour and move onto next picker:
        changePickerState(apgarArray[i], 'color', true);
        changePickerState(apgarArray[i], 'filled', false);
        changePickerState(apgarArray[i], 'open', false);
        let newName;
        if (i === apgarArray.length - 1) {
          newName = apgarArray[0];
        } else {
          newName = apgarArray[i + 1];
        }
        changePickerState(newName, 'open', true);
        setPickerText(newName);
        break;
      }
    }
  }, [pickerState, apgarArray, submitForm]);

  // Cancel button pressed
  useEffect(() => {
    for (let i = 0; i < apgarArray.length; i++) {
      if (pickerState[apgarArray[i]].cancelled) {
        changePickerState(apgarArray[i], 'cancelled', false);
        changePickerState(apgarArray[i], 'open', false);
        if (i === 0) {
          changePickerState(apgarArray[apgarArray.length - 1], 'open', true);
          setPickerText(apgarArray[apgarArray.length - 1]);
        } else {
          changePickerState(apgarArray[i - 1], 'open', true);
          setPickerText(apgarArray[i - 1]);
        }
        break;
      }
    }
  }, [pickerState]);

  return (
    <NCalcScreen style={{flex: 1}}>
      <ScrollView>
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.button}>
              <View style={styles.textBox}>
                <ButtonIcon name="human-handsdown" />
                <AppText style={{color: colors.white}}>
                  APGAR - Press to assess
                </AppText>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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

              <View style={styles.input}>
                <AppForm
                  initialValues={initialValues}
                  onSubmit={handleFormikSubmit}>
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
          </View>
        </Modal>
        {displayOutput && (
          <View style={styles.outputBox}>
            <AppText style={styles.title}>APGAR Score: {totalScore}</AppText>
            <AppText style={styles.text}>{results}</AppText>
          </View>
        )}
      </ScrollView>
    </NCalcScreen>
  );
};

export default APGARScreen;

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.container,
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 15,
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
  closeIcon: {
    height: 50,
    width: 50,
    // backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    alignSelf: 'center',
    color: colors.white,
    fontWeight: '500',
    fontSize: 20,
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: colors.dark,
    borderRadius: 15,
    margin: 10,
    padding: 10,
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
    alignSelf: 'center',
  },
  miniButton: {
    borderRadius: 10,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outputBox: {
    backgroundColor: colors.light,
    height: 350,
    margin: 10,
    borderRadius: 15,
    padding: 10,
  },
  text: {
    fontSize: defaultStyles.windowWidth < 375 ? 16 : 20,
    marginBottom: defaultStyles.windowHeight <= 812 ? 3 : 8,
    marginTop: defaultStyles.windowHeight <= 812 ? 0 : 5,
    marginLeft: 18,
    color: colors.black,
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
  },
  title: {
    fontSize: defaultStyles.windowWidth < 375 ? 20 : 24,
    marginBottom: defaultStyles.windowHeight <= 812 ? 5 : 10,
    marginTop: defaultStyles.windowHeight <= 812 ? 0 : 5,
    marginLeft: 18,
    color: colors.black,
  },
  touchable: {
    alignSelf: 'flex-start',
    //backgroundColor: "blue",
  },
});
