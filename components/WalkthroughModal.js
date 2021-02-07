import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import AppText from '../components/AppText';
import colors from '../config/colors';
import {windowWidth} from '../config/styles';

const WalkthroughModal = ({setWalkthroughVisible, walkthroughVisible}) => {
  const [currentPosition, setCurrentPosition] = useState(0);

  const handlePress = (forward = true) => {
    if (forward) {
      if (currentPosition === 2) {
        setWalkthroughVisible(false);
      } else {
        setCurrentPosition((old) => old + 1);
      }
    } else {
      setCurrentPosition((old) => old - 1);
    }
  };

  const scheme = useColorScheme();

  const dark = scheme === 'dark' ? true : false;

  const textColor = {color: dark ? 'black' : 'white'};

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={walkthroughVisible}
      onRequestClose={() => {
        Alert.alert('Please complete the Walkthrough', '', [
          {text: 'OK', onPress: () => null},
        ]);
      }}>
      <View style={styles.centeredView}>
        <View
          style={[
            styles.fullScreen,
            {backgroundColor: dark ? colors.light : colors.black},
          ]}>
          <AppText style={[styles.title, textColor]}>Walkthrough</AppText>
          <View style={styles.middleView}>
            {currentPosition === 0 && (
              <AppText style={[styles.additionalWarningText, textColor]}>
                Just a quick walkthrough...
              </AppText>
            )}
            {currentPosition === 1 && (
              <Image
                style={styles.image}
                source={
                  dark
                    ? require('../assets/walkthrough/top_dark.png')
                    : require('../assets/walkthrough/top_light.png')
                }
              />
            )}
            {currentPosition === 2 && (
              <AppText style={[styles.additionalWarningText, textColor]}>
                At the bottom of the screen, press here to access the
                resuscitation mode.
              </AppText>
            )}
            {currentPosition === 2 && (
              <Image
                style={styles.image}
                source={
                  dark
                    ? require('../assets/walkthrough/bottom_dark.png')
                    : require('../assets/walkthrough/bottom_light.png')
                }
              />
            )}
            {currentPosition === 1 && (
              <AppText style={[styles.additionalWarningText, textColor]}>
                At the top of the screen, press here to change between
                paediatric and neonatal modes.
              </AppText>
            )}
          </View>
          <View style={styles.buttonContainer}>
            {currentPosition !== 0 && (
              <TouchableOpacity
                onPress={() => handlePress(false)}
                style={styles.smallButton}>
                <AppText style={styles.smallButtonText}>Previous</AppText>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handlePress} style={styles.smallButton}>
              <AppText style={styles.smallButtonText}>
                {currentPosition === 2 ? 'Finish' : 'Next'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default WalkthroughModal;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '50%',
    marginBottom: 15,
    marginTop: 10,
  },
  image: {
    width: windowWidth * 0.9,
    height: windowWidth * 0.62,
    resizeMode: 'contain',
  },
  fullScreen: {
    height: '90%',
    width: '98%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '70%',
  },
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.dark,
    height: 50,
    padding: 10,
    margin: 10,
  },
  smallButtonText: {
    color: 'white',
  },
  additionalWarningText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    margin: 30,
  },
  legalText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 5,
    margin: 15,
  },
  walkthrough: {
    alignItems: 'center',
    borderRadius: 10,
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
  },
});
