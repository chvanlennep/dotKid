import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Dimensions,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useFormikContext} from 'formik';
import colors from '../../../config/colors';

const pickerHeight = Platform.OS === 'ios' ? 210 : 110;

const APGARButton = ({pickerDetails, pickerStateObject}) => {
  const [pickerState, setPickerState] = pickerStateObject;

  const {name, pickerContent} = pickerDetails;

  const [local, setLocal] = useState(1);

  const labelList = pickerContent.map((item, index) => (
    <Picker.Item label={item.value} value={index} key={index} />
  ));

  const {setFieldValue, values} = useFormikContext();

  const changePickerState = (name, key, value) => {
    setPickerState((pickerState) => {
      const workingState = {...pickerState};
      workingState[name][key] = value;
      return workingState;
    });
  };

  const accept = () => {
    setFieldValue(name, local);
    changePickerState(name, 'filled', true);
  };

  const cancel = () => {
    if (values[name]) {
      setLocal(values[name]);
    }
    changePickerState(name, 'cancelled', true);
  };

  return (
    <React.Fragment>
      {pickerState[name].open && (
        <React.Fragment>
          <View style={styles.lightPickerContainer}>
            <Picker
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                setLocal(itemIndex);
              }}
              selectedValue={local}>
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

export default APGARButton;

const styles = StyleSheet.create({
  picker: {
    height: pickerHeight,
    width: 280,
    // backgroundColor: 'orange',
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
    // backgroundColor: 'yellow',
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
    // backgroundColor: 'red',
    paddingRight: 10,
  },
  acceptIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    paddingLeft: 10,
  },
});
