import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import NCalcScreen from '../components/NCalcScreen'
import colors from '../config/colors'
import Button from '../components/buttons/Button'
import InputButton from '../components/buttons/InputButton'
import DOBButton from '../components/buttons/DOBButton'
import AppText from '../components/AppText'


const NeonateHomepageScreen = () => {
    return (
        <NCalcScreen>
        <View style={styles.topContainer}>
        <DOBButton/>
        <InputButton name="all-inclusive">Sex</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <AppText style={styles.text}> Neonate </AppText>
        <Button> Birth Centile Calculator </Button>
        <Button> Centile Calculator </Button>
        <Button> Endotracheal Tube Length Calculator </Button>
        <Button> Enteral Feed Calculator </Button>
        <Button> Jaundice Calculator </Button>
        </View>
        </NCalcScreen>
    )
}

export default NeonateHomepageScreen

const styles = StyleSheet.create({
    
    bottomContainer: {
        padding: 20,
        marginTop: 20
    },
     topContainer: {
 
         alignSelf: "center",
         alignItems: "center"
     },
     text: {
         fontSize: 28,
         color: colors.black,
         marginBottom: 5
     }
})
