import React, {useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AppText from '../AppText';
import colors from '../../config/colors';
import Icon from '../Icon';
import defaultStyles from '../../config/styles';

const modalWidth =
  defaultStyles.container.width > 400 ? 400 : defaultStyles.container.width;

const MoreCentileInfo = ({exactCentile}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const modalHeading = `Centile Reference Values:`;
  const modalMessage = `${exactCentile}`;
  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}>
        <View style={styles.mainContainer}>
          <Icon
            name="information-outline"
            width={40}
            height={40}
            borderRadius={5}
            backgroundColor={colors.dark}
          />
        </View>
      </TouchableOpacity>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
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
              <View style={styles.modalMessage}>
                <AppText style={styles.modalTextParagraph}>
                  {modalMessage}
                </AppText>
              </View>
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
    alignSelf: 'center',
  },
  modalMessage: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 5,
    padding: 5,
    paddingLeft: 2,
    paddingRight: 2,
    paddingTop: 20,
    margin: 8,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    height: modalWidth - 10,
    width: modalWidth,
    backgroundColor: colors.light,
  },
  modalTextHeadings: {
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 20,
    fontWeight: '500',
    color: colors.white,
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.dark,
    flex: 1,
    padding: 5,
    paddingLeft: 2,
    paddingRight: 2,
    margin: 8,
  },
  modalTextParagraph: {
    color: colors.white,
    marginBottom: 5,
    textAlign: 'center',
    flex: 9,
    flexWrap: 'wrap',
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: '400',
    fontSize: 18,
    // backgroundColor: "green",
  },
});
