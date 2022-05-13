import React from 'react';
import {
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import Screen from './Screen';
import TopIcon from './TopIcon';
import colors from '../config/colors';
import routes from '../navigation/routes';

const TopBarCalc = ({
  children,
  style,
  isHomePage,
  isResus,
  isResults,
  kind,
}) => {
  const scheme = useColorScheme();
  const navigation = useNavigation();
  const child = kind === 'child' ? true : false;

  const renderBack = isHomePage ? false : true;
  const middleIcon = child ? 'face-man' : 'baby-face-outline';
  const sideIcon = child ? 'baby-face-outline' : 'face-man';
  const homeCalcPage = child ? routes.PAEDS_START : routes.NEONATE_START;
  const opposite = child
    ? {root: 'RootN', home: 'NeonateHomePage'}
    : {root: 'RootPaed', home: 'PaedsHomePage'};
  const iconColor = child ? colors.primary : colors.secondary;

  const androidBackHandler = () => {
    switch (true) {
      case isResults:
        navigation.goBack();
        break;
      case isHomePage:
        if (kind === 'child') {
          Alert.alert('Are you sure want to quit the app?', '', [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'Yes', onPress: () => BackHandler.exitApp()},
          ]);
        } else {
          navigation.navigate(routes.PAEDS_START);
        }
        break;
      default:
        navigation.navigate(homeCalcPage);
    }
    return true;
  };

  const backPressHandler = () => {
    if (isResus) {
      navigation.goBack();
    } else {
      isResults ? navigation.goBack() : navigation.navigate(homeCalcPage);
    }
  };

  useFocusEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', androidBackHandler);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          androidBackHandler,
        );
    }
  });

  return (
    <Screen
      style={[
        styles.container,
        {backgroundColor: scheme === 'dark' ? colors.black : colors.white},
      ]}>
      <View style={styles.addMargin}>
        {renderBack && (
          <View style={styles.back}>
            <TopIcon
              name="chevron-left"
              height={35}
              width={35}
              iconColor={iconColor}
              onPress={backPressHandler}
            />
          </View>
        )}
        <View style={styles.topContainer}>
          <TopIcon
            name={middleIcon}
            height={50}
            width={50}
            iconColor={iconColor}
            onPress={() => (isResus ? null : navigation.navigate(homeCalcPage))}
            style={styles.face}
          />
        </View>
        <View style={styles.side}>
          <TopIcon
            name={sideIcon}
            height={35}
            width={35}
            iconColor={colors.medium}
            onPress={() =>
              isResus
                ? backPressHandler()
                : navigation.navigate(opposite.root, {screen: opposite.home})
            }
          />
        </View>
      </View>
      <View style={style}>{children}</View>
    </Screen>
  );
};

export default TopBarCalc;

const styles = StyleSheet.create({
  side: {
    position: 'absolute',
    right: 30,
    top: Platform.OS === 'android' ? 20 : 15,
  },
  back: {
    position: 'absolute',
    left: 30,
    top: Platform.OS === 'android' ? 20 : 15,
  },
  container: {
    flex: 1,
  },
  addMargin: {
    marginBottom: 5,
  },
  topContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 8 : 0,
  },
});
