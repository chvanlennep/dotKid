import React, {FC} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {observer} from 'mobx-react';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';

type ALSFunctionButtonsProps = {
  backgroundColorPressed: string | null;
  kind: 'child' | 'neonate';
  style: StyleProp<ViewStyle>;
  title: string;
  type: 'function' | 'checklist';
};

export const ALSFunctionButton: FC<ALSFunctionButtonsProps> = observer(
  ({kind, style, backgroundColorPressed = null, title, type = 'function'}) => {
    const store = kind === 'child' ? aplsStore : nlsStore;

    let specificArray = store.getFunctionButtonTime(title);

    const changeBackground = specificArray.length > 0 ? true : false;

    const movingChest = title === 'Chest is now moving' ? true : false;
    // logs time with event button

    const pressedColor = kind === 'child' ? colors.primary : colors.secondary;

    kind === 'child';

    const updateTime = () => {
      if (type === 'function' && store.endEncounter === false) {
        store.addTimeHandler(title);
      } else if (type === 'checklist' && store.endEncounter === false) {
        nlsStore.addTime(title);
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
            <>
              <TouchableOpacity style={styles.undo} onPress={handleRemovePress}>
                <MaterialCommunityIcons
                  name="refresh"
                  color={colors.white}
                  size={20}
                />
              </TouchableOpacity>
            </>
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
