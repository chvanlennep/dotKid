import React, { useState } from 'react';
import {
  Appearance,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';
import defaultStyles from '../config/styles';

const WETFLAGResultsScreen = ({ route, navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const scheme = Appearance.getColorScheme();
  const parameters = JSON.parse(route.params);
  const measurements = parameters.measurements;

  let referenceTitle;
  const ageBeforeCorrection = parameters.centileObject.ageBeforeCorrection;
  const ageAfterCorrection = parameters.centileObject.ageAfterCorrection;

  const weight = parameters.output.weight;
  const energy = parameters.output.energy;
  const ETtube = parameters.output.ETtube;
  const fluid = parameters.output.fluid;
  const adrenaline = parameters.output.adrenaline;
  const glucose = parameters.output.glucose;
  const lorazepam = parameters.output.lorazepam;
  const weightIsEstimated = parameters.output.weightIsEstimated;

  return (
    <PCalcScreen style={{ flex: 1 }}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueBeforeCorrection={ageBeforeCorrection}
          valueAfterCorrection={ageAfterCorrection}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{ backgroundColor: colors.light }}
          textStyle={{ color: colors.black }}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>WETFLAG Values:</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>
                  {'\n'}
                  {weightIsEstimated
                    ? 'Estimated Weight (50th Centile):'
                    : 'Measured Weight:'}
                </AppText>
                <AppText style={styles.value}>
                  {weight}kg
                  {'\n'}
                </AppText>
                <AppText style={styles.outputText}>Energy:</AppText>
                <AppText style={styles.value}>
                  {energy} joules
                  {'\n'}
                </AppText>
                <AppText style={styles.outputText}>
                  Endotracheal tube size:
                </AppText>
                <AppText style={styles.value}>
                  {ETtube}
                  {'\n'}
                </AppText>
                <AppText style={styles.outputText}>Fluid bolus volume:</AppText>
                <AppText style={styles.value}>
                  {fluid}ml
                  {'\n'}
                </AppText>
                <AppText style={styles.outputText}>Lorazepam:</AppText>
                <AppText style={styles.value}>
                  {lorazepam}ml of 1mg/ml
                  {'\n'}
                </AppText>
                <AppText style={styles.outputText}>Adrenaline:</AppText>
                <AppText style={styles.value}>
                  {adrenaline}ml of 1:10,000
                  {'\n'}
                </AppText>
                <AppText style={styles.outputText}>Glucose:</AppText>
                <AppText style={styles.value}>
                  {glucose}ml of 10%
                  {'\n'}
                </AppText>
                <React.Fragment>
                  <Button
                    onPress={() => {
                      setModalVisible(true);
                    }}
                    style={[styles.modalButton, { width: 200 }]}
                    label="Reference Data"
                  >
                    Reference Data
                  </Button>
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
                        <View style={styles.modalView}>
                          <TouchableOpacity
                            onPress={() => {
                              setModalVisible(!modalVisible);
                            }}
                          >
                            <View style={styles.closeIcon}>
                              <MaterialCommunityIcons
                                name="close-circle"
                                color={
                                  scheme === 'dark'
                                    ? colors.black
                                    : colors.white
                                }
                                size={30}
                              />
                            </View>
                          </TouchableOpacity>
                          <AppText style={styles.heading}>
                            Reference Data
                          </AppText>
                          <View style={styles.referenceOutput}>
                            <AppText style={styles.referenceText}>
                              Estimated weight is based on WHO/UK 50th centile
                              data. {'\n'}
                              {'\n'}Defibrillator energy is based on Resus
                              Council UK APLS guidelines: {'\n'}4 x estimated
                              weight, to the nearest 10.{'\n'}Capped at 120
                              joules if weight >40kgs and 120 - 150 joules if
                              age > 14 years. {'\n'}
                              {'\n'}Endotracheal tube size is calculated by (age
                              x 4) + 4, rounded to half measures and capped at
                              8.{'\n'}
                              {'\n'}
                              Glucose bolus dose is calculated at 0.1ml/kg and
                              capped at 50ml. {'\n'}
                              {'\n'}Lorazepam dose is calculated at 0.1mg/kg and
                              capped at 4mg.
                            </AppText>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </React.Fragment>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default WETFLAGResultsScreen;

const styles = StyleSheet.create({
  bottomContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    //backgroundColor: "dodgerblue",
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 75,
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 20,
    marginTop: -35,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: colors.dark,
    alignSelf: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    width: defaultStyles.container.width - 10,
    backgroundColor: colors.medium,
  },
  output: {},
  outputText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  outputContainer: {
    //backgroundColor: "orangered",
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: '100%',
    width: '100%',
  },
  outputTextBox: {
    padding: 10,
    paddingLeft: 10,
    paddingRight: 20,
    // backgroundColor: "limegreen",
    height: '100%',
    textAlign: 'left',
    width: '100%',
  },
  referenceOutput: {
    borderRadius: 10,
    backgroundColor: colors.dark,
    padding: 10,
  },
  referenceText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 5,
  },
  topContainer: {
    marginTop: 5,
  },
  text: {
    fontSize: 19,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 5,
  },
  value: {
    fontSize: 16,
    textAlign: 'left',
  },
});
