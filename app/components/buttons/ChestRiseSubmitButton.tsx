import React, {FC} from 'react';
import {
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
import {nlsStore} from '../../brains/stateManagement/nlsState.store';
import {observer} from 'mobx-react';

type ChestRiseButtonProps = {
  style?: StyleProp<ViewStyle>;
  modalState: {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
  };
};

export const ChestRiseSubmitButton: FC<ChestRiseButtonProps> = observer(
  ({style, modalState}) => {
    const setModalVisible = modalState.setValue;

    const handlePress = () => {
      nlsStore.addTimeHandler('Chest is now moving');
      setModalVisible(false);
      nlsStore.resetChestRiseColor();
    };

    return (
      <TouchableOpacity activeOpacity={0.5} onPress={handlePress}>
        <View style={[styles.button, style]}>
          <AppText style={styles.text}>{'Chest is now moving'}</AppText>
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
