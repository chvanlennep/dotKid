import React, { useState, useReducer } from 'react'
import { Alert, FlatList, StyleSheet, View } from 'react-native'



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
import ALSTertiaryFunctionButton from '../components/buttons/ALSTertiaryFunctionButton'
import AdrenalineTimer from '../components/AdrenalineTimer'
import AnalyseRhythm from '../components/AnalyseRhythm'
import RhythmModal from '../components/RhythmModal'


let primaryButtons = [
{ id: "Confirm Cardiac Arrest"},
{ id: "Call For Help"},
{ id: "Assign Team Roles"},
{ id: "Initiate CPR 15:2"},
{ id: "Bag-Mask Ventilation"},
{ id: "Get Cardiac Arrest Trolley"},
{ id: "Attach Defibrillator"},
{ id: "Gain Vascular Access"},
{ id: "Take Bloods & Blood Gas"}
];
let secondaryButtons = [
{ id: "Hypoxia"},
{ id: "Hypovolaemia"},
{ id: "Hypothermia"},
{ id: "Hyper/Hypokalaemia"},
{ id: "Tension Pneumothorax"},
{ id: "Cardiac Tamponade"},
{ id: "Toxins"},
{ id: "Thrombosis"},
];
let tertiaryButtons = [
    { id: "Automatic Compression Device"},
    { id: "Blood Transfusion Started"},
    { id: "Calcium Given"},
    { id: "Insulin-Dextrose Given"},
    { id: "IV Magnesium Given"},
    { id: "Salbutamol IV Given"},
    { id: "Patient Intubated"},
    { id: "Repeat Blood Gas"},
    { id: "Repeat Bloods"},
    { id: "Sodium Bicarbonate Given"},
    { id: "Tension Decompressed"},
    { id: "Thrombolysis Given"},
{ id: "Tranexamic Acid Given"},
];

const functionButtons = {
    "Start Time" : [],
    "Asystole" : [],
    "Ventricular Fibrillation" : [],
    "Pulseless VT" : [],
    "PEA" : [],
    "Shock Delivered" : [],
    "Adrenaline Administered" : [],
    "Rhythm Analysed" : [],
    "Confirm Cardiac Arrest" :  [],
    "Call For Help" :  [],
    "Assign Team Roles" :  [],
    "Initiate CPR 15:2" :  [],
    "Bag-Mask Ventilation" :  [],
    "Get Cardiac Arrest Trolley" :  [],
    "Attach Defibrillator" :  [],
    "Gain Vascular Access" :  [],
    "Take Bloods & Blood Gas" :  [],
    "Hypoxia" :  [],
    "Hypovolaemia" :  [],
    "Hypothermia" :  [],
    "Hyper/Hypokalaemia" :  [],
    "Tension Pneumothorax" :  [],
    "Cardiac Tamponade" :  [],
    "Toxins" :  [],
    "Thrombosis" :  [],
    "Patient Intubated" :  [],
    "Automatic Compression Device" :  [],
    "Tension Decompressed" :  [],
    "Calcium Given" :  [],
    "Insulin-Dextrose Given" :  [],
    "Salbutamol IV Given" :  [],
    "Blood Transfusion Started" :  [],
    "Tranexamic Acid Given" :  [],
    "Thrombolysis Given" :  [],
    "Sodium Bicarbonate Given" :  [],
    "IV Magnesium Given" :  [],
    "Repeat Blood Gas" : [],
    "Repeat Bloods" : [],
    "ROSC" : [],
    "RIP" : []
 };


const APLSScreen = ({ navigation }) => {
    const [reset, setReset] = useState(false);

    const [pButtons, setPButtons] = useState(primaryButtons);
    const [sButtons, setSButtons] = useState(secondaryButtons);
    const [tButtons, setTButtons] = useState(tertiaryButtons);
    const [fButtons, setFunctionButtons] = useState(functionButtons);
    const [intervalTime, setIntervalTime] = useState(0)
    const [adrenalineTime, setAdrenalineTime] = useState(0)

    const [adrenalinePressed, setAdrenalinePressed] = useState(false);




    const adrenalineTimeState = {
        value: adrenalineTime,
        setValue: setAdrenalineTime
    }

    const adrenalinePressedState = {
        value: adrenalinePressed,
        setValue: setAdrenalinePressed
    };

    const intervalState = {
        value: intervalTime,
        setValue: setIntervalTime
    };


    const logState = {
        value: functionButtons,
        setValue: setFunctionButtons,
    };

    const resetState = {
        value: reset,
        setValue: setReset
    };

    //clears functionButtons object
    const resetLogTimes = (functionButtons) => {
        for (let value in functionButtons) {
            functionButtons[value] = []
        }
        return functionButtons
    }


    //Adrenaline logic
    const adrenaline = () => {
        if (!adrenalinePressed){
            setAdrenalinePressed(true);
            handleLogEvent(functionButtons, "Adrenaline Administered")
            console.log(functionButtons)
        } else if (adrenalinePressed){
            Alert.alert(
                'You can only log this every 3 minutes',
                'Please click undo if you need to cancel this log entry.',
                [
                    {
                        text: 'Undo',
                        onPress: () => {removeTime("Adrenaline Administered", functionButtons)
                                        setAdrenalinePressed(false)},
                        style: 'cancel'
                    },
                    { text: 'OK', onPress: () => console.log('OK Pressed') }
                ],
                { cancelable: false }
                );
        }
    }



        //reset button logic
    const handleReset = () => {
        setFunctionButtons(resetLogTimes(functionButtons))
        setReset(true)
        Alert.alert(
            'Your APLS Log has been reset.',
            '',
            [
                  {
                    text: 'OK',
                    onPress: () => (console.log("OK")),
                    style: 'cancel'
                  },
            ],
            { cancelable: true }
          );
        setReset(false)
    }

    //reset button alert
    const resetLog = () => {
        Alert.alert(
            'Do you wish to reset your APLS Log?',
            '',
            [
                { text: 'RESET', onPress: () => handleReset() },
                  {
                    text: 'Cancel',
                    onPress: () => (console.log("Cancel")),
                    style: 'cancel'
                  },
            ],
            { cancelable: false }
          );
    }

    // RIP Alert window
    const RIPAPLS = () => {
        Alert.alert(
            'Do you wish to terminate this APLS encounter?',
            '',
            [
                { text: 'Yes - confirm patient as RIP', onPress: () => handleLogEvent(functionButtons, "RIP") },
                  {
                    text: 'Cancel',
                    onPress: () => (console.log("Cancel")),
                    
                  },
            ],
            { cancelable: false }
          );
        
    }
    // ROSC alert window
    const ROSCAPLS = () => {
        Alert.alert(
            'Do you wish to terminate this APLS encounter?',
            '',
            [
                { text: 'Yes - confirm patient as ROSC', onPress: () => handleLogEvent(functionButtons, "ROSC") },
                  {
                    text: 'Cancel',
                    onPress: () => (console.log("Cancel")),
                    
                  },
            ],
            { cancelable: false }
          );
        
    }

    //removes time from log object
    const removeTime = (title, oldState) => {
        const oldButtonArray = oldState[title];
        if (oldButtonArray.length < 2 ) {
            setFunctionButtons((oldState) => {
                const updatingState = oldState;
                updatingState[title] = []
                return updatingState
            })
        }  else {
            const newButtonArray = oldButtonArray.slice(0, -1)
            setFunctionButtons((oldState) => {
                const updatingState = oldState;
                updatingState[title] = newButtonArray
                return updatingState;
            })
        }
    };


    // adds time to log object
const handleLogEvent = (newState, title) => {
        const newTime = new Date();
        const oldLogArray = newState[title]
        const newLogArray = oldLogArray.concat(newTime);
        setFunctionButtons((newState) => {
            const updateState = newState;
            updateState[title] = newLogArray;
            return updateState;
        });
        console.log(functionButtons)
    }


    return (
        <PCalcScreen>

        <ALSToolbar reset={resetLog} rip={RIPAPLS} rosc={ROSCAPLS}/>

        <View style={styles.container}>

        <ALSDisplayButton style={styles.button}> <Stopwatch intervalState={intervalState} logState={logState} resetState={resetState}/></ALSDisplayButton>

        <ALSDisplayButton 
        style={styles.button}
        onPress={() => navigation.navigate(routes.APLS_LOG)}>Log</ALSDisplayButton>

        <RhythmModal 
        logState={logState}
        resetState={resetState} />

        <ALSDisplayButton 
        onPress={() => adrenaline()} 
        style={[styles.button, adrenalinePressed && styles.buttonPressed]}>
        Adrenaline {"\n"}
        { adrenalinePressed && <AdrenalineTimer 
        adrenalinePressedState={adrenalinePressedState} 
        adrenalineTimeState={adrenalineTimeState}
        resetState={resetState} /> }
        </ALSDisplayButton>

        </View>
        <ScrollView style={styles.bottomContainer}>
        <AppText style={styles.text}> APLS </AppText>
        <FlatList
        data={pButtons}
        keyExtractor={pbutton => pbutton.id.toString()}
        renderItem={({ item }) =>
        <ALSFunctionButton

        title={item.id}
        logState={logState}
        intervalState={intervalState}
        resetState={resetState}
        
        />
        } />
        <ALSDisplayButton style={styles.darkButton}>Exclude The Following Hs & Ts:</ALSDisplayButton>
        <FlatList
        data={sButtons}
        keyExtractor={secondaryButton => secondaryButton.id.toString()}
        renderItem={({ item }) =>
        <ALSFunctionButton
        logState={logState}
        intervalState={intervalState}
        resetState={resetState}
        title={item.id}
        
        />
        } />
        <ALSDisplayButton style={styles.darkButton}>Additional Drugs & Procedures:</ALSDisplayButton>
        <FlatList
        data={tButtons}
        keyExtractor={tbutton => tbutton.id.toString()}
        renderItem={({ item }) =>
        <ALSTertiaryFunctionButton
        title={item.id}
        intervalState={intervalState}
        logState={logState}
        resetState={resetState}
        
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
        // Need to center content in virtualised listbut getting an error message

    },
    button: {
        alignContent: "center",
        alignSelf: "center",
        backgroundColor: colors.dark,
        justifyContent: 'center',
        width: '44%',
    },
    buttonPressed: {
        backgroundColor: colors.primary,
        flexWrap: "nowrap",
        height: 90,
        justifyContent: "center",
        textAlign: 'center'
      },
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        paddingHorizontal: 5,
        paddingTop: 10,
        width: "100%",
    },
    darkButton: {
        backgroundColor: colors.dark,
        alignSelf: "center"
        
    },
    mediumButton: {
        backgroundColor: colors.medium
    },
    text: {
        fontSize: 28,
        marginBottom: 5
    },
    
})
