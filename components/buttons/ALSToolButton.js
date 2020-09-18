import React from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import AppText from '../AppText'
import colors from '../../config/colors'

const ALSToolButton = ({ name, onPress }) => {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
        <AppText>{name}</AppText>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default ALSToolButton

const styles = StyleSheet.create({

    container: {
        backgroundColor: colors.medium,
        height: 57,
        width: "25%",
        alignItems: "center",
        justifyContent: "center"
    }
})
