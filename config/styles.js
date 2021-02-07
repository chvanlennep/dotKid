import {Platform, Dimensions} from 'react-native';

import colors from './colors';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const containerWidth = windowWidth - 10;

const defaultStyles = {
  windowWidth,
  windowHeight,
  colors,
  text: {
    fontSize: windowWidth < 375 ? 16 : 18,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  container: {
    width: containerWidth,
  },
};

export default defaultStyles;

export {containerWidth, windowWidth, windowHeight};
