import React, {FC} from 'react';
import {Text, useColorScheme, TextProps} from 'react-native';

import defaultStyles from '../config/styles';
import colors from '../config/colors';

const AppText: FC<TextProps> = ({children, style, ...props}) => {
  const scheme = useColorScheme();
  const colorStyle = {color: scheme === 'dark' ? colors.white : colors.black};
  return (
    <Text {...props} style={[defaultStyles.text, colorStyle, style]}>
      {children}
    </Text>
  );
};

export default AppText;
