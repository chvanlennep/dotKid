import React, {useState} from 'react';
import {Modal, StyleSheet, View, TouchableOpacity} from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppText from '../AppText';
import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import Icon from '../Icon';
import {addOrdinalSuffix, decidePluralSuffix} from '../../brains/oddBits';

const modalWidth =
  defaultStyles.container.width > 400 ? 400 : defaultStyles.container.width;

const SubmitButton = ({
  gestationWeeks,
  kind,
  valueBeforeCorrection,
  valueAfterCorrection,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  let outputString = '';
  let modalHeading = '';
  let modalMessage = '';
  switch (kind) {
    case 'child':
      if (valueAfterCorrection !== 'not corrected') {
        outputString = `Age: ${valueAfterCorrection}*`;
      } else {
        outputString = `Age: ${valueBeforeCorrection}`;
      }
      modalHeading = `Age before correction: ${valueBeforeCorrection}\n
      Age after correction: ${valueAfterCorrection}`;
      modalMessage = `Ages are corrected for gestation according to RCPCH guidelines:\n
      Until 1 year of chronological age for children born 32+0 to 36+6 weeks gestation.\n
      Until 2 years of chronological age for children born before 32 weeks gestation.`;
      break;
    case 'neonate':
      const pretermAge = valueAfterCorrection - valueBeforeCorrection;
      let birthGestationWeeks = Math.floor(valueBeforeCorrection / 7);
      let birthGestationDays = valueBeforeCorrection % 7;
      const correctedGestationWeeks = Math.floor(valueAfterCorrection / 7);
      const correctedGestationDays = valueAfterCorrection % 7;
      const pluralSuffix = decidePluralSuffix(pretermAge);
      outputString = `Corrected Gestational Age: ${correctedGestationWeeks}+${correctedGestationDays}`;
      modalHeading = `Birth Gestation: ${birthGestationWeeks}+${birthGestationDays} \n \n ${outputString}`;
      modalMessage = `${pretermAge} day${pluralSuffix} old (${addOrdinalSuffix(
        pretermAge + 1,
      )} day of life)`;
      break;
    case 'jaundice':
      let outputGestation = gestationWeeks;
      if (gestationWeeks >= 38) {
        outputGestation = '38+';
      }
      outputString = `${valueBeforeCorrection} old, ${outputGestation} week chart`;
      break;
    case 'nFluid':
      outputString = `Age: ${valueBeforeCorrection}`;
      modalHeading = `Age: ${valueBeforeCorrection}\n(${addOrdinalSuffix(
        valueAfterCorrection + 1,
      )} day of life)`;
      modalMessage = 'Chronological age used for calculation';
      break;
    case 'birth':
      birthGestationWeeks = Math.floor(valueBeforeCorrection / 7);
      birthGestationDays = valueBeforeCorrection % 7;
      outputString = `Birth Gestation: ${birthGestationWeeks}+${birthGestationDays}`;
      modalHeading = outputString;
      modalMessage =
        'As per RCPCH guidelines, infants born at term (37 weeks and higher) are compared against all term infants and not just infants born at their gestation.\n\nPreterm infants are compared against infants born at their specific gestation.';
      break;
    default:
      console.log('error in AgeButton switch');
  }
  const buttonBackGroundColor =
    kind === 'child' ? colors.primary : colors.secondary;

  if (kind !== 'jaundice') {
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}>
          <View
            style={[
              styles.submitButton,
              {
                backgroundColor: buttonBackGroundColor,
              },
            ]}>
            <AppText style={{color: colors.white}}>{outputString}</AppText>
            <Icon
              backgroundColor={null}
              height={40}
              width={40}
              name="information-outline"
            />
          </View>
        </TouchableOpacity>
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styles.closeIcon}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={colors.black}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.modalTextHeadingWrapper}>
                  <AppText style={styles.modalTextHeadings}>
                    {modalHeading}
                  </AppText>
                </View>
                <AppText style={styles.modalTextParagraph}>
                  {modalMessage}
                </AppText>
              </View>
            </View>
          </Modal>
        </View>
      </React.Fragment>
    );
  } else {
    return (
      <View
        style={[
          styles.submitButton,
          {
            backgroundColor: buttonBackGroundColor,
          },
        ]}>
        <AppText style={{color: colors.white}}>{outputString}</AppText>
      </View>
    );
  }
};

export default SubmitButton;

const styles = StyleSheet.create({
  closeIcon: {
    height: 50,
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    alignItems: 'center',
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: 'center',
    width: defaultStyles.container.width,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    width: modalWidth,
    backgroundColor: colors.light,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    padding: 10,
    margin: 10,
  },
  modalTextParagraph: {
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: '400',
    paddingBottom: 30,
    // backgroundColor: "green",
  },
});
