import React from 'react';
import { Alert, Modal, StyleSheet, View, Button, Platform } from 'react-native';

import AppText from '../components/AppText';

const AcceptConditionsModal = ({ setAccepted, modalVisible }) => {
  const message =
    'This is a pre-release app. It has not been adequately tested and therefore should not be relied upon in clinical practice.\n';

  const android = Platform.OS === 'android' ? true : false;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        console.log('Window closed');
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.fullScreen}>
          <AppText style={styles.title}>Warning</AppText>
          <AppText style={styles.mainMessage}>{message}</AppText>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.buttonContainer}>
              <Button
                color={android ? 'black' : 'white'}
                title="Understood"
                onPress={() => setAccepted(true)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button
                color={android ? 'black' : 'white'}
                title="Cancel"
                onPress={() => {
                  Alert.alert('App Will Not Be Loaded', '', [
                    { text: 'OK', onPress: () => null },
                  ]);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AcceptConditionsModal;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 5,
  },
  fullScreen: {
    flex: 0.9,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
  },
  mainMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: 'white',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
