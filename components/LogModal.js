import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import colors from "../../app/config/colors";
import defaultStyles from "../../app/config/styles";
import AppText from "./AppText";

import RhythmButton from "./buttons/RhythmButton";
import ALSDisplayButton from "./buttons/ALSDisplayButton";
import AnalyseRhythm from "./AnalyseRhythm";
import parseLog from "../brains/parseLog";

const RhythmModal = ({ logInput, logVisibleState }) => {
  const scheme = useColorScheme();
  const modalVisible = logVisibleState.value;
  const setModalVisible = logVisibleState.setValue;

  // const onShare = async () => {
  //     try {
  //       const result = await Share.share({
  //     title: 'APLS Log',
  //     message: parseLog(logInput)
  //       });
  //       if (result.action === Share.sharedAction) {
  //         if (result.activityType) {
  //           // shared with activity type of result.activityType
  //         } else {
  //           // shared
  //         }
  //       } else if (result.action === Share.dismissedAction) {
  //         // dismissed
  //       }
  //     } catch (error) {
  //       alert(error.message);
  //     }
  //   };

  return (
    <React.Fragment>
      <ALSDisplayButton
        onPress={() => setModalVisible(true)}
        style={[styles.button]}
      >
        Log
      </ALSDisplayButton>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Window has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.headers}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.closeIcon}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      color={colors.white}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>

                <AppText style={styles.heading}>APLS Log</AppText>
                <TouchableOpacity
                  style={styles.exportIcon}
                  onPress={() => {
                    onShare;
                  }}
                >
                  <View style={styles.exportIcon}>
                    <MaterialCommunityIcons
                      name="export"
                      color={colors.white}
                      size={30}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.log,
                  {
                    backgroundColor:
                      scheme === "dark" ? colors.black : colors.white,
                  },
                ]}
              >
                <ScrollView>
                  <AppText
                    style={[
                      styles.text,
                      {
                        color: scheme === "dark" ? colors.white : colors.black,
                      },
                    ]}
                  >
                    {parseLog(logInput)}
                  </AppText>
                </ScrollView>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </React.Fragment>
  );
};

export default RhythmModal;

const styles = StyleSheet.create({
  button: {
    alignContent: "center",
    backgroundColor: colors.dark,
    justifyContent: "center",
    textAlign: "center",
    width: "44%",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    height: 50,
    width: 50,
    //backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  exportIcon: {
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    width: 50,
  },
  heading: {
    alignSelf: "center",
    color: colors.white,
    fontSize: 20,
    marginBottom: 5,
  },
  headers: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    paddingBottom: 10,
    elevation: 5,
    height: defaultStyles.container.width + 20,
    width: defaultStyles.container.width - 10,
    backgroundColor: "#B32425",
  },
  log: {
    alignContent: "flex-start",
    justifyContent: "flex-start",
    backgroundColor: colors.white,
    borderRadius: 5,
    flex: 1,
    flexDirection: "column",
    margin: 10,
    padding: 5,
  },
  text: {
    alignSelf: "center",
    color: colors.black,
    fontSize: 18,
    lineHeight: 25,
    margin: 10,
    textAlignVertical: "center",
  },
  touchable: {
    alignSelf: "flex-start",
    //backgroundColor: "blue",
  },
});
