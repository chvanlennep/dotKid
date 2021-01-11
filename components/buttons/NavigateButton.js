import React, {useContext} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import colors from '../../config/colors';
import defaultStyles from '../../config/styles';
import AppText from '../AppText';
import {GlobalStatsContext} from '../GlobalStats';

const NavigateButton = ({children, directions, side = null, initialValues}) => {
  const navigation = useNavigation();
  const {moveDataAcrossGlobal} = useContext(GlobalStatsContext);
  return (
    <TouchableOpacity
      onPress={() => {
        if (side) {
          Alert.alert(
            'Go to correct calculator?',
            'This will also copy your measurements across',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => null,
              },
              {
                text: 'OK',
                onPress: () => {
                  const movingTo = side === 'RootN' ? 'neonate' : 'child';
                  moveDataAcrossGlobal(movingTo, initialValues);
                  navigation.navigate(side, {screen: directions});
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          navigation.navigate(directions);
        }
      }}>
      <View style={side ? styles.buttonSide : styles.button}>
        <AppText style={{color: side ? colors.black : colors.white}}>
          {children}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export default NavigateButton;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: defaultStyles.container.width - 25,
  },
  buttonSide: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light,
    borderRadius: 5,
    color: colors.black,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    width: defaultStyles.container.width,
  },
});
