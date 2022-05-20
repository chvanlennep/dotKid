import React, {FC} from 'react';
import {Alert} from 'react-native';

import colors from '../../config/colors';

import {observer} from 'mobx-react';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';
import {ALSGenericFunctionButton} from './ALSGenericFunctionButton';

export const ChestRiseButton: FC<{title: string}> = observer(({title}) => {
  const changeBackground = nlsStore.chestRiseOutput[title];

  const pressedColor = colors.secondary;

  const updateTime = () => {
    nlsStore.addTimeHandler(title);
    nlsStore.toggleChestRiseColor(title);
  };

  const handlePress = () => {
    if (nlsStore.chestRiseOutput[title] === false) {
      updateTime();
    } else {
      Alert.alert(
        'You can only select this once',
        'Please click undo if you need to cancel this log entry.',
        [
          {
            text: 'Undo',
            onPress: () => nlsStore.removeTime(title),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => null},
        ],
        {cancelable: false},
      );
    }
  };

  const handleRemovePress = () => {
    nlsStore.removeTime(title);
    nlsStore.toggleChestRiseColor(title);
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
});
