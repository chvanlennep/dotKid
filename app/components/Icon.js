import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

function Icon({
  backgroundColor = 'orange',
  borderRadius,
  height,
  iconColor = '#fff',
  name,
  width,
  padding,
  margin = 0,
}) {
  return (
    <View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor,
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        margin,
      }}>
      <MaterialCommunityIcons
        name={name}
        color={iconColor}
        size={20}
        iconStyle={{margin: 0}}
      />
    </View>
  );
}

export default Icon;
