import React, {FC} from 'react';
import {TouchableWithoutFeedback, View, ViewStyle} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface TopIconStyle extends ViewStyle {
  iconColor: string;
  name: string;
  onPress: () => void;
}

const TopIcon: FC<TopIconStyle> = ({
  backgroundColor,
  borderRadius,
  height,
  iconColor = '#fff',
  name,
  onPress,
  width,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          width,
          height,
          borderRadius,
          backgroundColor,
          padding: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <MaterialCommunityIcons name={name} color={iconColor} size={width} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TopIcon;
