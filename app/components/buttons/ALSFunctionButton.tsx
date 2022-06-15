import React, {FC} from 'react';
import {Alert, StyleProp, ViewStyle} from 'react-native';

import colors from '../../config/colors';

import {observer} from 'mobx-react';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';
import {ALSGenericFunctionButton} from './ALSGenericFunctionButton';

export type ALSFunctionButtonsProps = {
  acceptsMultipleClicks?: boolean;
  backgroundColorPressed?: string | null;
  clicks?: number;
  kind: 'child' | 'neonate';
  style?: StyleProp<ViewStyle>;
  title: string;
  type: 'function' | 'checklist';
};

export const ALSFunctionButton: FC<ALSFunctionButtonsProps> = observer(
  ({acceptsMultipleClicks, kind, style, title, type = 'function'}) => {
    const store = kind === 'child' ? aplsStore : nlsStore;

    let specificArray = store.getFunctionButtonTime(title);

    //consider making a new component or changing code below
    const changeBackground = specificArray.length > 0;

    const pressedColor = kind === 'child' ? colors.primary : colors.secondary;

    const updateTime = () => {
      if (type === 'function' && !store.endEncounter) {
        store.addTimeHandler(title);
      } else if (type === 'checklist' && !store.endEncounter) {
        store.addTime(title);
      }
    };

    const handlePress = () => {
      if (specificArray.length < 1 || acceptsMultipleClicks) {
        updateTime();
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
        acceptsMultipleClicks={acceptsMultipleClicks}
        changeBackground={changeBackground}
        clicks={specificArray.length}
        handlePress={handlePress}
        handleRemovePress={handleRemovePress}
        kind={kind}
        pressedColor={pressedColor}
        style={style}
        title={title}
      />
    );
  },
);
