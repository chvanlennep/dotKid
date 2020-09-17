import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


import colors from '../config/colors'
import PCalcScreen from '../components/PCalcScreen'
import AppText from '../components/AppText'
import InputButton from '../components/buttons/InputButton'
import Button from '../components/buttons/Button'
import DOBButton from '../components/buttons/DOBButton'
import routes from '../navigation/routes'


const PaedsHomepageScreen = ({ navigation }) => {
    return (
        <PCalcScreen>
        <View style={styles.topContainer}>
        <DOBButton/>
        <InputButton name="all-inclusive">Sex</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <AppText style={styles.text}> Paediatric </AppText>
        <Button onPress={() => navigation.navigate(routes.BLOOD_PRESSURE)}> Blood Pressure Calculator </Button>
        <Button onPress={() => navigation.navigate(routes.BODY_SURFACE_AREA)}> Body Surface Area Calculator </Button>
        <Button onPress={() => navigation.navigate(routes.PAEDIATRIC_CENTILE)}> Centile Calculator </Button>
        <Button onPress={() => navigation.navigate(routes.ECG)}> ECG Calculator </Button>
        <Button onPress={() => navigation.navigate(routes.FLUID_CALCULATOR)}> IV Fluid Calculator </Button>
        <Button onPress={() => navigation.navigate(routes.WETFLAG)}> WETFLAG </Button>
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
