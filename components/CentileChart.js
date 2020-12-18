import React from 'react';
import {
  Dimensions,
  LogBox,
  Platform,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import {LineChart, YAxis, XAxis} from 'react-native-svg-charts';
import * as shape from 'd3-shape';
import {Circle, G, Text} from 'react-native-svg';

import makeCentileChartData from '../brains/makeCentileChartData';

import defaultStyle from '../config/styles';
import colors from '../config/colors';
import AppText from './AppText';

const chartWidth =
  defaultStyle.container.width > 440 ? 360 : defaultStyle.container.width - 80;
const chartHeight = chartWidth * 1.6;

LogBox.ignoreLogs(['Warning: Failed prop type:']);

const CentileChart = ({
  ageInDays,
  ageInMonths,
  gestationInDays,
  kind,
  measurement,
  measurementType,
  sex,
}) => {
  const {
    centileLabelData,
    data,
    index,
    finalXLabels,
    bottomValueForY,
    topValueForY,
    xLabelUnits,
  } = makeCentileChartData(
    ageInDays,
    ageInMonths,
    gestationInDays,
    kind,
    measurement,
    measurementType,
    sex,
  );

  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const chartBackgroundColor = dark ? colors.black : colors.white;
  const chartForegroundColor = dark ? colors.white : colors.black;

  // looks better visually for low ages
  const curvyChart = ageInDays && ageInDays < 56 ? true : false;

  let finalXKey;
  if (kind !== 'birth') {
    kind === 'child'
      ? (finalXKey = `Age (${xLabelUnits})`)
      : (finalXKey = `Gestation (${xLabelUnits})`);
  } else {
    finalXKey = '';
  }

  `Birth Gestation: ${Math.floor(gestationInDays / 7)}+${gestationInDays % 7}`;

  let chartFontSize = 10;
  if (Platform.OS === 'ios' && (kind === 'neonate' || kind === 'birth'))
    chartFontSize = 9;

  const CentileLabels = ({x, y}) => {
    const listDetails = centileLabelData.y;
    const textProps = {
      fill: chartForegroundColor,
      fontSize: chartFontSize,
      textAnchor: 'middle',
    };
    const textItems = listDetails.map(({label, coords}, index) => (
      <Text {...textProps} y={y(coords)} key={index}>
        {label}
      </Text>
    ));
    return (
      <G>
        <G x={x(centileLabelData.x)}>{textItems}</G>
      </G>
    );
  };

  const ExtraDot = ({x, y}) => {
    return (
      <G>
        <G x={x(index)}>
          <Circle
            cy={y(data[9]['data'][index])}
            r={3}
            stroke={chartForegroundColor}
            strokeWidth={1}
            fill={chartForegroundColor}
          />
        </G>
      </G>
    );
  };

  return (
    <View
      style={[
        styles.overallContainer,
        {backgroundColor: chartBackgroundColor},
      ]}>
      <View style={[styles.fullChartContainer]}>
        <View
          style={[
            styles.smallerChartContainer,
            {width: kind === 'birth' ? chartWidth / 2 : chartWidth},
          ]}>
          <YAxis
            data={[bottomValueForY, topValueForY]}
            contentInset={{top: 5, bottom: 10}}
            formatLabel={(value) => ` ${value} `}
            svg={{
              fill: chartForegroundColor,
              fontSize: chartFontSize,
            }}
            numberOfTicks={8}
            style={styles.yAxis}
          />
          <LineChart
            data={data}
            style={{flex: 1}}
            svg={{strokeWidth: 2}}
            contentInset={{top: 5, bottom: 10, left: 3, right: 3}}
            curve={curvyChart ? shape.curveNatural : shape.curveLinear}>
            <ExtraDot />
            <CentileLabels />
          </LineChart>
        </View>
        {kind !== 'birth' && (
          <XAxis
            style={styles.xAxis}
            data={finalXLabels}
            formatLabel={(value, index) => finalXLabels[index]}
            contentInset={{left: 13, right: 13}}
            svg={{fontSize: chartFontSize, fill: chartForegroundColor}}
          />
        )}
      </View>
      <View style={styles.textLabelXContainer}>
        <AppText style={[styles.textLabelX, {color: chartForegroundColor}]}>
          {finalXKey}
        </AppText>
      </View>
    </View>
  );
};

export default CentileChart;

const styles = StyleSheet.create({
  yAxis: {
    paddingLeft: 1,
    paddingRight: 1,
    //backgroundColor: 'yellow',
    marginBottom: -2,
    marginRight: -4,
    width: 19,
  },
  xAxis: {
    width: chartWidth + 10,
    //backgroundColor: 'yellow',
    paddingTop: 2,
    marginLeft: 4,
  },
  fullChartContainer: {
    //width: chartWidth + 20,
    //backgroundColor: "green",
    padding: 10,
  },
  smallerChartContainer: {
    height: chartHeight,
    flexDirection: 'row',
    //backgroundColor: "yellow",
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overallContainer: {
    margin: 15,
    marginTop: 5,
    borderRadius: 10,
    alignSelf: 'center',
    padding: 10,
    //backgroundColor: "#F2F2F2",
    //backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
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
  textLabelX: {
    fontSize: 10,
    fontWeight: '500',
  },
  textLabelXContainer: {
    position: 'absolute',
    bottom: 6,
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
