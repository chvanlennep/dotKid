import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useFormikContext} from 'formik';

import colors from '../../../config/colors';
import ButtonIcon from '../ButtonIcon';
import ErrorMessage from '../../ErrorMessage';
import defaultStyles from '../../../config/styles';
import AppText from '../../AppText';
import {formatDate, formatTime} from '../../../brains/oddBits';
import useCombined from '../../../brains/useCombined';

const modalWidth =
  defaultStyles.container.width > 350 ? 350 : defaultStyles.container.width;

const DateTimeInputButton = ({kind, type, renderTime = false}) => {
  const ios = Platform.OS === 'ios' ? true : false;
  const android = Platform.OS === 'android' ? true : false;
  const dateName = type === 'birth' ? 'dob' : 'dom';
  const style = useColorScheme();
  const dark = style === 'dark' ? true : false;
  const darkColor =
    kind === 'child' ? colors.darkPrimary : colors.darkSecondary;
  const cancelIcon = type === 'birth' ? 'delete-forever' : 'refresh';
  const majorVersionIOS = ios ? parseInt(Platform.Version, 10) : null;
  const fancyPicker =
    majorVersionIOS >= 14 && kind === 'neonate' ? true : false;

  const {combinedSetter, buttonState, initialState} = useCombined(
    kind,
    dateName,
  );

  const {
    date1,
    date2,
    value,
    showCancel,
    modalVisible,
    showCancelTime,
    showPickerDateAndroid,
    showPickerTimeAndroid,
    text1,
    text2,
  } = buttonState;

  const blankDob = 'Date of Birth';
  const blankDobCombined = 'Date and Time of Birth';
  const blankDom = 'Measured: Today';
  const blankDomCombined = 'Measured: Now';

  const accurateMinutes =
    kind === 'neonate' && ios && fancyPicker ? true : false;

  const isCombinedLabel = () => {
    if (renderTime && !(!renderTime && kind === 'neonate')) {
      return true;
    }
  };

  let iosText = '';
  if (ios) {
    if (!showCancel) {
      if (type === 'birth') {
        iosText = isCombinedLabel() ? blankDobCombined : blankDob;
      } else {
        iosText = isCombinedLabel() ? blankDomCombined : blankDom;
      }
    } else if (showCancel) {
      if (type === 'birth') {
        iosText = isCombinedLabel()
          ? `DOB: ${formatDate(value)} at ${formatTime(value, accurateMinutes)}`
          : blankDob + ': ' + formatDate(value);
      } else {
        iosText = isCombinedLabel()
          ? `Measured on ${formatDate(value)} at ${formatTime(
              value,
              accurateMinutes,
            )}`
          : `Measured on ${formatDate(value)}`;
      }
    }
  }

  const {errors, touched} = useFormikContext();

  const onChangeDateIos = (event, selected) => {
    const currentDate = selected || date1;
    combinedSetter({date1: currentDate});
  };
  const cancelInputIos = () => {
    if (modalVisible) {
      combinedSetter({
        modalVisible: false,
        date1: value,
        date2: value,
      });
    } else if (!modalVisible) {
      combinedSetter(initialState[kind][dateName]);
    }
  };
  const togglePickerIos = () => {
    let workingObject = {};
    if (modalVisible) {
      if (type === 'birth') {
        workingObject.showCancel = true;
      } else if (type === 'measured') {
        workingObject.date1 = null;
        workingObject.date2 = null;
        if (!isCombinedLabel()) {
          if (formatDate(date1) !== formatDate(new Date())) {
            workingObject.showCancel = true;
            workingObject.date1 = date1;
          }
        } else if (isCombinedLabel()) {
          if (
            formatDate(date1) !== formatDate(new Date()) ||
            formatTime(date1, accurateMinutes) !==
              formatTime(new Date(), accurateMinutes)
          ) {
            workingObject.showCancel = true;
            workingObject.date1 = date1;
            workingObject.date2 = date1;
          }
        }
      }
      workingObject.modalVisible = false;
      combinedSetter(workingObject);
    } else if (!modalVisible) {
      workingObject.modalVisible = true;
      if (!date1) {
        workingObject.date1 = new Date();
      }
      combinedSetter(workingObject);
    }
  };

  const openPickerDateAndroid = () => {
    let workingObject = {};
    if (!date1) {
      workingObject.date1 = new Date();
    }
    workingObject.showPickerDateAndroid = true;
    combinedSetter(workingObject);
  };
  const openPickerTimeAndroid = () => {
    let workingObject = {};
    if (!date2) {
      workingObject.date2 = new Date();
    }
    workingObject.showPickerTimeAndroid = true;
    combinedSetter(workingObject);
  };
  const cancelInputAndroid = () => {
    combinedSetter(initialState[kind][dateName]);
  };
  const onChangeAndroidDate = (event, selected) => {
    let workingObject = {};
    if (event.type === 'set') {
      const current = selected || date1;
      if (
        type === 'birth' ||
        (type === 'measured' && formatDate(current) !== formatDate(new Date()))
      ) {
        workingObject.showCancel = true;
        workingObject.date1 = current;
        if (type === 'birth') {
          workingObject.text1 = blankDob + ': ' + formatDate(current);
        } else {
          workingObject.text1 = `Measured on ${formatDate(current)}`;
        }
      } else {
        workingObject.showCancel = false;
        workingObject.date1 = null;
        workingObject.value = null;
        workingObject.text1 = initialState[kind][dateName].text1;
      }
      workingObject.showPickerDateAndroid = false;
      combinedSetter(workingObject);
    } else {
      if (!showCancel) {
        workingObject.date1 = null;
        workingObject.showPickerDateAndroid = false;
      } else {
        workingObject.date1 = value;
        workingObject.showPickerDateAndroid = false;
      }
      combinedSetter(workingObject);
    }
  };
  const onChangeAndroidTime = (event, selected) => {
    let workingObject = {};
    if (event.type === 'set') {
      const current = selected || date2;
      if (
        type === 'birth' ||
        (type === 'measured' && formatTime(current) !== formatTime(new Date()))
      ) {
        workingObject.showCancelTime = true;
        workingObject.date2 = current;
        if (type === 'birth') {
          workingObject.text2 = `Time of Birth: ${formatTime(current)}`;
        } else {
          workingObject.text2 = `Measured at ${formatTime(current)}`;
        }
      } else {
        workingObject.showCancelTime = false;
        workingObject.date2 = null;
        workingObject.text2 = initialState[kind][dateName].text2;
      }
      workingObject.showPickerTimeAndroid = false;
      combinedSetter(workingObject);
    } else {
      if (!showCancelTime) {
        workingObject.date2 = null;
        workingObject.showPickerTimeAndroid = false;
      } else {
        workingObject.date2 = value;
        workingObject.showPickerTimeAndroid = false;
      }
      combinedSetter(workingObject);
    }
  };

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity
          onPress={() => (ios ? togglePickerIos() : openPickerDateAndroid())}>
          <View style={styles.textBox}>
            <ButtonIcon name="calendar-range" />
            <AppText style={{color: colors.white}}>
              {ios ? iosText : text1}
            </AppText>
          </View>
        </TouchableOpacity>
        {showCancel && (
          <TouchableOpacity
            onPress={() => (ios ? cancelInputIos() : cancelInputAndroid())}>
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
                <AppText style={{color: colors.white}}>{text2}</AppText>
              </View>
            </TouchableOpacity>
            {showCancelTime && (
              <TouchableOpacity onPress={() => cancelInputAndroid()}>
                <ButtonIcon name={cancelIcon} />
              </TouchableOpacity>
            )}
          </View>
          <ErrorMessage error={errors[dateName]} visible={touched[dateName]} />
        </React.Fragment>
      )}
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelInputIos}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor:
                    dark && fancyPicker ? darkColor : colors.light,
                },
              ]}>
              <View
                style={
                  fancyPicker
                    ? styles.iosDatePickerContainer
                    : styles.iosDatePickerContainerLegacy
                }>
                {fancyPicker && (
                  <DateTimePicker
                    testID="datePicker14"
                    value={date1}
                    minuteInterval={15}
                    mode="datetime"
                    display="inline"
                    onChange={onChangeDateIos}
                    style={styles.iosDatePicker}
                  />
                )}
                {!fancyPicker && (
                  <DateTimePicker
                    testID="datePickerLegacy"
                    value={date1}
                    minuteInterval={15}
                    mode={kind === 'neonate' ? 'datetime' : 'date'}
                    display="spinner"
                    onChange={onChangeDateIos}
                    style={styles.iosDatePickerLegacy}
                    textColor={colors.black}
                  />
                )}
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.closeIcon}>
                  <TouchableOpacity onPress={cancelInputIos}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={dark && fancyPicker ? colors.white : colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.acceptIcon}>
                  <TouchableOpacity onPress={togglePickerIos}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      color={dark && fancyPicker ? colors.white : colors.black}
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
          testID="datePickerAndroid"
          value={date1}
          mode="date"
          display="spinner"
          onChange={onChangeAndroidDate}
        />
      )}
      {showPickerTimeAndroid && android && renderTime && (
        <DateTimePicker
          testID="datePickerAndroid"
          value={date2}
          mode="time"
          display="spinner"
          onChange={onChangeAndroidTime}
          minuteInterval={15}
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
    marginTop: 10,
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
  iosDatePickerContainerLegacy: {
    height: 150,
    //backgroundColor: 'black',
    width: modalWidth,
  },
  iosDatePickerLegacy: {
    height: 150,
  },
  iosDatePickerContainer: {
    height: 380,
    width: defaultStyles.windowWidth * 0.95,
    //backgroundColor: 'black',
  },
  iosDatePicker: {
    height: 380,
    width: defaultStyles.windowWidth * 0.95 - 25,
    //backgroundColor: 'green',
    alignSelf: 'center',
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
