import React from 'react'
import { Modal, FlatList, StyleSheet, Text, View } from 'react-native'


import PCalcScreen from '../components/PCalcScreen'
import ALSToolbar from '../components/ALSToolbar'
import Button from '../components/buttons/Button'
import colors from '../config/colors'
import AppText from '../components/AppText'
import { ScrollView } from 'react-native-gesture-handler'
import ALSDisplayButton from '../components/buttons/ALSDisplayButton'
import ALSFunctionButton from '../components/buttons/ALSFunctionButton'
import Stopwatch from '../components/Stopwatch'
import LogScreen from './APLSLogScreen'
import routes from '../navigation/routes'



const APLSScreen = ({ navigation }) => {

    return (
        <PCalcScreen>
        <ALSToolbar/>
        <View style={styles.container}>
        <ALSDisplayButton style={styles.button}><Stopwatch/></ALSDisplayButton>
        <ALSDisplayButton style={styles.button}>Adrenaline</ALSDisplayButton>
        <ALSDisplayButton style={styles.button}>Analyse Rhythm</ALSDisplayButton>
        <ALSDisplayButton 
        style={styles.button}
        onPress={() => navigation.navigate(routes.APLS_LOG)}>Log</ALSDisplayButton>
        </View>
        <ScrollView style={styles.bottomContainer}>
        <AppText style={styles.text}> APLS </AppText>
        <ALSFunctionButton style={styles.mediumButton}>Confirm Cardiac Arrest</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Call For Help</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Assign Team Roles</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Initiate CPR 15:2</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Bag-Mask Ventilation</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Get Cardiac Arrest Trolley</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Attach Defibrillator</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Gain Vascular Access</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Take Bloods & Blood Gas</ALSFunctionButton>
        <ALSDisplayButton style={styles.darkButton}>Exclude The Following Hs & Ts:</ALSDisplayButton>
        <ALSFunctionButton style={styles.mediumButton}>Hypoxia</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Hypovolaemia</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Hypothermia</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Hyper/Hypokalaemia</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Tension Pneumothorax</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Cardiac Tamponade</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Toxins</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Thrombosis</ALSFunctionButton>
        <ALSDisplayButton style={styles.darkButton}>Additional Drugs & Procedures:</ALSDisplayButton>
        <ALSFunctionButton style={styles.mediumButton}>Patient Intubated</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Automatic Compression Device</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Tension Decompressed</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Calcium Given</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Insulin-Dextrose Given</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Salbutamol IV Given</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Blood Transfusion Started</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Tranexamic Acid Given</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Thrombolysis Given</ALSFunctionButton>
        <ALSFunctionButton style={styles.mediumButton}>Sodium Bicarbonate Given</ALSFunctionButton>
        <ALSFunctionButton style={styles.bottomButton}>IV Magnesium Given</ALSFunctionButton>

        </ScrollView>
        </PCalcScreen>
    )
}

export default APLSScreen

const styles = StyleSheet.create({
    bottomButton: {
        backgroundColor: colors.medium,
        marginBottom: 200
    },
    bottomContainer: {
        padding: 20,
        marginBottom: 100,
        // Need to center content but getting an error message

    },
    button: {
        backgroundColor: colors.dark,
        justifyContent: 'center',
        width: '44%',
    },
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        paddingTop: 10,
        width: "100%",
    },
    darkButton: {
        backgroundColor: colors.dark
    },
    mediumButton: {
        backgroundColor: colors.medium
    },
    text: {
        color: colors.black,
        fontSize: 28
    },
    
})
