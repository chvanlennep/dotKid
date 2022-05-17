import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../../config/colors';
import AppText from '../AppText';
import defaultStyles from '../../config/styles';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';
import {observer} from 'mobx-react';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';

type ALSFunctionButtonType = {
  kind?: string | undefined;
  style?: React.CSSProperties | undefined;
  title: string;
  inModal?: boolean | undefined;
};
export const ALSTertiaryFunctionButton: FC<ALSFunctionButtonType> = observer(
  ({kind, style, title, inModal = false}) => {
    const store = kind === 'child' ? aplsStore : nlsStore;
    const clicks = store.getFunctionButtonTime(title).length;
    const changeBackground = clicks > 0 ? true : false;

    const handlePress = () => {
      store.addTimeHandler(title);
    };

    const pressedColor = kind === 'child' ? colors.primary : colors.secondary;

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
        <View
          style={[
            styles.button,

            changeBackground && {
              backgroundColor: pressedColor,
            },
          ]}>
          <View
            style={[
              styles.textContainer,
              {width: defaultStyles.container.width - (inModal ? 85 : 55)},
            ]}>
            <AppText style={styles.text}>{`${title} ${
              clicks ? 'x' + clicks : ''
            }`}</AppText>
          </View>
          {changeBackground && (
            <React.Fragment>
              <TouchableOpacity
                style={styles.undo}
                onPress={() => store.removeTime(title)}>
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
    flex: 1,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  text: {
    color: colors.white,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  undo: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 35,
    width: 35,
  },
});
