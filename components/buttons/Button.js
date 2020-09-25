import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import colors from '../../config/colors'
import AppText from '../AppText'

const InputButton = ({ children, style, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
        <View style={[ styles.button, style ]}> 
        <AppText>{children}</AppText>
        </View>
        </TouchableOpacity>
    )
}

export default InputButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.medium,
        borderRadius: 5,
        color: colors.white,
        flexDirection: "row",
        height: 57,
        margin: 5, 
        padding: 10,
        width: "98%",
        
    },

})
