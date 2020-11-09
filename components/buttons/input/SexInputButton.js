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

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';
import { GlobalStateContext } from '../../GlobalStateContext';

const modalWidth =
  defaultStyles.container.width > 350 ? 350 : defaultStyles.container.width;

const SexInputButton = ({ global = false, kind, name = 'sex' }) => {
  const ios = Platform.OS === 'ios' ? true : false;

  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Sex');
  const [showCancel, setShowCancel] = useState(false);
  const [localSex, setLocalSex] = useState('');

  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const darkBackgroundColor =
    kind === 'child' ? colors.darkPrimary : colors.darkSecondary;

  const manageStats = {
    read: function (kind, measurementType) {
      return globalStats[kind][measurementType];
    },
    write: function (kind, measurementType, value) {
      if (kind === 'child') {
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          child[measurementType] = value;
          return { child, neonate };
        });
      } else if (kind === 'neonate')
        setGlobalStats((globalStats) => {
          const child = { ...globalStats.child };
          const neonate = { ...globalStats.neonate };
          neonate[measurementType] = value;
          return { child, neonate };
        });
    },
  };

  const globalSex = manageStats.read(kind, 'sex');

  const toggleSexInput = () => {
    if (modalVisible) {
      if (localSex) {
        setButtonText(`Sex: ${localSex}`);
        setShowCancel(true);
        if (!global) {
          setFieldValue(name, localSex);
        }
        manageStats.write(kind, 'sex', localSex);
      } else {
        setButtonText(`Sex`);
        setShowCancel(false);
      }
      setModalVisible(false);
    } else {
      if (!localSex) {
        setLocalSex('Female');
      }
      setModalVisible(true);
    }
  };

  const cancelInput = () => {
    if (modalVisible) {
      if (!globalSex) {
        setModalVisible(false);
        setLocalSex('');
      }
      if (globalSex) {
        setLocalSex(globalSex);
        setModalVisible(false);
      }
    } else {
      setButtonText('Sex');
      setLocalSex('');
      if (!global) {
        setFieldValue(name, '');
      }
      manageStats.write(kind, 'sex', '');
      setShowCancel(false);
    }
  };

  useEffect(() => {
    // button has been filled in by user:
    if (showCancel && localSex && !modalVisible) {
      if (!global) {
        // Reset by formik:
        if (!values[name]) {
          setShowCancel(false);
          setButtonText('Sex');
          manageStats.write(kind, 'sex', '');
          setLocalSex('');
        }
      }
      // Reset via global state:
      if (!globalSex) {
        setShowCancel(false);
        setButtonText('Sex');
        setLocalSex('');
        if (!global) {
          setFieldValue(name, '');
        }
      }
      // value changed by global state (must put no show picker / input otherwise value stuck):
      if (globalSex && globalSex !== localSex) {
        if (!global) {
          setFieldValue(name, globalSex);
        }
        setLocalSex(globalSex);
        setButtonText(`Sex: ${globalSex}`);
      }
    }
    // button has not been filled in by user:
    if (!showCancel && !localSex && !modalVisible) {
      // value updated via global state:
      if (globalSex) {
        if (!global) {
          setFieldValue(name, globalSex);
        }
        setLocalSex(globalSex);
        setButtonText(`Sex: ${globalSex}`);
        setShowCancel(true);
      }
    }
  });

  return (
    <React.Fragment>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleSexInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="all-inclusive" />
              <AppText style={{ color: colors.white }}>{buttonText}</AppText>
            </View>
          </TouchableOpacity>
          {showCancel && (
            <TouchableOpacity onPress={cancelInput}>
              <ButtonIcon name="delete-forever" />
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
                    setLocalSex(itemValue);
                  }}
                  selectedValue={localSex}
                >
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Male" value="Male" />
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
                  <TouchableOpacity onPress={toggleSexInput}>
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
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default SexInputButton;

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
    width: modalWidth - 50,
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
  buttonContainer: {
    width: modalWidth,
    //backgroundColor: 'orange',
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
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
  },
});
