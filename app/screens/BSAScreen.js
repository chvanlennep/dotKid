import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import PCalcScreen from '../components/PCalcScreen'
import DOBButton from '../components/buttons/DOBButton'
import AppText from '../components/AppText'
import colors from '../config/colors'
import InputButton from '../components/buttons/InputButton'




const BSAScreen = () => {
    return (
        <PCalcScreen>
        <ScrollView>
        <View style={styles.topContainer}>
        <InputButton name="chart-bar">Weight</InputButton>
        </View>
        <View style={styles.bottomContainer}>
        <View style={styles.outputContainer}>
        <View style={styles.title}>
        <AppText style={styles.text}>Estimated Body Surface Area: </AppText>

        </View>
        <View style={styles.output}>
        <AppText style={styles.outputText}>           
        Output here</AppText>
        </View>
        </View>
        
        </View>    
        </ScrollView>
        </PCalcScreen>
    )
}

export default BSAScreen

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
