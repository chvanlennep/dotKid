import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useFormikContext} from 'formik';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppText from '../components/AppText';
import Icon from './Icon';
import colors from '../config/colors';
import defaultStyles from '../config/styles';

const modalWidth =
  defaultStyles.container.width > 400 ? 400 : defaultStyles.container.width;

const NFluidOutput = ({results}) => {
  const {values} = useFormikContext();
  const {
    corrected1Hourly,
    corrected2Hourly,
    corrected3Hourly,
    corrected4Hourly,
    correction,
    gestation,
    weight,
    day1,
    day2,
    day3,
    day4,
    day5,
  } = results;

  const valuesObject = {
    '1 hourly': corrected1Hourly.toFixed(1),
    '2 hourly':
      corrected2Hourly < 10
        ? corrected2Hourly.toFixed(1)
        : Math.round(corrected2Hourly),
    '3 hourly':
      corrected3Hourly < 10
        ? corrected3Hourly.toFixed(1)
        : Math.round(corrected3Hourly),
    '4 hourly':
      corrected4Hourly < 10
        ? corrected4Hourly.toFixed(1)
        : Math.round(corrected4Hourly),
  };
  const unitsObject = {
    '1 hourly': ' every hour',
    '2 hourly': ' every 2 hours',
    '3 hourly': ' every 3 hours',
    '4 hourly': ' every 4 hours',
  };

  const [output, setOutput] = useState(
    `${valuesObject['3 hourly']}ml${unitsObject['3 hourly']}`,
  );
  const [modalVisible, setModalVisible] = useState(false);

  const title = 'Neonatal Fluid Requirement:';

  const modalTitle = `Weight used: ${weight}kg`;

  const isCorrected = correction === '100' ? ' (no correction)' : '';

  const requirementsUsed = `1st Day: ${day1} ml/kg/day\n2nd Day: ${day2} ml/kg/day\n3rd Day: ${day3} ml/kg/day\n4th Day: ${day4} ml/kg/day\n5th Day: ${day5} ml/kg/day\n\n`;

  const modalParagraph =
    'Requirements for age have been calculated based on an increasing requirement until 5th day of life. If your local guidelines differ from the default values, please change them on the previous screen.\n\n';

  const gestationExplanation =
    'Fluid rates for infants born before 37 weeks gestation will be calculated on preterm values until 40 weeks corrected gestation is reached.\n\n';

  const modalParagraph2 = `${gestation} infant values used:\n\n${requirementsUsed}Correction applied: ${correction}%${isCorrected}\n\nThe fluid requirement calculated is a combined total for intravenous and enteral fluids. The proportions are dependent on clinical needs at the time.`;

  useEffect(() => {
    setOutput(
      `${valuesObject[values.interval]}ml${unitsObject[values.interval]}`,
    );
  }, [values, unitsObject, valuesObject]);

  return (
    <View style={styles.outputContainer}>
      <View style={styles.outputTextBox}>
        <View style={styles.title}>
          <AppText style={styles.text}>{title}</AppText>
        </View>
        <View style={styles.output}>
          <AppText style={styles.outputText}>{output}</AppText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}>
            <Icon
              name="information-outline"
              width={40}
              height={40}
              borderRadius={5}
              backgroundColor={colors.dark}
            />
          </TouchableOpacity>
        </View>
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
                    {modalTitle}
                  </AppText>
                </View>
                <ScrollView>
                  <AppText style={styles.modalTextParagraph}>
                    {modalParagraph}
                    {gestationExplanation}
                    {modalParagraph2}
                  </AppText>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
};

export default NFluidOutput;

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  outputContainer: {
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    marginTop: 5,
    height: 110,
    width: defaultStyles.container.width,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    //backgroundColor: 'white',
    flexDirection: 'row',
    flex: 2,
  },
  outputTextBox: {
    paddingLeft: 20,
    paddingRight: 10,
    //backgroundColor: 'limegreen',
    textAlign: 'left',
    justifyContent: 'center',
    flex: 8,
  },
  outputText: {
    fontSize: 18,
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  topContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 19,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
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
    width: modalWidth,
    height: modalWidth * 1.4,
    backgroundColor: colors.light,
  },
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    //flex: 1,
    //flexWrap: 'wrap',
    padding: 5,
    paddingLeft: 2,
    paddingRight: 2,
    margin: 8,
  },
  modalTextParagraph: {
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
    //flex: 9,
    flexWrap: 'wrap',
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 20,
    fontWeight: '400',
    paddingBottom: 20,
    // backgroundColor: "green",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
