import React, {FC} from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';

import ALSToolButton from './buttons/ALSToolButton';
import EndEncounterModal from './EndEncounterModal';
import colors from '../config/colors';

type NLSToolbarType = {
  reset: () => void;
  setLogVisible: () => void;
};

const NLSToolbar: FC<NLSToolbarType> = ({reset, setLogVisible}) => {
  return (
    <View style={[styles.container]}>
      <ALSToolButton
        name="Reset"
        onPress={reset}
        style={{width: useWindowDimensions().width / 2}}
      />
      <EndEncounterModal setLogVisible={setLogVisible} />
    </View>
  );
};

export default NLSToolbar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
  },
});
