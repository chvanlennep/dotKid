import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import colors from '../../config/colors'
import AppText from '../AppText'

const InputButton = ({ children, style }) => {
    return (
        <View style={[ styles.button, style ]}> 
        <AppText>{children}</AppText>
        </View>
    )
}

export default InputButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.light,
        borderRadius: 5,
        color: colors.white,
        flexDirection: "row",
        height: 57,
        margin: 5, 
        padding: 10,
        width: "100%",
        
    },

})
