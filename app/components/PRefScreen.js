import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import AppText from './AppText'
import PCalcScreen from './PCalcScreen'
import { colors } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler'



const PRefScreen = () => {
    return (
        <PCalcScreen>
        <ScrollView style={styles.container}>
        <AppText style={styles.title}>References</AppText>
        <AppText style={styles.text}>These APLS Guidelines were written in line with the Resus Council Advanced Life Support Algorithm </AppText>
        </ScrollView>
        </PCalcScreen>
    )
}

export default PRefScreen

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    text: {
        color: colors.black,
        fontSize: 17,
        paddingTop: 10,
    },
    title: {
        fontSize: 28,
        color: colors.black,
    }
})
