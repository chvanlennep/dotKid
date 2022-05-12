import React, {FC} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type ScreenStyle = {
  style: ViewStyle;
};

const Screen: FC<ScreenStyle> = ({children, style}) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[{paddingTop: insets.top}, styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});

export default Screen;
