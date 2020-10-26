import React from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import { useFormikContext } from 'formik';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import colors from '../../config/colors';

const FormSubmitTickButton = (setModalVisible) => {
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const { handleSubmit } = useFormikContext();
  return (
    <View style={styles.acceptIcon}>
      <TouchableOpacity onPress={handleSubmit}>
        <MaterialCommunityIcons
          name="check-circle"
          color={dark ? colors.white : colors.black}
          size={40}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FormSubmitTickButton;

const styles = StyleSheet.create({
  acceptIcon: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'red',
    paddingLeft: 10,
  },
});
