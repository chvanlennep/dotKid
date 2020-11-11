import { Platform, Dimensions } from 'react-native';

import colors from './colors';

const windowWidth = Dimensions.get('window').width;

export default {
  windowWidth,
  colors,
  text: {
    fontSize: windowWidth < 375 ? 16 : 18,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  container: {
    width: windowWidth - 10,
  },
};
