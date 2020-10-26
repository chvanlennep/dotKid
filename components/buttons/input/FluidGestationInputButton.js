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

const modalWidth =
  defaultStyles.container.width > 360 ? 360 : defaultStyles.container.width;

const FluidGestationInputButton = ({
  kind = 'neonate',
  name = 'gestation',
}) => {
  const ios = Platform.OS === 'ios' ? true : false;

  const [modalVisible, setModalVisible] = useState(false);
  const [buttonText, setButtonText] = useState('Birth Gestation: Term');
  const [showReset, setShowReset] = useState(false);
  const [localGestation, setLocalGestation] = useState('Term');

  const { setFieldValue, errors, touched, values } = useFormikContext();
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const darkBackgroundColor =
    kind === 'child' ? colors.darkPrimary : colors.darkSecondary;

  const toggleGestInput = () => {
    if (modalVisible) {
      if (localGestation !== values[name]) {
        setButtonText(`Birth Gestation: ${localGestation}`);
        setShowReset(true);
        setFieldValue(name, localGestation);
      }
      setModalVisible(false);
    } else {
      setModalVisible(true);
    }
  };

  const cancelInput = () => {
    setLocalGestation(values[name]);
    setModalVisible(false);
  };

  const resetInput = () => {
    setLocalGestation('Term');
    setButtonText(`Birth Gestation: Term`);
    setShowReset(false);
    setFieldValue(name, 'Term');
  };

  useEffect(() => {
    if (localGestation !== values[name] && !modalVisible) {
      setButtonText(`Birth Gestation: ${values[name]}`);
      setLocalGestation(values[name]);
      setShowReset(false);
    }
  }, [localGestation, values[name], modalVisible]);

  return (
    <React.Fragment>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleGestInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="human-pregnant" />
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
              <AppText style={styles.note}>
                Note: selection only applies to this fluid calculator
              </AppText>
              <View style={styles.pickerContainer}>
                <Picker
                  style={ios ? styles.iosPicker : styles.androidPicker}
                  itemStyle={{ color: dark ? colors.white : colors.black }}
                  onValueChange={(itemValue, itemIndex) => {
                    setLocalGestation(itemValue);
                  }}
                  selectedValue={localGestation}
                >
                  <Picker.Item label="Term" value="Term" />
                  <Picker.Item label="Preterm" value="Preterm" />
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
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </React.Fragment>
  );
};

export default FluidGestationInputButton;

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
