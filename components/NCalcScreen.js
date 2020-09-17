import React, { Children } from 'react'
import { StyleSheet, View } from 'react-native'

import Screen from './Screen'
import TopIcon from './TopIcon'
import colors from '../config/colors'

const NCalcScreen = ({children, style}) => {
    return (

        <Screen style={styles.container}>
        <View style={styles.topContainer}>
        <TopIcon name="baby-face-outline" 
        height={50} 
        width={50} 
        borderRadius={20} 
        backgroundColor={colors.white} 
        iconColor={colors.secondary} 
        style={styles.face}
        onPress={() => navigation.navigate("NeonateHomepage")}/>
        </View>
        <View style={styles.face}>
        <TopIcon name="face" height={40} width={40} backgroundColor={colors.white} iconColor={colors.medium}  />
        </View>
        <View style={style}>{children}</View>
        </Screen>

    )
}

export default NCalcScreen

const styles = StyleSheet.create({
    face: {
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
