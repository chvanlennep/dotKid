import React from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import colors from '../../config/colors'
import AppText from '../AppText'


const ALSDisplayButton = ({ children, style, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
        <View style={[ styles.button, style ]}> 
        <AppText style={{color: colors.white}}>{children}</AppText>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default ALSDisplayButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.light,
        borderRadius: 5,
        color: colors.white,
        flexDirection: "row",
        height: 57,
        justifyContent: "center",
        margin: 5, 
        padding: 10,
        width: "100%",
        
    },

})
