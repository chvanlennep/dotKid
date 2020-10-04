import React, { useState, useReducer } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'


import PCalcScreen from '../components/PCalcScreen'
import ALSToolbar from '../components/ALSToolbar'
import Button from '../components/buttons/Button'
import colors from '../config/colors'
import AppText from '../components/AppText'
import { ScrollView } from 'react-native-gesture-handler'
import ALSDisplayButton from '../components/buttons/ALSDisplayButton'
import ALSFunctionButton from '../components/buttons/ALSFunctionButton'
import Stopwatch from '../components/Stopwatch'
import routes from '../navigation/routes'


let primaryButtons = [
{ id: "Confirm Cardiac Arrest",
isButtonPressed: false,
time: null},
{ id: "Call For Help",
isButtonPressed: false,
time: null},
{ id: "Assign Team Roles",
isButtonPressed: false,
time: null},
{ id: "Initiate CPR 15:2",
isButtonPressed: false,
time: null},
{ id: "Bag-Mask Ventilation",
isButtonPressed: false,
time: null},
{ id: "Get Cardiac Arrest Trolley",
isButtonPressed: false,
time: null},
{ id: "Attach Defibrillator",
isButtonPressed: false,
time: null},
{ id: "Gain Vascular Access",
isButtonPressed: false,
time: null},
{ id: "Take Bloods & Blood Gas",
isButtonPressed: false,
time: null}
];
let secondaryButtons = [
{ id: "Hypoxia",
isButtonPressed: false,
time: null},
{ id: "Hypovolaemia",
isButtonPressed: false,
time: null},
{ id: "Hypothermia",
isButtonPressed: false,
time: null},
{ id: "Hyper/Hypokalaemia",
isButtonPressed: false,
time: null},
{ id: "Tension Pneumothorax",
isButtonPressed: false,
time: null},
{ id: "Cardiac Tamponade",
isButtonPressed: false,
time: null},
{ id: "Toxins",
isButtonPressed: false,
time: null},
{ id: "Thrombosis",
isButtonPressed: false,
time: null},
];
let tertiaryButtons = [
{ id: "Patient Intubated",
isButtonPressed: false,
time: null},
{ id: "Automatic Compression Device",
isButtonPressed: false,
time: null},
{ id: "Tension Decompressed",
isButtonPressed: false,
time: null},
{ id: "Calcium Given",
isButtonPressed: false,
time: null},
{ id: "Insulin-Dextrose Given",
isButtonPressed: false,
time: null},
{ id: "Salbutamol IV Given",
isButtonPressed: false,
time: null},
{ id: "Blood Transfusion Started",
isButtonPressed: false,
time: null},
{ id: "Tranexamic Acid Given",
isButtonPressed: false,
time: null},
{ id: "Thrombolysis Given",
isButtonPressed: false,
time: null},
{ id: "Sodium Bicarbonate Given",
isButtonPressed: false,
time: null},
{ id: "IV Magnesium Given",
isButtonPressed: false,
time: null},
];


const APLSScreen = ({ navigation }) => {
    const [reset, setReset] = useState(false);



    const [pButtons, setPButtons] = useState(primaryButtons);
    const [sButtons, setSButtons] = useState(secondaryButtons);
    const [tButtons, setTButtons] = useState(tertiaryButtons);

    const [log, setLog] = useState(["APLS LOG"]);

    const logState = {
        value: log,
        setValue: setLog,
    };

    const resetLog = () => {
        setLog(log => ["APLS LOG"]);


    }

    return (
        <PCalcScreen>
        <ALSToolbar/>
        <View style={styles.container}>
        <ALSDisplayButton style={styles.button}><Stopwatch/></ALSDisplayButton>
        <ALSDisplayButton onPress={resetLog} style={styles.button}>TEMP RESET</ALSDisplayButton>
        <ALSDisplayButton style={styles.button}>Analyse Rhythm</ALSDisplayButton>
        <ALSDisplayButton 
        style={styles.button}
        onPress={() => navigation.navigate(routes.APLS_LOG)}>Log</ALSDisplayButton>
        </View>
        <ScrollView style={styles.bottomContainer}>
        <AppText style={styles.text}> APLS </AppText>
        <FlatList
        data={pButtons}
        keyExtractor={pbutton => pbutton.id.toString()}
        renderItem={({ item }) =>
        <ALSFunctionButton
        title={item.id}
        isButtonPressed={item.isButtonPressed}
        itemTime={item.time}
        logState={logState}
        reset={reset}
        setReset={setReset}
        
        />
        } />
        <ALSDisplayButton style={styles.darkButton}>Exclude The Following Hs & Ts:</ALSDisplayButton>
        <FlatList
        data={sButtons}
        keyExtractor={secondaryButton => secondaryButton.id.toString()}
        renderItem={({ item }) =>
        <ALSFunctionButton
        title={item.id}
        isButtonPressed={item.isButtonPressed}
        itemTime={item.time} 
        logState={logState}
        reset={reset}
        setReset={setReset}
        
        />
        } />
        <ALSDisplayButton style={styles.darkButton}>Additional Drugs & Procedures:</ALSDisplayButton>
        <FlatList
        data={tButtons}
        keyExtractor={tbutton => tbutton.id.toString()}
        renderItem={({ item }) =>
        <ALSFunctionButton
        title={item.id}
        isButtonPressed={item.isButtonPressed}
        itemTime={item.time}
        logState={logState}
        reset={reset}
        setReset={setReset} 
        
        />
        } />
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
    buttonPressed: {
        backgroundColor: colors.light,
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
