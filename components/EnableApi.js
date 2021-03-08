import React, {useState, useEffect} from 'react';
import {
  Modal,
  StyleSheet,
  Linking,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import useApi from '../brains/useApi';

import AppText from '../components/AppText';
import colors from '../config/colors';

const EnableApi = ({setModalVisible, modalVisible}) => {
  const [text, setText] = useState('');
  const {setApiKey, key} = useApi();

  const cancel = () => {
    setModalVisible(false);
  };

  const enter = () => {
    setApiKey(text, setModalVisible);
  };

  const disable = () => {
    setApiKey('', setModalVisible, true);
  };

  useEffect(() => {
    if (!modalVisible && text) {
      setText('');
    }
  }, [text, modalVisible]);

  const status = key !== '' ? 'enabled' : 'disabled';

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.fullScreen}>
          <AppText style={styles.title}>RCPCH Growth Project</AppText>
          <AppText style={styles.subHeading}>
            Want to try out RCPCH's digital growth project?
          </AppText>
          <KeyboardAwareScrollView>
            <AppText style={styles.mainText}>
              RCPCH have a ongoing project to digitise their growth charts. As
              this service is not yet ready for general use, you can enable
              specific RCPCH growth calculators in dotKid by obtaining a
              subscription key from RCPCH. {'\n\n'}This is free, but is a
              multi-stage process. You must register for an account at{' '}
              {
                <AppText
                  style={[styles.mainText, {textDecorationLine: 'underline'}]}
                  onPress={() => Linking.openURL('https://dev.rcpch.ac.uk')}>
                  {'dev.rcpch.ac.uk'}
                </AppText>
              }
              , click on 'Explore APIs' in the top right hand corner of the
              webpage and select 'RCPCH APIs - free tier' under Tiers.{'\n\n'}
              Once you have successfully signed up to the free tier, you should
              be able to find your primary subscription key under 'Profile',
              which you need to copy and paste in the box below:
            </AppText>
            <View style={styles.smallButton}>
              <TextInput
                style={styles.pasteText}
                onChangeText={(inputText) => {
                  setText(inputText);
                }}
                value={text}
                clearTextOnFocus={false}
                placeholder="Paste Subscription Key Here"
                placeholderTextColor={colors.medium}
                multiline={false}
                textAlignVertical="top"
                onBlur={enter}
                returnKeyType="done"
              />
            </View>
            <AppText
              style={styles.subHeading}>{`Currently: ${status}`}</AppText>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={enter} style={styles.smallButton}>
                <AppText style={{color: 'white'}}>{`Enter ${
                  status === 'enabled' ? 'New ' : ''
                }Key`}</AppText>
              </TouchableOpacity>
              {status === 'enabled' && (
                <TouchableOpacity onPress={disable} style={styles.smallButton}>
                  <AppText style={{color: 'white'}}>Disable</AppText>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={cancel} style={styles.smallButton}>
                <AppText style={{color: 'white'}}>Cancel</AppText>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EnableApi;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '90%',
    marginBottom: 15,
    marginTop: 15,
  },
  fullScreen: {
    height: '90%',
    width: '98%',
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    color: 'white',
    fontSize: 28,
    fontWeight: '500',
    marginTop: 25,
    marginBottom: 10,
  },
  pasteText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: 'white',
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
  subHeading: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    margin: 10,
    padding: 5,
  },
  mainText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
    margin: 15,
    paddingTop: 0,
    paddingBottom: 20,
  },
});
