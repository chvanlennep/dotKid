import React, { Children } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Screen from "./Screen";
import TopIcon from "./TopIcon";
import colors from "../config/colors";
import routes from "../navigation/routes";

const NCalcScreen = ({ children, style, isHomePage = false }) => {
  const navigation = useNavigation();
  const scheme = useColorScheme();

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
            height={40}
            width={40}
            backgroundColor={scheme === "dark" ? colors.black : colors.white}
            iconColor={colors.secondary}
            onPress={() => navigation.goBack()}
          />
        </View>
      )}
      <View style={styles.topContainer}>
        <TopIcon
          name="baby-face-outline"
          height={50}
          width={50}
          borderRadius={20}
          backgroundColor={scheme === "dark" ? colors.black : colors.white}
          iconColor={colors.secondary}
          style={styles.face}
          onPress={() => navigation.navigate(routes.NEONATE_HOMEPAGE)}
        />
      </View>
      <View style={styles.face}>
        <TopIcon
          name="face"
          height={40}
          width={40}
          backgroundColor={scheme === "dark" ? colors.black : colors.white}
          iconColor={colors.medium}
          onPress={() => navigation.navigate(routes.PAEDS_HOMEPAGE)}
        />
      </View>
      <View style={style}>{children}</View>
    </Screen>
  );
};

export default NCalcScreen;

const styles = StyleSheet.create({
  back: {
    position: "absolute",
    left: 30,
    top: 10,
  },
  face: {
    position: "absolute",
    right: 30,
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
