import React, { useState, useReducer } from 'react'
import { FlatList, ScrollView, StyleSheet, View } from 'react-native'


import PCalcScreen from '../components/PCalcScreen'
import ALSToolbar from '../components/ALSToolbar'
import Button from '../components/buttons/Button'
import colors from '../config/colors'
import AppText from '../components/AppText'
import ALSDisplayButton from '../components/buttons/ALSDisplayButton'
import ALSFunctionButton from '../components/buttons/ALSFunctionButton'
import Stopwatch from '../components/Stopwatch'
import routes from '../navigation/routes'


let primaryButtons = [
{ id: "Confirm Cardiac Arrest",
isButtonPressed: false,
time: []},
{ id: "Call For Help",
isButtonPressed: false,
time: []},
{ id: "Assign Team Roles",
isButtonPressed: false,
time: []},
{ id: "Initiate CPR 15:2",
isButtonPressed: false,
time: []},
{ id: "Bag-Mask Ventilation",
isButtonPressed: false,
time: []},
{ id: "Get Cardiac Arrest Trolley",
isButtonPressed: false,
time: []},
{ id: "Attach Defibrillator",
isButtonPressed: false,
time: []},
{ id: "Gain Vascular Access",
isButtonPressed: false,
time: []},
{ id: "Take Bloods & Blood Gas",
isButtonPressed: false,
time: []}
];
let secondaryButtons = [
{ id: "Hypoxia",
isButtonPressed: false,
time: []},
{ id: "Hypovolaemia",
isButtonPressed: false,
time: []},
{ id: "Hypothermia",
isButtonPressed: false,
time: []},
{ id: "Hyper/Hypokalaemia",
isButtonPressed: false,
time: []},
{ id: "Tension Pneumothorax",
isButtonPressed: false,
time: []},
{ id: "Cardiac Tamponade",
isButtonPressed: false,
time: []},
{ id: "Toxins",
isButtonPressed: false,
time: []},
{ id: "Thrombosis",
isButtonPressed: false,
time: []},
];
let tertiaryButtons = [
{ id: "Patient Intubated",
isButtonPressed: false,
time: []},
{ id: "Automatic Compression Device",
isButtonPressed: false,
time: []},
{ id: "Tension Decompressed",
isButtonPressed: false,
time: []},
{ id: "Calcium Given",
isButtonPressed: false,
time: []},
{ id: "Insulin-Dextrose Given",
isButtonPressed: false,
time: []},
{ id: "Salbutamol IV Given",
isButtonPressed: false,
time: []},
{ id: "Blood Transfusion Started",
isButtonPressed: false,
time: []},
{ id: "Tranexamic Acid Given",
isButtonPressed: false,
time: []},
{ id: "Thrombolysis Given",
isButtonPressed: false,
time: []},
{ id: "Sodium Bicarbonate Given",
isButtonPressed: false,
time: []},
{ id: "IV Magnesium Given",
isButtonPressed: false,
time: []},
];


const APLSScreen = ({ navigation }) => {

    const [state, dispatch] = useReducer(reducer, INITIAL_STATE, init)

    // action types
    const ADD_LOG = 'ADD_LOG';
    const UNDO_LOG = 'UNDO_LOG';
    const TOGGLE_PRESSED = 'TOGGLE_PRESSED';
    const UNDO_PRESSED = 'UNDO_PRESSED';
    const RESET = 'RESET'


    // initial state values
    INITIAL_STATE = {
        log: [],
        primaryButtons: [
            { id: "Confirm Cardiac Arrest",
            isButtonPressed: false,
            time: []},
            { id: "Call For Help",
            isButtonPressed: false,
            time: []},
            { id: "Assign Team Roles",
            isButtonPressed: false,
            time: []},
            { id: "Initiate CPR 15:2",
            isButtonPressed: false,
            time: []},
            { id: "Bag-Mask Ventilation",
            isButtonPressed: false,
            time: []},
            { id: "Get Cardiac Arrest Trolley",
            isButtonPressed: false,
            time: []},
            { id: "Attach Defibrillator",
            isButtonPressed: false,
            time: []},
            { id: "Gain Vascular Access",
            isButtonPressed: false,
            time: []},
            { id: "Take Bloods & Blood Gas",
            isButtonPressed: false,
            time: []}
            ],
            secondaryButtons: [
            { id: "Hypoxia",
            isButtonPressed: false,
            time: []},
            { id: "Hypovolaemia",
            isButtonPressed: false,
            time: []},
            { id: "Hypothermia",
            isButtonPressed: false,
            time: []},
            { id: "Hyper/Hypokalaemia",
            isButtonPressed: false,
            time: []},
            { id: "Tension Pneumothorax",
            isButtonPressed: false,
            time: []},
            { id: "Cardiac Tamponade",
            isButtonPressed: false,
            time: []},
            { id: "Toxins",
            isButtonPressed: false,
            time: []},
            { id: "Thrombosis",
            isButtonPressed: false,
            time: []},
            ],
            tertiaryButtons: [
            { id: "Patient Intubated",
            isButtonPressed: false,
            time: []},
            { id: "Automatic Compression Device",
            isButtonPressed: false,
            time: []},
            { id: "Tension Decompressed",
            isButtonPressed: false,
            time: []},
            { id: "Calcium Given",
            isButtonPressed: false,
            time: []},
            { id: "Insulin-Dextrose Given",
            isButtonPressed: false,
            time: []},
            { id: "Salbutamol IV Given",
            isButtonPressed: false,
            time: []},
            { id: "Blood Transfusion Started",
            isButtonPressed: false,
            time: []},
            { id: "Tranexamic Acid Given",
            isButtonPressed: false,
            time: []},
            { id: "Thrombolysis Given",
            isButtonPressed: false,
            time: []},
            { id: "Sodium Bicarbonate Given",
            isButtonPressed: false,
            time: []},
            { id: "IV Magnesium Given",
            isButtonPressed: false,
            time: []},
            ],
    }

    //action functions
    const addLog = (item, newTime) => {
        dispatch(
            { type: ADD_LOG, item },
            { type: ADD_TIME, newTime }
            );
    }

    const undoLog = (item, newTime) => {
        dispatch(
            { type: UNDO_LOG, item },
            { type: UNDO_TIME, newTime }
        );
    }

    const togglePressed = (item) => {
        dispatch(
            { type: TOGGLE_PRESSED, item }
        )
    }

    const undoPressed = (item) => {
        dispatch(
            { type: UNDO_PRESSED, item }
            )
    }

    // 3rd parameter for lazy initialisation
    const init = initialState => initialState

    // dud <Stopwatch> output
    const newTime = 10

    // reducer function
    const reducer = (state, action) => {
        switch (action.type) {
            case ADD_LOG:
                return {
                    log: [...state.log, [action.item.id, action.item.time]],
                };
            case ADD_TIME:
                return {
                    ...state.item.time = [...state.item.time, action.newTime]
                };
            case UNDO_TIME:
                return {
                    ...state.item.time = [state.item.time.pop()]
                };
                case UNDO_LOG:
                    return {
                        log: [...state.log.pop()],
                    };
            case TOGGLE_PRESSED:
                return {
                    ...state.item.isButtonPressed = true
                };
            case UNDO_PRESSED:
                if (state.item.time.length > 1) {
                    return {
                        ...state.item.time.pop()
                    }
                }
                else {
                    return {
                        ...state.item.time.pop(),
                        ...state.item.isButtonPressed = false 
                    }
                }
            case RESET:
                return init(INITIAL_STATE)
            default:
                return INITIAL_STATE;
        }
    }


//old code from here
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
