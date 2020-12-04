import React, {useState} from 'react';
import {
  Appearance,
  Dimensions,
  LogBox,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';
import AppText from './AppText';
import CentileChart from './CentileChart';
import Icon from './Icon';

const {height, width} = Dimensions.get('window');
const aspectRatio = height / width;
const chartWidth = aspectRatio > 1.6 ? width - 90 : width - 250;
const chartHeight = chartWidth * 1.6;

const scheme = Appearance.getColorScheme();

LogBox.ignoreLogs(['Warning: Failed prop type:']);

const CentileChartModal = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {
    measurement,
    measurementType,
    kind,
    ageInDays,
    gestationInDays,
  } = props;

  let titleLabel = '';
  let units = '(cm)';
  let showChart = true;
  let showPlaceholder = false;
  let gestationLabel;

  if (!measurement) {
    showChart = false;
    showPlaceholder = true;
    units = '';
  } else {
    if (kind === 'birth')
      gestationInDays >= 259
        ? (gestationLabel = 'Chart for term infants')
        : (gestationLabel = `Chart for ${Math.floor(gestationInDays / 7)}+${
            gestationInDays % 7
          } infants`);

    switch (measurementType) {
      case 'hc':
        titleLabel = 'H. C.';
        if (
          (ageInDays && ageInDays > 730) ||
          (!ageInDays && !gestationInDays)
        ) {
          showChart = false;
          showPlaceholder = true;
        }
        break;
      case 'weight':
        titleLabel = 'Weight';
        units = '(kg)';
        break;
      case 'height':
        if (kind === 'child') {
          ageInDays > 730 || !ageInDays
            ? (titleLabel = 'Height')
            : (titleLabel = 'Length');
        }
        break;
      case 'length':
        titleLabel = 'Length';
        if (gestationInDays < 175) {
          showChart = false;
          showPlaceholder = true;
          gestationLabel = null;
        }
        break;
      case 'bmi':
        titleLabel = 'BMI';
        units = '(kg/m²)';
        break;
      default:
        titleLabel = 'No title';
    }
  }

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        style={{margin: 6}}>
        <Icon
          name="chart-line"
          width={40}
          height={40}
          borderRadius={5}
          backgroundColor={colors.dark}
        />
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
              <View style={styles.closeIcon}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.black}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <AppText
                style={styles.title}>{`${titleLabel} Chart ${units}`}</AppText>
              {gestationLabel && (
                <AppText style={styles.gestationLabel}>
                  {gestationLabel}
                </AppText>
              )}
              {showChart && <CentileChart {...props} />}
              {showPlaceholder && (
                <View style={styles.placeHolder}>
                  <AppText style={styles.placeHolderText}>N/A</AppText>
                </View>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default CentileChartModal;

const styles = StyleSheet.create({
  closeIcon: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "red",
    alignSelf: 'flex-start',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gestationLabel: {
    fontWeight: '500',
    paddingBottom: 5,
    fontSize: 16,
    color: colors.black,
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
    backgroundColor: colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  placeHolder: {
    height: chartHeight,
    width: chartWidth,
    borderRadius: 10,
    color: colors.light,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeHolderText: {
    fontSize: 40,
    fontWeight: '500',
    color: colors.medium,
  },
  title: {
    alignItems: 'center',
    color: colors.black,
    justifyContent: 'center',
    marginRight: -10,
    marginTop: -30,
    marginBottom: 10,
    //backgroundColor: "blue",
    alignSelf: 'center',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  viewChartButton: {
    backgroundColor: colors.dark,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignSelf: 'center',
  },
});
