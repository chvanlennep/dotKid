import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


import colors from '../config/colors'
import PCalcScreen from '../components/PCalcScreen'
import AppText from '../components/AppText'
import InputButton from '../components/buttons/InputButton'
import Button from '../components/buttons/Button'
import DOBButton from '../components/buttons/DOBButton'

const PaedsHomepageScreen = () => {
    return (
        <PCalcScreen>
        <View style={styles.topContainer}>
        <DOBButton/>
        <InputButton name="all-inclusive">Sex</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <AppText style={styles.text}> Paediatric </AppText>
        <Button> Blood Pressure Calculator </Button>
        <Button> Body Surface Area Calculator </Button>
        <Button> Centile Calculator </Button>
        <Button> ECG Calculator </Button>
        <Button> IV Fluid Calculator </Button>
        <Button> WETFLAG </Button>
        </View>
        </PCalcScreen>
    )
}

export default PaedsHomepageScreen

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
