import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFormikContext } from 'formik';

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import AppText from '../../AppText';

const FiO2Slider = ({ pickerStateObject }) => {
  const [pickerState, setPickerState] = pickerStateObject;

  const changePickerState = (name, key, value) => {
    setPickerState((pickerState) => {
      const workingState = { ...pickerState };
      workingState[name][key] = value;
      return workingState;
    });
  };

  const name = 'FiO2';

  const [fio2, setFio2] = useState(20);

  const { setFieldValue, values } = useFormikContext();

  const accept = () => {
    setFieldValue(name, fio2);
    changePickerState(name, 'open', false);
    changePickerState(name, 'filled', true);
  };

  const cancel = () => {
    if (values[name]) setFio2(values[name]);
    changePickerState(name, 'cancelled', true);
  };

  // useEffect(() => {
  //   // button has been filled in by user:
  //   if (showCancel && FiO2 && !showInput) {
  //     if (!global) {
  //       // Reset by formik:
  //       if (!values[name]) {
  //         setShowInput(false);
  //         setShowCancel(false);
  //         setButtonText('FiO2');
  //         setFio2('');
  //       }
  //     }
  //   }
  // });

  return (
    <React.Fragment>
      {pickerState[name]['open'] && (
        <React.Fragment>
          <View style={styles.lightPickerContainer}>
            <AppText style={styles.o2Text}>{`~${fio2}%`}</AppText>
            <Slider
              style={styles.slider}
              minimumValue={20}
              maximumValue={100}
              step={10}
              value={fio2}
              onValueChange={(value) => setFio2(value)}
              minimumTrackTintColor="#FFFFFF"
              maximumTrackTintColor="#000000"
            />
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.closeIcon}>
              <TouchableOpacity onPress={cancel}>
                <MaterialCommunityIcons
                  name="close-circle"
                  color={colors.white}
                  size={40}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.acceptIcon}>
              <TouchableOpacity onPress={accept}>
                <MaterialCommunityIcons
                  name="check-circle"
                  color={colors.white}
                  size={40}
                />
              </TouchableOpacity>
            </View>
          </View>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default FiO2Slider;

const styles = StyleSheet.create({
  inputBox: {
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.dark,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 57,
    margin: 5,
    padding: 10,
    paddingHorizontal: 30,
    width: Dimensions.get('window').width * 0.85,
  },
  output: {
    color: colors.white,
    marginRight: 10,
  },
  slider: {
    width: Dimensions.get('window').width * 0.55,
    height: 40,
    alignSelf: 'center',
  },
  lightPickerContainer: {
    alignItems: 'center',
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.85,
    height: 210,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  buttonContainer: {
    width: Dimensions.get('window').width * 0.85,
    //backgroundColor: 'yellow',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  o2Text: {
    color: colors.black,
    marginTop: -20,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
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
});
