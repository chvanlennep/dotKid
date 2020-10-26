import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import AppText from '../AppText';
import colors from '../../config/colors';
import Icon from '../Icon';
import defaultStyles from '../../config/styles';

const modalWidth =
  defaultStyles.container.width > 400 ? 400 : defaultStyles.container.width;

const MoreCentileInfo = ({ exactCentile }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalHeading = `Exact centile: ${exactCentile}`;
  const modalMessage = `The default answer follows RCPCH guidelines based on major centile lines (50th, 75th etc.): \n
  If a centile measurement is within 1/4 of the distance between 2 major centile lines, the measurement is considered to lie 'on' the nearest major centile line. Otherwise it is either considered to lie between, above or below.\n
    This may lead to some confusion when viewing the exact centile calculated, as for example a reading on the 56th centile will be categorised as 'on' the 50th centile line.`;
  return (
    <React.Fragment>
      <View style={styles.mainContainer}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <Icon
            name="information-outline"
            width={40}
            height={40}
            borderRadius={5}
            backgroundColor={colors.dark}
          ></Icon>
        </TouchableOpacity>
      </View>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Window has been closed.');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <View style={styles.closeIcon}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.black}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.modalTextHeadingWrapper}>
                <AppText style={styles.modalTextHeadings}>
                  {modalHeading}
                </AppText>
              </View>
              <AppText style={styles.modalTextParagraph}>
                {modalMessage}
              </AppText>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default MoreCentileInfo;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    height: 50,
    width: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    width: modalWidth,
    backgroundColor: colors.light,
  },
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 15,
    fontWeight: '500',
    color: colors.white,
    textAlign: 'center',
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 2,
    flexWrap: "wrap",
    padding: 5,
    paddingLeft: 5,
    paddingRight: 5,
    margin: 8,
  },
  modalTextParagraph: {
    color: colors.black,
    marginBottom: 5,
    textAlign: 'center',
    //flex: 9,
    flexWrap: 'wrap',
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: '400',
    paddingBottom: 20,
    // backgroundColor: "green",
  },
});
