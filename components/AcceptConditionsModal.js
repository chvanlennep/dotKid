import React from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';

import AppText from '../components/AppText';
import {LegalText} from '../screens/AboutScreen';

const AcceptConditionsModal = ({setAccepted, modalVisible}) => {
  const accept = () => setAccepted(true);

  const denied = () => {
    Alert.alert('App Will Not Be Loaded', '', [
      {text: 'OK', onPress: () => null},
    ]);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('App Will Not Be Loaded', '', [
          {text: 'OK', onPress: () => null},
        ]);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.fullScreen}>
          <AppText style={styles.title}>Warning</AppText>
          <AppText style={styles.additionalWarningText}>
            This app is for teaching / educational purposes only.
          </AppText>
          <ScrollView>
            <LegalText style={styles.legalText} modal />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={accept} style={styles.smallButton}>
                <AppText style={{color: 'white'}}>Understood</AppText>
              </TouchableOpacity>
              <TouchableOpacity onPress={denied} style={styles.smallButton}>
                <AppText style={{color: 'white'}}>Cancel</AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AcceptConditionsModal;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '75%',
    marginBottom: 15,
    marginTop: 10,
  },
  fullScreen: {
    height: '90%',
    width: '98%',
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
    marginTop: 15,
    marginBottom: 10,
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
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'black',
    height: 50,
    padding: 10,
  },
  additionalWarningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: 'black',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    overflow: 'hidden',
    width: '95%',
  },
  legalText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 5,
    margin: 15,
  },
});
