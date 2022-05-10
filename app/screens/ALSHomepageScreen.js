import React from 'react';
import {
  StyleSheet,
  TouchableHighlight,
  useColorScheme,
  View,
} from 'react-native';

import TopIcon from '../components/TopIcon';
import colors from '../config/colors';
import AppText from '../components/AppText';
import routes from '../navigation/routes';

const ALSHomepageScreen = ({navigation}) => {
  const scheme = useColorScheme();
  return (
    <View style={styles.pageContainer}>
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor={colors.primary}
        style={[
          styles.apls,
          {backgroundColor: scheme === 'dark' ? colors.black : colors.white},
        ]}
        onPress={() => navigation.navigate(routes.APLS)}>
        <View style={styles.container}>
          <TopIcon
            name="face-man"
            height={50}
            width={50}
            borderRadius={20}
            backgroundColor={{
              backgroundColor: scheme === 'dark' ? colors.black : colors.white,
            }}
            iconColor={colors.primary}
            style={styles.face}
          />
          <AppText style={styles.text}> APLS </AppText>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor={colors.secondary}
        style={[
          styles.nls,
          {backgroundColor: scheme === 'dark' ? colors.black : colors.white},
        ]}
        onPress={() => navigation.navigate(routes.NLS)}>
        <View style={styles.container}>
          <TopIcon
            name="baby-face-outline"
            height={50}
            width={50}
            borderRadius={20}
            backgroundColor={{
              backgroundColor: scheme === 'dark' ? colors.black : colors.white,
            }}
            iconColor={colors.secondary}
            style={styles.face}
          />
          <AppText style={styles.text}> NLS </AppText>
        </View>
      </TouchableHighlight>
    </View>
  );
};

export default ALSHomepageScreen;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageContainer: {
    //backgroundColor: 'green',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apls: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: colors.dark,
    color: colors.white,
    flexDirection: 'row',
    height: '30%',
    margin: 10,
    padding: 10,
    width: '90%',
  },
  nls: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 5,
    borderColor: colors.dark,
    color: colors.white,
    flexDirection: 'row',
    height: '30%',
    margin: 10,
    padding: 10,
    width: '90%',
  },
  text: {
    fontSize: 28,
    marginBottom: 5,
    marginLeft: 10,
  },
});
