import React, {FC} from 'react';
import {View, ViewStyle} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../config/colors';

interface IconStyle extends ViewStyle {
  name: string;
  iconColor?: string;
}

const Icon: FC<IconStyle> = ({
  backgroundColor = 'transparent',
  borderRadius,
  height = 20,
  iconColor = colors.white,
  margin = 10,
  marginBottom,
  marginRight = 15,
  marginTop = 12,
  name,
  width = 20,
}) => {
  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
        margin: margin,
        marginBottom: marginBottom,
        marginRight: marginRight,
        marginTop: marginTop,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <MaterialCommunityIcons name={name} color={iconColor} size={height} />
    </View>
  );
};

export default Icon;
