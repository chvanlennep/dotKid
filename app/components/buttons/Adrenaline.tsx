import {observer} from 'mobx-react';
import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import AppText from '../AppText';

const Adrenaline = observer(() => {
  const [blink, setBlink] = useState(false);
  let getAdrenalineTime = aplsStore.adrenalineTimer();

  const adrenaline = () => {
    if (getAdrenalineTime === '') {
      aplsStore.addTimeHandler('Adrenaline Administered');
    } else {
      Alert.alert(
        'You can only log this every 3 minutes',
        'Please click undo if you need to cancel this log entry.',
        [
          {
            text: 'Undo',
            onPress: () => {
              aplsStore.removeTime('Adrenaline Administered');
            },
            style: 'cancel',
          },
          {text: 'OK', onPress: () => 'OK'},
        ],
        {cancelable: false},
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      setBlink(blink => !blink);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pressedStyle =
    aplsStore.getFunctionButtonTime('Adrenaline Administered').length > 0 &&
    getAdrenalineTime &&
    styles.buttonPressed;

  const blinkingStyle =
    aplsStore.getFunctionButtonTime('Adrenaline Administered').length > 0 &&
    getAdrenalineTime === '' &&
    blink &&
    styles.buttonBlink;

  return (
    <TouchableWithoutFeedback onPress={() => adrenaline()}>
      <View style={[styles.button, pressedStyle || blinkingStyle]}>
        <AppText style={styles.text}>Adrenaline</AppText>

        {getAdrenalineTime !== '' ? (
          <AppText style={styles.text}> {getAdrenalineTime} </AppText>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
});

export default Adrenaline;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 5,
    alignContent: 'center',
    backgroundColor: colors.dark,
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    height: 57,
    marginVertical: 5,
    marginHorizontal: 3,
    width: defaultStyles.container.width / 2.075,
  },
  buttonPressed: {
    backgroundColor: colors.primary,
    flexWrap: 'nowrap',
    flexDirection: 'column',
    height: 90,
    justifyContent: 'center',
    textAlign: 'center',
  },
  buttonBlink: {
    alignContent: 'center',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    // textAlign: 'center',
  },
  text: {
    color: colors.white,
  },
});
