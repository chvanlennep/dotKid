import React, { useState, useEffect } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';
import defaultStyles from '../config/styles';
import ALSDisplayButton from './buttons/ALSDisplayButton';
import { chestRiseFlatList, noChestRise } from '../brains/nlsObjects';
import ALSFunctionButton from '../components/buttons/ALSFunctionButton';
import AppText from './AppText';
import ALSTertiaryFunctionButton from './buttons/ALSTertiaryFunctionButton';

const NoChestRiseModal = ({
  afterClose,
  logState,
  encounterState,
  resetState,
  timerState,
  style,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const setIsTimerActive = timerState.setValue;

  const renderListItem = ({ item }) => {
    return (
      <ALSTertiaryFunctionButton
        kind="neonate"
        title={item.id}
        logState={logState}
        encounterState={encounterState}
        resetState={resetState}
        timerState={timerState}
        style={styles.buttons}
      />
    );
  };

  const handlePress = () => {
    setModalVisible(true);
    setIsTimerActive(true);
  };

  const handleClose = () => {
    Alert.alert(
      'Chest Rise Not Confirmed',
      '',
      [
        {
          text: 'Return to Checklist',
          style: 'cancel',
        },
        {
          text: 'Close Checklist',
          onPress: () => {
            setModalVisible(false);
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (confirm) {
      setModalVisible(false);
      setConfirm(false);
    }
  }, [confirm]);

  return (
    <React.Fragment>
      <ALSDisplayButton onPress={handlePress} style={style}>
        No Chest Rise
      </ALSDisplayButton>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onShow={afterClose}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity style={styles.touchable} onPress={handleClose}>
                <View style={styles.closeIcon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.white}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
              <AppText style={styles.heading}>No Chest Movement</AppText>
              <View style={styles.sats}>
                <AppText style={styles.text}>
                  Do not move on until you have seen chest movement
                </AppText>
              </View>
              <View style={styles.assessment}>
                <FlatList
                  data={chestRiseFlatList}
                  keyExtractor={(chestRiseFlatList) =>
                    chestRiseFlatList.id.toString()
                  }
                  renderItem={renderListItem}
                  ListHeaderComponent={
                    <ALSTertiaryFunctionButton
                      kind="neonate"
                      title={noChestRise[0]['id']}
                      timerState={timerState}
                      logState={logState}
                      encounterState={encounterState}
                      resetState={resetState}
                      style={styles.buttons}
                    />
                  }
                  ListFooterComponent={
                    <ALSFunctionButton
                      kind="neonate"
                      title={'Chest is now moving'}
                      logState={logState}
                      encounterState={encounterState}
                      timerState={timerState}
                      resetState={resetState}
                      style={[styles.buttons]}
                      backgroundColorPressed={colors.black}
                      setConfirm={setConfirm}
                    />
                  }
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default NoChestRiseModal;

const styles = StyleSheet.create({
  assessment: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    flexWrap: 'nowrap',
    flex: 1,
    margin: 5,
    padding: 5,
    paddingBottom: 10,
  },
  buttons: {
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
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    paddingBottom: 5,
    elevation: 5,
    flex: 0.8,
    backgroundColor: colors.darkSecondary,
  },
  options: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  sats: {
    justifyContent: 'center',
    backgroundColor: colors.black,
    borderRadius: 5,
    height: 70,
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
    width: defaultStyles.container.width * 0.9,
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
