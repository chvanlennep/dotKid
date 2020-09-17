import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import NCalcScreen from '../components/NCalcScreen'
import DOBButton from '../components/buttons/DOBButton'
import InputButton from '../components/buttons/InputButton'
import AppText from '../components/AppText'
import colors from '../config/colors'
import SmallButton from '../components/buttons/SmallButton'




const JaundiceScreen = () => {
    return (
        <NCalcScreen>
        <ScrollView>
        <View style={styles.topContainer}>
        <DOBButton></DOBButton>
        <InputButton name="clock-outline">Time of Birth</InputButton>
        <InputButton name="human-pregnant">Birth Gestation</InputButton>
        <InputButton name="water">Serum Bilirubin</InputButton>
        <InputButton name="av-timer">Time of Sample</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <View style={styles.outputContainer}>
        <View style={styles.title}>
        <AppText style={styles.text}>Jaundice Treatment: </AppText>
        </View>
        <View style={styles.buttons}>
        <SmallButton name="information-outline" />
        <SmallButton name="chart-line" />
        </View>
        </View>
        </View>    
        </ScrollView>
        </NCalcScreen>
    )
}

export default JaundiceScreen

const styles = StyleSheet.create({
    bottomContainer: {
        alignSelf: "center",
        paddingHorizontal: 50,
        marginTop: 20,
        width: "100%",
        marginBottom: 75
    },
    buttons: {
        //backgroundColor: "dodgerblue",
        flexDirection: "row",
        width: 96,
        justifyContent: "space-between",
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
        width: 150

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
