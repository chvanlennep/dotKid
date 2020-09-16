import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import AppText from '../components/AppText'
import PCalcScreen from '../components/PCalcScreen'
import InputButton from '../components/buttons/InputButton'
import colors from '../config/colors'
import DOBButton from '../components/buttons/DOBButton'


const FluidCalculatorScreen = () => {
    return (
        <PCalcScreen>
        <View style={styles.topContainer}>
        <DOBButton></DOBButton>
        <InputButton name="all-inclusive">Sex</InputButton>
        <InputButton name="chart-bar">Weight</InputButton>
        <InputButton name="triangle-outline">Correction Factor</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <AppText style={styles.text}> IV Fluid Requirements: </AppText>
        </View>
        </PCalcScreen>

    )
}

export default FluidCalculatorScreen

const styles = StyleSheet.create({
    bottomContainer: {
        paddingLeft: 50,
        marginTop: 20
    },
    text: {
        color: colors.black,
        fontSize: 17
    },
    topContainer: {

        alignSelf: "center",
        alignItems: "center"
    },
})
