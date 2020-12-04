import React, {useState, useEffect} from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../app/config/colors';
import defaultStyles from '../../app/config/styles';
import AppText from './AppText';
import ALSDisplayButton from './buttons/ALSDisplayButton';
import parseLog from '../brains/parseLog';
import onShare from '../brains/onShare';
import {readItemFromStorage, writeItemToStorage} from '../brains/storage';

const LogModal = ({
  encounterState,
  logInput,
  logVisibleState,
  kind,
  resetState,
  style,
}) => {
  const scheme = useColorScheme();

  const modalVisible = logVisibleState.value;
  const setModalVisible = logVisibleState.setValue;

  const endEncounter = encounterState.value;
  const setEndEncounter = encounterState.setValue;
  const setReset = resetState.setValue;

  const logType = kind === 'child' ? 'APLS' : 'NLS';
  const storageKey = `${logType}_log`;
  const firstEverLogMessage = 'No log entries found';
  const [log, setLog] = useState(firstEverLogMessage);

  useEffect(() => {
    const rawLog = parseLog(logInput, logType);
    rawLog && rawLog.length !== 103
      ? setLog(rawLog)
      : readItemFromStorage(storageKey, setLog, firstEverLogMessage);
  });

  useEffect(() => {
    if (log && log !== firstEverLogMessage) {
      if (log.slice(log.length - 7) !== 'ongoing') {
        writeItemToStorage(storageKey, () => null, log);
      }
    }
  }, [log, firstEverLogMessage, storageKey]);

  const handleReset = () => {
    if (!endEncounter) {
      setModalVisible(false);
    } else {
      setReset(true);
      setModalVisible(false);
      setEndEncounter(false);
    }
  };

  return (
    <React.Fragment>
      <ALSDisplayButton onPress={() => setModalVisible(true)} style={style}>
        Log
      </ALSDisplayButton>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleReset}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor:
                    kind === 'child'
                      ? colors.darkPrimary
                      : colors.darkSecondary,
                },
              ]}>
              <View style={styles.headers}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={handleReset}>
                  <View style={styles.closeIcon}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={colors.white}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>

                <AppText
                  style={
                    styles.heading
                  }>{`Most Recent ${logType} Log`}</AppText>
                <TouchableOpacity
                  style={styles.exportIcon}
                  onPress={() => onShare(log)}>
                  <View style={styles.exportIcon}>
                    <MaterialCommunityIcons
                      name="export-variant"
                      color={colors.white}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.log,
                  {
                    backgroundColor:
                      scheme === 'dark' ? colors.black : colors.white,
                  },
                ]}>
                <ScrollView>
                  <AppText
                    style={[
                      styles.text,
                      {
                        color: scheme === 'dark' ? colors.white : colors.black,
                      },
                    ]}>
                    {log}
                  </AppText>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default LogModal;

const styles = StyleSheet.create({
  button: {
    alignContent: 'center',
    backgroundColor: colors.dark,
    justifyContent: 'center',
    textAlign: 'center',
    width: '44%',
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
  exportIcon: {
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
    width: 50,
  },
  heading: {
    alignSelf: 'center',
    color: colors.white,
    fontSize: 19,
    marginBottom: 5,
  },
  headers: {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'space-between',
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
    height: defaultStyles.container.width + 20,
    width: defaultStyles.container.width - 10,
  },
  log: {
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'column',
    margin: 10,
    padding: 5,
  },
  text: {
    alignSelf: 'center',
    color: colors.black,
    fontSize: 18,
    lineHeight: 25,
    margin: 10,
    textAlignVertical: 'center',
  },
  touchable: {
    alignSelf: 'flex-start',
    //backgroundColor: "blue",
  },
});
