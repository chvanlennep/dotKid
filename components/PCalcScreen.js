import React, { Children } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Screen from './Screen'
import TopIcon from './TopIcon'
import colors from '../config/colors'

const PCalcScreen = ({children, style}) => {
    return (

        <Screen style={styles.container}>
        <View style={styles.topContainer}>
        <TopIcon name="face" height={50} width={50} borderRadius={20} backgroundColor={colors.white} iconColor={colors.primary} style={styles.face}/>
        </View>
        <View style={styles.baby}>
        <TopIcon name="baby-face-outline" height={40} width={40} backgroundColor={colors.white} iconColor={colors.medium}  />
        </View>
        <View style={style}>{children}</View>
        </Screen>

    )
}

export default PCalcScreen

const styles = StyleSheet.create({
    baby: {
        position: "absolute",
        right: 30,
        top: 10          

    },
    container: {
        flex: 1,

        
    },

    topContainer: {

        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center"
    }
})
