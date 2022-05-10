import React from 'react';
import {Alert, StyleSheet, View, TouchableOpacity} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {observer} from 'mobx-react';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';

export const ALSFunctionButton = observer(
  ({
    kind = 'child',
    style,
    backgroundColorPressed = null,
    title,
    type = 'function',
  }) => {
    const specificArray = aplsStore.getFunctionButtonTime(title);

    const changeBackground = specificArray.length > 0 ? true : false;

    const movingChest = title === 'Chest is now moving' ? true : false;
    // logs time with event button
    const updateTime = () => {
      if (type === 'function' && aplsStore.endEncounter === false) {
        aplsStore.addTimeHandler(title);
      } else if (type === 'checklist' && aplsStore.endEncounter === false) {
        //**work in progress for nlsStore**
      }
    };

    const handlePress = () => {
      if (specificArray.length < 1) {
        updateTime();
      } else {
        Alert.alert(
          'You can only select this once',
          'Please click undo if you need to cancel this log entry.',
          [
            {
              text: 'Undo',
              onPress: () => aplsStore.removeTime(title),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => null},
          ],
          {cancelable: false},
        );
      }
    };

    const pressedColor = kind === 'child' ? colors.primary : colors.secondary;

    const handleRemovePress = () => {
      aplsStore.removeTime(title);
    };

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
        <View
          style={[
            styles.button,
            style,
            changeBackground && [
              {
                backgroundColor: backgroundColorPressed || pressedColor,
              },
            ],
          ]}>
          <AppText style={styles.text}>{title}</AppText>
          {changeBackground && !movingChest && (
            <React.Fragment>
              <TouchableOpacity style={styles.undo} onPress={handleRemovePress}>
                <MaterialCommunityIcons
                  name="refresh"
                  color={colors.white}
                  size={20}
                />
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  text: {
    textAlignVertical: 'center',
    height: 25,
    color: colors.white,
    width: defaultStyles.container.width - 55,
  },
  undo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
