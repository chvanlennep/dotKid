import React from 'react';
import { Alert, StyleSheet, View, Button, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import AppText from '../components/AppText';
import Screen from '../components/Screen';

const AcceptConditionsScreen = ({ setAccepted }) => {
  const message =
    'This is a pre-release app. It has not been adequately tested and therefore should not be relied upon in clinical practice.\n';

  const android = Platform.OS === 'android' ? true : false;

  const writeItemToStorage = async (newValue) => {
    const serialisedValue = JSON.stringify(newValue);
    try {
      await AsyncStorage.setItem('prerelease_accepted', serialisedValue);
    } catch (error) {
      console.log(`Error writing item: ${error}`);
    }
    setAccepted(newValue);
  };

  return (
    <Screen style={styles.fullScreen}>
      <AppText style={styles.title}>Warning</AppText>
      <AppText style={styles.mainMessage}>{message}</AppText>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.buttonContainer}>
          <Button
            color={android ? 'black' : 'white'}
            title="Understood"
            onPress={() => writeItemToStorage(true)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={android ? 'black' : 'white'}
            title="Cancel"
            onPress={() => {
              writeItemToStorage(false);
              Alert.alert('App Will Not Be Loaded', '', [
                { text: 'OK', onPress: () => null },
              ]);
            }}
          />
        </View>
      </View>
    </Screen>
  );
};

export default AcceptConditionsScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    margin: 5,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
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
});
