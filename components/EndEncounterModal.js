import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';
import defaultStyles from '../config/styles';
import EndEncounterButton from '../components/buttons/EndEncounterButton';
import AppText from './AppText';
import ALSToolButton from './buttons/ALSToolButton';

const EndEncounterModal = ({logState, encounterState, setLogVisible}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const modalState = {
    value: modalVisible,
    setValue: setModalVisible,
  };

  return (
    <React.Fragment>
      <ALSToolButton
        name="End Encounter"
        onPress={() => setModalVisible(true)}
        style={{width: useWindowDimensions().width / 2}}
      />
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
                style={styles.touchable}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <View style={styles.closeIcon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.white}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
              <AppText style={styles.heading}>End Encounter</AppText>
              <View style={styles.sats}>
                <AppText style={styles.text}>Please choose an outcome:</AppText>
              </View>
              <View style={styles.assessment}>
                <EndEncounterButton
                  kind="neonate"
                  title="Resuscitation complete"
                  logState={logState}
                  modalState={modalState}
                  encounterState={encounterState}
                  setLogVisible={setLogVisible}
                  style={styles.buttons}
                />
                <EndEncounterButton
                  kind="neonate"
                  title="Transferred to NICU"
                  logState={logState}
                  modalState={modalState}
                  encounterState={encounterState}
                  setLogVisible={setLogVisible}
                  style={styles.buttons}
                />
                <EndEncounterButton
                  kind="neonate"
                  title="RIP"
                  logState={logState}
                  modalState={modalState}
                  encounterState={encounterState}
                  setLogVisible={setLogVisible}
                  style={styles.buttons}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default EndEncounterModal;

const styles = StyleSheet.create({
  assessment: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    //flex: 1,
    margin: 10,
    padding: 7,
  },
  button: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    backgroundColor: colors.dark,
    justifyContent: 'center',
    padding: 2,
    width: '50%',
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    flexWrap: 'nowrap',
    height: 90,
    justifyContent: 'center',
    textAlign: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    //backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 20,
    marginTop: -30,
    marginBottom: 5,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingBottom: 10,
    elevation: 5,
    //flex: 0.45,
    width: defaultStyles.container.width - 10,
    backgroundColor: colors.darkSecondary,
  },
  options: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  sats: {
    justifyContent: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    height: 50,
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 5,
    padding: 10,
  },
  satsText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 4,
    color: colors.white,
  },
  slider: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttons: {
    backgroundColor: colors.dark,
  },
  submit: {
    backgroundColor: colors.dark,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    margin: 3,
    color: colors.white,
  },
  touchable: {
    alignSelf: 'flex-start',
    //backgroundColor: "blue",
  },
});
