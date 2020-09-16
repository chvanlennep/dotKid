import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppText from '../AppText'
import colors from '../../config/colors'

const ALSToolButton = ({ name }) => {
    return (
        <View style={styles.container}>
            <AppText>{name}</AppText>
        </View>
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
