import React, {useContext} from 'react';
import {
  Platform,
  Modal,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useFormikContext} from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../../config/colors';
import defaultStyles from '../../../config/styles';
import ButtonIcon from '../ButtonIcon';
import AppText from '../../AppText';
import ErrorMessage from '../../ErrorMessage';
import {GlobalStatsContext, initialState} from '../../GlobalStats';
import useCombined from '../../../brains/useCombined';

const modalWidth =
  defaultStyles.container.width > 350 ? 350 : defaultStyles.container.width;

const SexInputButton = ({kind}) => {
  const ios = Platform.OS === 'ios' ? true : false;

  const {globalStats} = useContext(GlobalStatsContext);

  const {modalVisible, showCancel, value, sex} = globalStats[kind].sex;

  const buttonText = value ? `Sex: ${value}` : 'Sex';

  const {combinedSetter} = useCombined(kind, 'sex');

  const {errors, touched} = useFormikContext();

  const toggleSexInput = () => {
    if (modalVisible) {
      combinedSetter({
        showCancel: true,
        modalVisible: false,
        value: sex,
      });
    } else {
      combinedSetter({modalVisible: true});
    }
  };

  const cancelInput = () => {
    if (modalVisible && value) {
      combinedSetter({modalVisible: false, sex: value});
    } else {
      combinedSetter(initialState[kind].sex);
    }
  };

  return (
    <React.Fragment>
      <View>
        <View style={styles.button}>
          <TouchableOpacity onPress={toggleSexInput}>
            <View style={styles.buttonTextBox}>
              <ButtonIcon name="all-inclusive" />
              <AppText style={{color: colors.white}}>{buttonText}</AppText>
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
          onRequestClose={cancelInput}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.pickerContainer}>
                <Picker
                  style={ios ? styles.iosPicker : styles.androidPicker}
                  itemStyle={{color: colors.black}}
                  onValueChange={(itemValue, itemIndex) => {
                    combinedSetter({sex: itemValue});
                  }}
                  selectedValue={sex}>
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Male" value="Male" />
                </Picker>
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.closeIcon}>
                  <TouchableOpacity onPress={cancelInput}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.acceptIcon}>
                  <TouchableOpacity onPress={toggleSexInput}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      color={colors.black}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      <ErrorMessage error={errors.sex} visible={touched.sex} />
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
    backgroundColor: colors.light,
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
