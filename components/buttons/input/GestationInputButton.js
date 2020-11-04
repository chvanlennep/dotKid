import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  useColorScheme,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-community/picker';
import { useFormikContext } from 'formik';

import AppText from '../../AppText';
import colors from '../../../config/colors';
import ButtonIcon from '../ButtonIcon';
import ErrorMessage from '../../ErrorMessage';
import { GlobalStateContext } from '../../GlobalStateContext';
import defaultStyles from '../../../config/styles';

const modalWidth =
  defaultStyles.container.width > 360 ? 360 : defaultStyles.container.width;

const GestationInputButton = ({
  global = false,
  kind,
  name = 'gestationInDays',
}) => {
  let defaultWeeks = 40;
  let defaultDays = 0;
  let defaultGestationString = ': Term';
  let errorMessage;
  if (kind === 'neonate') {
    defaultWeeks = 0;
    defaultDays = 0;
    defaultGestationString = '';
    errorMessage = true;
  }

  const ios = Platform.OS === 'ios' ? true : false;

  const [buttonLabel, setButtonLabel] = useState(
    `Birth Gestation${defaultGestationString}`
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [localWeeks, setLocalWeeks] = useState(defaultWeeks);
  const [localDays, setLocalDays] = useState(defaultDays);
  const [globalStats, setGlobalStats] = useContext(GlobalStateContext);
  const { setFieldValue, values, errors, touched } = useFormikContext();

  const resetIcon = kind === 'child' ? 'refresh' : 'delete-forever';

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

  const convertGestation = (gestationInDays) => {
    return [gestationInDays % 7, Math.floor(gestationInDays / 7)];
  };

  const toggleGestPicker = () => {
    if (modalVisible) {
      setModalVisible(false);
      manageStats.write(kind, 'gestationInDays', localWeeks * 7 + localDays);
      if (!global) {
        setFieldValue(name, localWeeks * 7 + localDays);
      }
      if (localWeeks === 40 && localDays === 0 && kind === 'child') {
        setButtonLabel('Birth Gestation: Term');
      } else {
        setShowReset(true);
        setButtonLabel(`Birth Gestation: ${localWeeks}+${localDays}`);
      }
    } else {
      if (!localWeeks) {
        setLocalWeeks(37);
        setLocalDays(0);
      }
      setModalVisible(true);
    }
  };

  const resetInput = () => {
    if (modalVisible) {
      const globalWeeks = Math.floor(manageStats.read(kind, name) / 7);
      const globalDays = manageStats.read(kind, name) % 7;
      setModalVisible(false);
      setLocalWeeks(globalWeeks);
      setLocalDays(globalDays);
      if (!global) {
        setFieldValue(name, manageStats.read(kind, name));
      }
    } else {
      setModalVisible(false);
      setButtonLabel(
        kind === 'neonate' ? 'Birth Gestation' : `Birth Gestation: Term`
      );
      setLocalWeeks(defaultWeeks);
      setLocalDays(defaultDays);
      manageStats.write(
        kind,
        'gestationInDays',
        defaultWeeks * 7 + defaultDays
      );
      if (!global) {
        setFieldValue(name, defaultWeeks * 7 + defaultDays);
      }
      setShowReset(false);
    }
  };

  const weekLabels = [];
  for (let i = 23; i < 43; i++) {
    weekLabels.push(i);
  }
  const dayLabels = [0, 1, 2, 3, 4, 5, 6];
  const weekLabelList = weekLabels.map((number, index) => (
    <Picker.Item label={`${number}`} value={number} key={index} />
  ));
  const dayLabelList = dayLabels.map((number, index) => (
    <Picker.Item label={`${number}`} value={number} key={index} />
  ));

  useEffect(() => {
    const localGestationInDays = localWeeks * 7 + localDays;
    const defaultGestationInDays = defaultWeeks * 7 + defaultDays;
    const globalGestation = manageStats.read(kind, 'gestationInDays');
    const [gestationDays, gestationWeeks] = convertGestation(globalGestation);
    // button has been filled in by user:
    if (
      showReset &&
      localGestationInDays !== defaultGestationInDays &&
      !modalVisible
    ) {
      if (!global) {
        // Reset by formik:
        if (values[name] === defaultGestationInDays) {
          setShowReset(false);
          setButtonLabel(
            kind === 'neonate' ? 'Birth Gestation' : `Birth Gestation: Term`
          );
          setLocalWeeks(defaultWeeks);
          setLocalDays(defaultDays);
          kind === 'neonate'
            ? manageStats.write(kind, 'gestationInDays', 0)
            : manageStats.write(kind, 'gestationInDays', 280);
        }
      }
      // Reset via global state:
      if (globalGestation === defaultGestationInDays) {
        setShowReset(false);
        setButtonLabel(
          kind === 'neonate' ? 'Birth Gestation' : `Birth Gestation: Term`
        );
        setLocalWeeks(defaultWeeks);
        setLocalDays(defaultDays);
        if (!global) {
          kind === 'neonate'
            ? setFieldValue(name, 0)
            : setFieldValue(name, 280);
        }
      }
      // value changed by global state (must put no show picker otherwise value stuck):
      if (
        globalGestation !== localGestationInDays &&
        globalGestation !== defaultGestationInDays
      ) {
        if (!global) {
          setFieldValue(name, globalGestation);
        }
        if (gestationWeeks === 40 && gestationDays === 0 && kind === 'child') {
          setButtonLabel('Birth Gestation: Term');
          setShowReset(false);
        } else {
          setButtonLabel(`Birth Gestation: ${gestationWeeks}+${gestationDays}`);
        }
        setLocalWeeks(gestationWeeks);
        setLocalDays(gestationDays);
      }
    }
    // button has not been filled in by user:
    if (!showReset && localGestationInDays === defaultGestationInDays) {
      // value updated via global state:
      if (globalGestation !== localGestationInDays) {
        if (!global) {
          setFieldValue(name, globalGestation);
        }
        setLocalWeeks(gestationWeeks);
        setLocalDays(gestationDays);
        if (gestationWeeks === 40 && gestationDays === 0 && kind === 'child') {
          setButtonLabel('Birth Gestation: Term');
        } else {
          setButtonLabel(`Birth Gestation: ${gestationWeeks}+${gestationDays}`);
          setShowReset(true);
        }
      }
    }
  });

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity onPress={toggleGestPicker}>
          <View style={styles.textBox}>
            <ButtonIcon name="human-pregnant" />
            <AppText style={{ color: colors.white }}>{buttonLabel}</AppText>
          </View>
        </TouchableOpacity>
        {showReset && (
          <TouchableOpacity onPress={resetInput}>
            <ButtonIcon name={resetIcon} />
          </TouchableOpacity>
        )}
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
                    setLocalWeeks(itemValue);
                  }}
                  selectedValue={localWeeks}
                >
                  {weekLabelList}
                </Picker>
                <Picker
                  style={ios ? styles.iosPicker : styles.androidPicker}
                  itemStyle={{
                    color: dark ? colors.white : colors.black,
                  }}
                  onValueChange={(itemValue, itemIndex) => {
                    setLocalDays(itemValue);
                  }}
                  selectedValue={localDays}
                >
                  {dayLabelList}
                </Picker>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.closeIcon}>
                  <TouchableOpacity onPress={resetInput}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={dark && ios ? colors.white : colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.acceptIcon}>
                  <TouchableOpacity onPress={toggleGestPicker}>
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
      {errorMessage && (
        <ErrorMessage error={errors[name]} visible={touched[name]} />
      )}
    </React.Fragment>
  );
};

export default GestationInputButton;

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
    width: modalWidth / 2,
  },
  androidPicker: {
    height: 100,
    width: modalWidth / 2 - 10,
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
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
    height: 57,
    //backgroundColor: 'green',
    alignSelf: 'center',
  },
});
