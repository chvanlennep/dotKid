import React, { useState } from "react";
import { Alert, Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import AppText from "../AppText";
import colors from "../../config/colors";
import defaultStyle from "../../config/styles";
import Icon from "../Icon";

const SubmitButton = ({
  gestationWeeks,
  kind,
  valueBeforeCorrection,
  valueAfterCorrection,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const buttonWidth = defaultStyle.container.width;
  let outputString;
  let modalHeading;
  let modalMessage;
  const addOrdinalSuffix = (inputNumber) => {
    let answerNumber = inputNumber;
    if (Number.isInteger(inputNumber) === false) {
      inputNumber *= 10;
      if (Number.isInteger(inputNumber) === false) {
        return "Error: only integers or numbers to 1 decimal place are supported";
      }
    }
    let remainder10 = inputNumber % 10;
    let remainder100 = inputNumber % 100;
    if (remainder10 === 1 && remainder100 != 11) {
      return `${answerNumber}st`;
    }
    if (remainder10 === 2 && remainder100 != 12) {
      return `${answerNumber}nd`;
    }
    if (remainder10 === 3 && remainder100 != 13) {
      return `${answerNumber}rd`;
    } else {
      return `${answerNumber}th`;
    }
  };
  const decidePluralSuffix = (inputNumber) => {
    if (inputNumber === 1) {
      return "";
    } else {
      return "s";
    }
  };
  if (kind === "child") {
    if (valueAfterCorrection !== "not corrected") {
      outputString = `Age: ${valueAfterCorrection}`;
    } else {
      outputString = `Age: ${valueBeforeCorrection}`;
    }
    modalHeading = `Age before correction: ${valueBeforeCorrection}\n
    Age after correction: ${valueAfterCorrection}`;
    modalMessage = `Ages are corrected for gestation according to RCPCH guidelines:\n
    Until 1 year of chronological age for children born 32+0 to 36+6 weeks gestation.\n
    Until 2 years of chronological age for children born before 32 weeks gestation.`;
  } else if (kind === "neonate") {
    const pretermAge = valueAfterCorrection - valueBeforeCorrection;
    const birthGestationWeeks = Math.floor(valueBeforeCorrection / 7);
    const birthGestationDays = valueBeforeCorrection % 7;
    const correctedGestationWeeks = Math.floor(valueAfterCorrection / 7);
    const correctedGestationDays = valueAfterCorrection % 7;
    const pluralSuffix = decidePluralSuffix(pretermAge);
    outputString = `Corrected Gestational Age: ${correctedGestationWeeks}+${correctedGestationDays}`;
    modalHeading = `Birth Gestation: ${birthGestationWeeks}+${birthGestationDays} \n \n ${outputString}`;
    modalMessage = `${pretermAge} day${pluralSuffix} old (${addOrdinalSuffix(
      pretermAge + 1
    )} day of life)`;
  } else if (kind === "jaundice") {
    let outputGestation = gestationWeeks;
    if (gestationWeeks >= 38) outputGestation = "38+";
    outputString = `${valueBeforeCorrection} old, ${outputGestation} week chart`;
  } else {
    const birthGestationWeeks = Math.floor(valueBeforeCorrection / 7);
    const birthGestationDays = valueBeforeCorrection % 7;
    outputString = `Gestation: ${birthGestationWeeks}+${birthGestationDays}`;
    modalHeading = outputString;
    modalMessage = `As per RCPCH guidelines, infants born at term (37 weeks and higher) are compared against all term infants and not just infants born at their gestation.\n 
      Preterm infants are compared against infants born at their specific gestation.`;
  }
  const buttonBackGroundColor =
    kind === "child" ? colors.primary : colors.secondary;

  if (kind !== "jaundice")
    return (
      <React.Fragment>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <View
            style={[
              styles.submitButton,
              {
                backgroundColor: buttonBackGroundColor,
              },
            ]}
          >
            <AppText style={{ color: colors.white }}>{outputString}</AppText>
            <Icon
              backgroundColor={null}
              height={40}
              width={40}
              name="information-outline"
            />
          </View>
        </TouchableOpacity>
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
              <View
                style={[
                  styles.modalView,
                  {
                    height:
                      kind === "neonate"
                        ? (buttonWidth - 10) / 1.2
                        : buttonWidth - 10,
                  },
                ]}
              >
                <TouchableOpacity
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
  else
    return (
      <View
        style={[
          styles.submitButton,
          {
            backgroundColor: buttonBackGroundColor,
          },
        ]}
      >
        <AppText style={{ color: colors.white }}>{outputString}</AppText>
      </View>
    );
};

export default SubmitButton;

const styles = StyleSheet.create({
  closeIcon: {
    height: 50,
    width: 50,
    backgroundColor: colors.medium,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 5,
    color: colors.white,
    flexDirection: "row",
    height: 57,
    margin: 5,
    padding: 10,
    justifyContent: "center",
    width: defaultStyle.container.width,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    elevation: 5,
    width: defaultStyle.container.width - 10,
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
  modalTextHeadings: {
    textAlign: "center",
    flexWrap: "wrap",
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  modalTextHeadingWrapper: {
    borderRadius: 5,
    marginTop: 0,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
    flex: 1,
    padding: 8,
    margin: 10,
  },
  modalTextParagraph: {
    color: colors.white,
    marginBottom: 5,
    textAlign: "center",
    flex: 2,
    flexWrap: "wrap",
    fontSize: 15,
    marginLeft: 15,
    marginRight: 15,
    fontWeight: "400",
    // backgroundColor: "green",
  },
});
