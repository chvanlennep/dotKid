import React, { useState } from "react";
import {
  Appearance,
  Dimensions,
  LogBox,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart, YAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import { Circle, G } from "react-native-svg";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import makeDataObject from "../brains/makeJaundiceChartData";
import defaultStyle from "../config/styles";
import colors from "../config/colors";
import AppText from "../components/AppText";

LogBox.ignoreLogs(["Warning: Failed prop type:"]);

const { height, width } = Dimensions.get("window");
const aspectRatio = height / width;
const chartWidth =
  aspectRatio > 1.6
    ? defaultStyle.container.width - 90
    : defaultStyle.container.width - 250;
const chartHeight = chartWidth * 1.6;
const scheme = Appearance.getColorScheme();

const JaundiceChart = ({ ageInHours, gestationWeeks, sbr }) => {
  const [modalVisible, setModalVisible] = useState(false);

  let index = ageInHours;
  if (ageInHours > 36 && ageInHours < 301) {
    index = 36;
  } else if (ageInHours >= 301) {
    index = 36 + (36 - (336 - ageInHours));
  }

  const { data, topLimit } = makeDataObject(gestationWeeks, ageInHours, sbr);

  const ExtraDot = ({ x, y }) => {
    let color;

    return (
      <G>
        <G x={x(index)}>
          <Circle
            cy={y(data[2]["data"][index])}
            r={3}
            stroke={colors.black}
            strokeWidth={1}
            fill={colors.black}
          />
        </G>
      </G>
    );
  };

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
              fontWeight: "500",
              textAlign: "center",
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
            console.log("Window closed");
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
                    color={scheme === "dark" ? colors.black : colors.white}
                    size={30}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.chartContainer}>
                <YAxis
                  data={[0, topLimit]}
                  contentInset={{ top: 10, bottom: 10 }}
                  svg={{
                    fill: colors.black,
                    fontSize: 9,
                    fontWeight: "500",
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
  chart: {
    height: chartHeight,
    width: chartWidth,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: colors.white,
  },
  chartContainer: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: colors.light,
    borderRadius: 10,
    width: chartWidth + 16,
  },
  closeIcon: {
    height: 40,
    width: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.medium,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
    width: chartWidth + 70,
    height: chartHeight + 70,
    backgroundColor: colors.medium,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
  },
  viewChartButton: {
    backgroundColor: colors.dark,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    width: "30%",
    alignSelf: "center",
  },
});
