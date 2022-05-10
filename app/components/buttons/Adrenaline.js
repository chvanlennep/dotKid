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

  const adrenaline = () => {
    if (!aplsStore.adrenalineDisplay) {
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
      setBlink(blink => !blink);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => adrenaline()}>
      <View
        style={[
          styles.button,
          (aplsStore.getFunctionButtonTime('Adrenaline Administered').length >
            0 &&
            aplsStore.adrenalineDisplay &&
            styles.buttonPressed) ||
            (aplsStore.getFunctionButtonTime('Adrenaline Administered').length >
              0 &&
              !aplsStore.adrenalineDisplay &&
              blink &&
              styles.buttonBlink),
        ]}>
        <AppText style={styles.text}>Adrenaline</AppText>

        {aplsStore.adrenalineDisplay ? (
          <AppText style={styles.text}> {aplsStore.adrenalineDisplay} </AppText>
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
    textAlign: 'center',
  },
  text: {
    color: colors.white,
  },
});
