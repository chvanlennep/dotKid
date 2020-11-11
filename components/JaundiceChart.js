import React, { useState } from 'react';
import {
  Dimensions,
  LogBox,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { LineChart, XAxis, YAxis } from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import { Circle, G } from 'react-native-svg';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import makeDataObject from '../brains/makeJaundiceChartData';
import defaultStyle from '../config/styles';
import colors from '../config/colors';
import AppText from '../components/AppText';

const { height, width } = Dimensions.get('window');
const aspectRatio = height / width;
const chartWidth =
  aspectRatio > 1.6
    ? defaultStyle.container.width - 90
    : defaultStyle.container.width - 250;
const chartHeight = chartWidth * 1.6;

LogBox.ignoreLogs(['Warning: Failed prop type:']);

const JaundiceChart = ({ ageInHours, gestationWeeks, sbr }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const chartBackgroundColor = dark ? colors.black : colors.white;
  const chartForegroundColor = dark ? colors.white : colors.black;

  let index = ageInHours;
  if (ageInHours > 36 && ageInHours < 301) {
    index = 36;
  } else if (ageInHours >= 301) {
    index = 36 + (36 - (336 - ageInHours));
  }

  const { data, topLimit, finalXLabels } = makeDataObject(
    gestationWeeks,
    ageInHours,
    sbr
  );

  const ExtraDot = ({ x, y }) => (
    <G>
      <G x={x(index)}>
        <Circle
          cy={y(data[2]['data'][index])}
          r={3}
          stroke={chartForegroundColor}
          strokeWidth={1}
          fill={chartForegroundColor}
        />
      </G>
    </G>
  );

  return (
    <React.Fragment>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View style={styles.viewChartButton}>
          <AppText
            style={{
              color: colors.white,
              fontWeight: '500',
              textAlign: 'center',
            }}
          >
            View Chart
          </AppText>
        </View>
      </TouchableOpacity>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            console.log('Window closed');
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.closeIcon}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <MaterialCommunityIcons
                    name="close-circle"
                    color={colors.black}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <AppText style={styles.modalHeading}>SBR Chart</AppText>
              <View
                style={[
                  styles.bigChartContainer,
                  { backgroundColor: chartBackgroundColor },
                ]}
              >
                <View style={styles.smallChartContainer}>
                  <YAxis
                    data={[0, topLimit]}
                    contentInset={{ top: 10, bottom: 10 }}
                    svg={{
                      fill: chartForegroundColor,
                      fontSize: 9,
                    }}
                    numberOfTicks={10}
                    formatLabel={(value) => `${value}`}
                    style={styles.axis}
                  />
                  <LineChart
                    data={data}
                    style={styles.chart}
                    svg={{ strokeWidth: 4 }}
                    contentInset={{ top: 10, bottom: 10 }}
                    curve={shape.curveLinear}
                  >
                    <ExtraDot />
                  </LineChart>
                </View>
                <XAxis
                  style={styles.xAxis}
                  data={finalXLabels}
                  formatLabel={(value, index) => finalXLabels[index]}
                  contentInset={{ left: 10, right: 10 }}
                  svg={{ fill: chartForegroundColor, fontSize: 10 }}
                />
              </View>
              <AppText style={styles.xAxisKey}>Age (days)</AppText>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default JaundiceChart;

const styles = StyleSheet.create({
  axis: {
    paddingLeft: 1,
    paddingRight: 1,
  },
  xAxis: {
    paddingTop: 2,
    width: chartWidth,
    //backgroundColor: 'yellow',
    alignSelf: 'center',
    marginLeft: 8,
  },
  chart: {
    height: chartHeight,
    width: chartWidth,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  bigChartContainer: {
    alignSelf: 'center',
    borderRadius: 10,
    width: chartWidth + 20,
    paddingLeft: 2,
    paddingBottom: 2,
  },
  smallChartContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  closeIcon: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeading: {
    alignSelf: 'center',
    color: colors.black,
    marginTop: -25,
    marginBottom: 10,
    marginLeft: -5,
    fontWeight: '500',
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
    width: chartWidth + 70,
    backgroundColor: colors.light,
    paddingBottom: 5,
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    textAlign: 'center',
  },
  viewChartButton: {
    backgroundColor: colors.dark,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    width: '30%',
    alignSelf: 'center',
  },
  xAxisKey: {
    fontSize: 13,
    color: colors.black,
    alignSelf: 'center',
    fontWeight: '500',
    padding: 5,
  },
});
