import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


import PCalcScreen from '../components/PCalcScreen'
import ALSToolbar from '../components/ALSToolbar'
import Button from '../components/buttons/Button'
import colors from '../config/colors'
import AppText from '../components/AppText'
import { ScrollView } from 'react-native-gesture-handler'

const APLSScreen = () => {
    return (
        <PCalcScreen>
        <ALSToolbar/>
        <View style={styles.container}>
        <Button style={styles.button}>00:00</Button>
        <Button style={styles.button}>Adrenaline</Button>
        <Button style={styles.button}>Analyse Rhythm</Button>
        <Button style={styles.button}>Log</Button>
        </View>
        <ScrollView style={styles.bottomContainer}>
        <AppText style={styles.text}> APLS </AppText>
        <Button style={styles.mediumButton}>Confirm Cardiac Arrest</Button>
        <Button style={styles.mediumButton}>Call For Help</Button>
        <Button style={styles.mediumButton}>Assign Team Roles</Button>
        <Button style={styles.mediumButton}>Initiate CPR 15:2</Button>
        <Button style={styles.mediumButton}>Bag-Mask Ventilation</Button>
        <Button style={styles.mediumButton}>Get Cardiac Arrest Trolley</Button>
        <Button style={styles.mediumButton}>Attach Defibrillator</Button>
        <Button style={styles.mediumButton}>Gain Vascular Access</Button>
        <Button style={styles.mediumButton}>Take Bloods & Blood Gas</Button>
        <Button style={styles.darkButton}>Exclude The Following Hs & Ts:</Button>
        <Button style={styles.mediumButton}>Hypoxia</Button>
        <Button style={styles.mediumButton}>Hypovolaemia</Button>
        <Button style={styles.mediumButton}>Hypothermia</Button>
        <Button style={styles.mediumButton}>Hyper/Hypokalaemia</Button>
        <Button style={styles.mediumButton}>Tension Pneumothorax</Button>
        <Button style={styles.mediumButton}>Cardiac Tamponade</Button>
        <Button style={styles.mediumButton}>Toxins</Button>
        <Button style={styles.mediumButton}>Thrombosis</Button>
        <Button style={styles.darkButton}>Additional Drugs & Procedures:</Button>
        <Button style={styles.mediumButton}>Patient Intubated</Button>
        <Button style={styles.mediumButton}>Automatic Compression Device</Button>
        <Button style={styles.mediumButton}>Tension Decompressed</Button>
        <Button style={styles.mediumButton}>Calcium Given</Button>
        <Button style={styles.mediumButton}>Insulin-Dextrose Given</Button>
        <Button style={styles.mediumButton}>Salbutamol IV Given</Button>
        <Button style={styles.mediumButton}>Blood Transfusion Started</Button>
        <Button style={styles.mediumButton}>Tranexamic Acid Given</Button>
        <Button style={styles.mediumButton}>Thrombolysis Given</Button>
        <Button style={styles.mediumButton}>Sodium Bicarbonate Given</Button>
        <Button style={styles.bottomButton}>IV Magnesium Given</Button>

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
