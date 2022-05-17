import React, {FC} from 'react';
import {Alert, StyleSheet, StyleProp, ViewStyle} from 'react-native';

import colors from '../../config/colors';

import defaultStyles from '../../config/styles';
import {observer} from 'mobx-react';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';
import {ALSGenericFunctionButton} from './ALSGenericFunctionButton';

export type ALSFunctionButtonsProps = {
  backgroundColorPressed: string | null;
  kind: 'child' | 'neonate';
  style: StyleProp<ViewStyle>;
  title: string;
  type: 'function' | 'checklist';
};

export const ALSFunctionButton: FC<ALSFunctionButtonsProps> = observer(
  ({kind, title, type = 'function'}) => {
    const store = kind === 'child' ? aplsStore : nlsStore;

    let specificArray = store.getFunctionButtonTime(title);

    //consider making a new component or changing code below
    const changeBackground = specificArray.length > 0 ? true : false;

    const pressedColor = kind === 'child' ? colors.primary : colors.secondary;

    const updateTime = () => {
      if (type === 'function' && store.endEncounter === false) {
        store.addTimeHandler(title);
      } else if (type === 'checklist' && store.endEncounter === false) {
        store.addTime(title);
      }
    };

    const handlePress = () => {
      if (specificArray.length < 1) {
        updateTime();
        // nlsStore.toggleChestRiseColor(title);
        // console.log(nlsStore.chestRiseOutput);
      } else {
        Alert.alert(
          'You can only select this once',
          'Please click undo if you need to cancel this log entry.',
          [
            {
              text: 'Undo',
              onPress: () => store.removeTime(title),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => null},
          ],
          {cancelable: false},
        );
      }
    };

    const handleRemovePress = () => {
      store.removeTime(title);
    };

    return (
      <ALSGenericFunctionButton
        changeBackground={changeBackground}
        handlePress={handlePress}
        handleRemovePress={handleRemovePress}
        pressedColor={pressedColor}
        title={title}
      />
    );
  },
);
