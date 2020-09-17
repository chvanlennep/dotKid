import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import PCalcScreen from '../components/PCalcScreen'
import DOBButton from '../components/buttons/DOBButton'
import InputButton from '../components/buttons/InputButton'
import AppText from '../components/AppText'
import colors from '../config/colors'





const ECGScreen = () => {
    return (
        <PCalcScreen>
        <ScrollView>
        <View style={styles.topContainer}>
        <DOBButton></DOBButton>
        <InputButton name="all-inclusive">Sex</InputButton>
        <InputButton name="heart-flash">QT Interval</InputButton>
        <InputButton name="heart-pulse">R-R Interval</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <View style={styles.outputContainer}>
        <View style={styles.title}>
        <AppText style={styles.text}>QTc Interval: </AppText>

        </View>
        <View style={styles.output}>
        <AppText style={styles.outputText}>           
        Output here</AppText>
        </View>
        </View>
        <View style={styles.outputContainer}>
        <View style={styles.title}>
        <AppText style={styles.text}>ECG Normal Ranges: </AppText>
        </View>
        <View style={styles.output}>
        <AppText style={styles.outputText}>
        Output here </AppText>
        </View>
        </View>
        </View>    
        </ScrollView>
        </PCalcScreen>
    )
}

export default ECGScreen

const styles = StyleSheet.create({
    bottomContainer: {
        alignSelf: "center",
        paddingHorizontal: 50,
        marginTop: 20,
        width: "100%",
        marginBottom: 75
    },
 
    outputContainer: {
        //backgroundColor: "orangered",
        alignSelf: "center",
        flexDirection: "row",
        flex: 2,
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 10,
        width: "100%"

    },
    outputText: {
        //backgroundColor: "limegreen",
        color: colors.black,
        fontSize: 15,
        marginBottom: 40,
       
        
    },
    title: {
        alignContent: "center"
,       //backgroundColor: "goldenrod",
        flexGrow: 2,
        justifyContent: "center",
        width: 250

    },
    text: {
        color: colors.black,
        fontSize: 17,
    },
    topContainer: {
        
        alignSelf: "center",
        alignItems: "center"
    },
    })
