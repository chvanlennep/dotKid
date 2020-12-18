import {Platform, Dimensions} from 'react-native';

import colors from './colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default {
  windowWidth,
  windowHeight,
  colors,
  text: {
    fontSize: windowWidth < 375 ? 16 : 18,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  container: {
    width: windowWidth - 10,
  },
};
