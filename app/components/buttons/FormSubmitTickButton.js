import React, {useEffect} from 'react';
import {StyleSheet, View, useColorScheme, TouchableOpacity} from 'react-native';
import {useFormikContext} from 'formik';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import useCombined from '../../brains/useCombined';
import colors from '../../config/colors';
import {checkDefault} from '../../brains/oddBits';

const FormSubmitTickButton = ({initialValues, values}) => {
  const scheme = useColorScheme();
  const dark = scheme === 'dark' ? true : false;
  const {handleSubmit} = useFormikContext();
  const {combinedReset} = useCombined('neonate', 'weight');
  useEffect(() => {
    if (checkDefault(values)) {
      combinedReset(initialValues);
    }
  }, []);
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
