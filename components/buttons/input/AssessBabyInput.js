import React, { useState, useEffect, useContext } from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFormikContext } from 'formik';
import colors from '../../../config/colors';

const AssessBabyInput = ({ pickerDetails, pickerStateObject }) => {
  const [pickerState, setPickerState] = pickerStateObject;

  const { name, pickerContent } = pickerDetails;

  const middleIndex = Math.round(pickerContent.length / 2) - 1;
  const initialValue = pickerContent[middleIndex]['value'];
  const [local, setLocal] = useState(initialValue);

  const labelList = pickerContent.map((item, index) => (
    <Picker.Item label={item.value} value={item.value} key={index} />
  ));

  const changePickerState = (name, key, value) => {
    setPickerState((pickerState) => {
      const workingState = { ...pickerState };
      workingState[name][key] = value;
      return workingState;
    });
  };

  const { setFieldValue, values } = useFormikContext();
  const ios = Platform.OS === 'ios' ? true : false;

  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;

  const accept = () => {
    setFieldValue(name, local);
    changePickerState(name, 'filled', true);
  };

  const cancel = () => {
    if (values[name]) setLocal(values[name]);
    changePickerState(name, 'cancelled', true);
  };

  return (
    <React.Fragment>
      {pickerState[name]['open'] && (
        <React.Fragment>
          <View style={styles.lightPickerContainer}>
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocal(itemValue);
              }}
              selectedValue={local}
            >
              {labelList}
            </Picker>
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

export default AssessBabyInput;

const styles = StyleSheet.create({
  picker: {
    height: 210,
    width: 280,
    //backgroundColor: 'orange',
  },
  lightPickerContainer: {
    alignItems: 'center',
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.85,
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
