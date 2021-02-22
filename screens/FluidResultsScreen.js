import React, {useState} from 'react';
import {
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {containerWidth} from '../config/styles';
import PCalcScreen from '../components/PCalcScreen';
import AppText from '../components/AppText';
import colors from '../config/colors';
import AgeButton from '../components/buttons/AgeButton';
import Button from '../components/buttons/Button';

const FluidResultsScreen = ({route, navigation}) => {
  const parameters = JSON.parse(route.params);

  const [modalVisible, setModalVisible] = useState(false);

  const {fluid, fluidText, mode, warningAsterix} = parameters.results;
  const ageBeforeCorrection = parameters.centileObject.ageBeforeCorrection;
  const ageAfterCorrection = parameters.centileObject.ageAfterCorrection;

  const outputTitle = `Fluid requirement (${mode}):`;

  return (
    <PCalcScreen isResults={true} style={{flex: 1}}>
      <View style={styles.topContainer}>
        <AgeButton
          kind="child"
          valueBeforeCorrection={ageBeforeCorrection}
          valueAfterCorrection={ageAfterCorrection}
        />
        <Button
          label="← Calculate Again"
          onPress={() => navigation.goBack()}
          style={{backgroundColor: colors.light}}
          textStyle={{color: colors.black}}
        />
      </View>
      <KeyboardAwareScrollView>
        <View style={styles.bottomContainer}>
          <View style={styles.outputContainer}>
            <View style={styles.outputTextBox}>
              <View style={styles.title}>
                <AppText style={styles.text}>{outputTitle}</AppText>
              </View>
              <View style={styles.output}>
                <AppText style={styles.outputText}>{fluid}</AppText>
              </View>
            </View>
          </View>
          <React.Fragment>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
              }}
              style={styles.modalButton}>
              <AppText style={styles.buttonText}>
                {warningAsterix
                  ? '***Important Notes'
                  : 'Calculation Explanation'}
              </AppText>
            </TouchableOpacity>
            <View style={styles.centeredView}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(false);
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
                    <AppText style={styles.heading}>
                      Calculation Explanation
                    </AppText>
                    <ScrollView style={styles.referenceOutput}>
                      <AppText style={styles.referenceText}>
                        {fluidText}
                      </AppText>
                    </ScrollView>
                  </View>
                </View>
              </Modal>
            </View>
          </React.Fragment>
        </View>
      </KeyboardAwareScrollView>
    </PCalcScreen>
  );
};

export default FluidResultsScreen;

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
  buttonText: {
    color: 'white',
    fontSize: 19,
  },
  modalButton: {
    backgroundColor: colors.dark,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    marginTop: 5,
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
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.light,
    width: containerWidth - 10,
    height: containerWidth + 30,
    borderRadius: 10,
    padding: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  outputContainer: {
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 110,
    width: '100%',
  },
  heading: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 20,
    marginTop: -35,
    marginBottom: 15,
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
    fontSize: 16,
    textAlign: 'left',
    color: colors.white,
    flexWrap: 'wrap',
  },
  referenceText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 5,
    textAlign: 'center',
  },
  topContainer: {
    marginTop: 5,
  },
  reference: {
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: colors.medium,
    width: '80%',
  },
  referenceTitle: {
    paddingTop: 15,
    paddingBottom: 5,
    color: colors.white,
    fontWeight: '500',
    fontSize: 15,
    textAlign: 'center',
  },
  referenceOutput: {
    color: colors.white,
    fontSize: 14,
    textAlign: 'center',
    padding: 14,
    backgroundColor: colors.dark,
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    textAlign: 'left',
    fontWeight: '500',
    paddingBottom: 10,
    color: colors.white,
  },
});
