import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';

import AppText from '../AppText';
import colors from '../../config/colors';
import ButtonIcon from './ButtonIcon';
import defaultStyles from '../../config/styles';
import NFluidInputModal from './NFluidInputModal';

const NFluidInputButton = () => {
  const [showSelection, setShowSelection] = useState(false);

  const toggleSelection = () => {
    showSelection ? setShowSelection(false) : setShowSelection(true);
  };

  return (
    <React.Fragment>
      <View style={styles.button}>
        <TouchableOpacity
          onPress={toggleSelection}
          style={{ flexDirection: 'row' }}
        >
          <View style={styles.textBox}>
            <ButtonIcon name="cup-water" />
            <AppText style={{ color: colors.white }}>
              Daily Requirements...
            </AppText>
          </View>
          {showSelection && <ButtonIcon name="chevron-down" />}
          {!showSelection && <ButtonIcon name="chevron-right" />}
        </TouchableOpacity>
      </View>
      {showSelection && (
        <React.Fragment>
          <NFluidInputModal name="Term" />
          <NFluidInputModal name="Preterm" />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default NFluidInputButton;

const styles = StyleSheet.create({
  button: {
    ...defaultStyles.container,
    alignItems: 'center',
    backgroundColor: colors.dark,
    borderRadius: 5,
    color: colors.white,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
  },
  modalView: {
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingBottom: 15,
    paddingTop: 15,
    height:
      Dimensions.get('window').height * 0.7 > 570
        ? 570
        : Dimensions.get('window').height * 0.7,
  },
  infoContainer: {
    backgroundColor: colors.dark,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: defaultStyles.container.width * 0.85,
    alignSelf: 'center',
    margin: 5,
  },
  infoTitle: {
    paddingTop: 10,
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  infoParagraph: {
    paddingTop: 5,
    padding: 15,
    color: colors.white,
    fontSize: 15,
    textAlign: 'center',
  },
  buttonContainer: {
    //backgroundColor: 'yellow',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingRight: 10,
  },
  textBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: defaultStyles.container.width - 55,
  },
  title: {
    fontSize: 19,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  gestationSelection: {
    alignItems: 'center',
    backgroundColor: colors.medium,
    borderRadius: 5,
    flexDirection: 'row',
    height: 57,
    margin: 5,
    padding: 10,
    ...defaultStyles.container,
  },
  gestationSelectionText: {
    color: colors.white,
    paddingLeft: 15,
  },
});
