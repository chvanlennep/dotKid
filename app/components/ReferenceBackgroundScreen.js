import React, {useEffect} from 'react';
import {Alert, StyleSheet, View, useColorScheme} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Screen from './Screen';
import TopIcon from './TopIcon';
import colors from '../config/colors';
import routes from '../navigation/routes';
import {aplsStore} from '../brains/stateManagement/aplsState.store';

const ReferenceBackgroundScreen = ({
  children,
  style,
  isHomePage = true,
  isResus = false,
}) => {
  const scheme = useColorScheme();

  const navigation = useNavigation();
  let renderBack;
  if (!isHomePage) {
    renderBack = true;
  }

  const handleBackPress = e => {
    Alert.alert(
      'Are you sure you want a different resuscitation screen?',
      'This will reset your current resuscitation encounter',
      [
        {
          text: 'Yes',
          onPress: () => navigation.dispatch(e.data.action),
        },
        {
          text: 'Cancel',
          onPress: () => 'Cancel',
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (aplsStore.timerIsRunning) {
        e.preventDefault();
        handleBackPress(e);
      }
    });
  }, []);

  return (
    <Screen
      style={[
        styles.container,
        {backgroundColor: scheme === 'dark' ? colors.black : colors.white},
      ]}>
      {renderBack && (
        <View style={styles.back}>
          <TopIcon
            name="chevron-left"
            height={40}
            width={40}
            iconColor={colors.black}
            onPress={handleBackPress}
          />
        </View>
      )}
      <View style={styles.topContainer}>
        <TopIcon
          name="face-man"
          height={50}
          width={50}
          iconColor={colors.primary}
          onPress={() =>
            isResus ? null : navigation.navigate(routes.PAEDS_HOMEPAGE)
          }
          style={styles.face}
        />
        <TopIcon
          name="baby-face-outline"
          height={50}
          width={50}
          iconColor={colors.secondary}
          onPress={() =>
            isResus
              ? navigation.navigate(routes.NLS)
              : navigation.navigate(routes.NEONATE_HOMEPAGE)
          }
        />
      </View>

      <View style={style}>{children}</View>
    </Screen>
  );
};

export default ReferenceBackgroundScreen;

const styles = StyleSheet.create({
  baby: {
    position: 'absolute',
    right: 120,
    top: 2,
  },
  back: {
    position: 'absolute',
    left: 30,
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
