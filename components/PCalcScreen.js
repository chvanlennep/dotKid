import React, { Children } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import Screen from './Screen'
import TopIcon from './TopIcon'
import colors from '../config/colors'
import routes from '../navigation/routes'


const PCalcScreen = ({children, style}) => {
    const navigation = useNavigation();
    return (

        <Screen style={styles.container}>
        <View style={styles.topContainer}>
        <TopIcon 
        name="face" 
        height={50} 
        width={50} 
        borderRadius={20} 
        backgroundColor={colors.white} 
        iconColor={colors.primary} 
        onPress={() => navigation.navigate(routes.PAEDS_HOMEPAGE)}
        style={styles.face}/>
        </View>
        <View style={styles.baby}>
        <TopIcon name="baby-face-outline" 
        height={40} 
        width={40} 
        backgroundColor={colors.white} 
        iconColor={colors.medium}
        onPress={() => navigation.navigate(routes.NEONATE_HOMEPAGE)}  />
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
        alignItems: "center",
        marginBottom: 15
    }
})
