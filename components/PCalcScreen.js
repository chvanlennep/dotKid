import React from "react";
import { StyleSheet, View, useColorScheme } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Screen from "./Screen";
import TopIcon from "./TopIcon";
import colors from "../config/colors";
import routes from "../navigation/routes";

const PCalcScreen = ({ children, style, isHomePage = false }) => {
  const scheme = useColorScheme();

  const navigation = useNavigation();
  let renderBack;
  if (!isHomePage) renderBack = true;

  return (
    <Screen
      style={[
        styles.container,
        { backgroundColor: scheme === "dark" ? colors.black : colors.white },
      ]}
    >
      {renderBack && (
        <View style={styles.back}>
          <TopIcon
            name="chevron-left"
            backgroundColor={scheme === "dark" ? colors.black : colors.white}
            height={40}
            width={40}
            iconColor={colors.primary}
            onPress={() => navigation.goBack()}
          />
        </View>
      )}
      <View style={styles.topContainer}>
        <TopIcon
          name="face"
          height={50}
          width={50}
          borderRadius={20}
          backgroundColor={scheme === "dark" ? colors.black : colors.white}
          iconColor={colors.primary}
          onPress={() => navigation.navigate(routes.PAEDS_HOMEPAGE)}
          style={styles.face}
        />
      </View>
      <View style={styles.baby}>
        <TopIcon
          name="baby-face-outline"
          height={40}
          width={40}
          backgroundColor={scheme === "dark" ? colors.black : colors.white}
          iconColor={colors.medium}
          onPress={() => navigation.navigate(routes.NEONATE_HOMEPAGE)}
        />
      </View>
      <View style={style}>{children}</View>
    </Screen>
  );
};

export default PCalcScreen;

const styles = StyleSheet.create({
  baby: {
    position: "absolute",
    right: 30,
    top: 10,
  },
  back: {
    position: "absolute",
    left: 30,
    top: 10,
  },
  container: {
    flex: 1,
  },

  topContainer: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
});
