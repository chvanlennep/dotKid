import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  Modal,
  StyleSheet,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { useFormikContext } from 'formik';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import ButtonIcon from '../buttons/ButtonIcon';
import AppText from '../AppText';

const modalWidth =
  defaultStyles.container.width > 360 ? 360 : defaultStyles.container.width;

const FluidIntervalSelector = ({ kind = 'neonate', name = 'interval' }) => {
  const ios = Platform.OS === 'ios' ? true : false;

  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState(`Interval: 3 hourly`);
  const [showReset, setShowReset] = useState(false);
  const [localInterval, setLocalInterval] = useState('3 hourly');

  const { setFieldValue, values } = useFormikContext();
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const darkBackgroundColor =
    kind === 'child' ? colors.darkPrimary : colors.darkSecondary;

  const toggleGestInput = () => {
    if (modalVisible) {
      if (localInterval !== values[name]) {
        setButtonText(`Interval: ${localInterval}`);
        setShowReset(true);
        setFieldValue(name, localInterval);
      }
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  const cancelInput = () => {
    setLocalInterval(values[name]);
    setModalVisible(false);
  };

  const resetInput = () => {
    setFieldValue(name, '3 hourly');
    setLocalInterval('3 hourly');
    setButtonText(`Interval: 3 hourly`);
    setShowReset(false);
  };

  useEffect(() => {
    if (localInterval !== values[name] && showReset && !modalVisible) {
      setButtonText(`Interval: ${values[name]}`);
      setLocalInterval(values[name]);
      setShowReset(false);
    }
  }, [localInterval, values[name], showReset, modalVisible]);

  return (
    <React.Fragment>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleGestInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="watch" />
              <AppText style={{ color: colors.white }}>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showReset && (
            <TouchableOpacity onPress={resetInput}>
              <ButtonIcon name="refresh" />
            </TouchableOpacity>
          )}
        </View>
      </View>
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
                {
                  backgroundColor:
                    dark && ios ? darkBackgroundColor : colors.light,
                },
              ]}
            >
              <View style={styles.pickerContainer}>
                <Picker
                  style={ios ? styles.iosPicker : styles.androidPicker}
                  itemStyle={{ color: dark ? colors.white : colors.black }}
                  onValueChange={(itemValue, itemIndex) => {
                    setLocalInterval(itemValue);
                  }}
                  selectedValue={localInterval}
                >
                  <Picker.Item label="1 hourly" value="1 hourly" />
                  <Picker.Item label="2 hourly" value="2 hourly" />
                  <Picker.Item label="3 hourly" value="3 hourly" />
                  <Picker.Item label="4 hourly" value="4 hourly" />
                </Picker>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.closeIcon}>
                  <TouchableOpacity onPress={cancelInput}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={dark && ios ? colors.white : colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.acceptIcon}>
                  <TouchableOpacity onPress={toggleGestInput}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      color={dark && ios ? colors.white : colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default FluidIntervalSelector;

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
    padding: 10,
  },
  iosPicker: {
    height: 200,
    width: modalWidth,
  },
  androidPicker: {
    height: 100,
    width: modalWidth - 20,
  },
  pickerContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
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
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 20,
  },
  note: {
    textAlign: 'center',
    fontSize: 15,
    padding: 5,
  },
  buttonContainer: {
    width: modalWidth,
    //backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonTextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
  },
});
