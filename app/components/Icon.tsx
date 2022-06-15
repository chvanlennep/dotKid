/* eslint-disable react-native/no-inline-styles */
import React, {FC} from 'react';
import {View} from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type IconType = {
  backgroundColor: string;
  borderRadius: number;
  height: number;
  iconColor: string;
  name: string;
  width: number;
  padding: number;
  margin: number;
};

const Icon: FC<IconType> = ({
  backgroundColor = 'orange',
  borderRadius,
  height,
  iconColor = '#fff',
  name,
  width,
  padding,
  margin = 0,
}) => {
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
};

export default Icon;
