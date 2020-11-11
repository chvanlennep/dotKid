import React from 'react';
import { Alert, StyleSheet, useColorScheme, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Screen from './Screen';
import TopIcon from './TopIcon';
import colors from '../config/colors';
import routes from '../navigation/routes';

const NCalcScreen = ({
  children,
  style,
  isHomePage = false,
  isResus = false,
}) => {
  const navigation = useNavigation();
  const scheme = useColorScheme();

  let renderBack;
  if (!isHomePage) renderBack = true;

  const handleBackPress = () => {
    if (isResus) {
      Alert.alert(
        'Do you sure you want a different resuscitation screen?',
        'This will reset your current resuscitation encounter',
        [
          {
            text: 'Yes',
            onPress: () => navigation.goBack(),
          },
          {
            text: 'Cancel',
            onPress: () => 'Cancel',
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <Screen
      style={[
        styles.container,
        { backgroundColor: scheme === 'dark' ? colors.black : colors.white },
      ]}
    >
      {renderBack && (
        <View style={styles.back}>
          <TopIcon
            name="chevron-left"
            height={40}
            width={40}
            iconColor={colors.secondary}
            onPress={handleBackPress}
          />
        </View>
      )}
      <View style={styles.topContainer}>
        <TopIcon
          name="baby-face-outline"
          height={50}
          width={50}
          iconColor={colors.secondary}
          style={styles.face}
          onPress={() =>
            isResus ? null : navigation.navigate(routes.PAEDS_HOMEPAGE)
          }
        />
      </View>
      <View style={styles.face}>
        <TopIcon
          name="face"
          height={40}
          width={40}
          iconColor={colors.medium}
          onPress={() =>
            isResus
              ? navigation.navigate(routes.APLS)
              : navigation.navigate(routes.PAEDS_HOMEPAGE)
          }
        />
      </View>
      <View style={style}>{children}</View>
    </Screen>
  );
};

export default NCalcScreen;

const styles = StyleSheet.create({
  back: {
    position: 'absolute',
    left: 30,
    top: 10,
  },
  face: {
    position: 'absolute',
    right: 30,
    top: 10,
  },
  container: {
    flex: 1,
  },
  topContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
});
