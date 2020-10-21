import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import AppText from '../AppText'
import colors from '../../config/colors'
import ButtonIcon from '../buttons/ButtonIcon'

const RhythmButton = ( { logState, modalState, rhythmPressedState, resetState, style, title}) => {

    const reset = resetState.value;
        const setReset = resetState.setValue;

        const functionButtons = logState.value;
        const setFunctionButtons = logState.setValue;

        const modalVisible = modalState.value;
        const setModalVisible = modalState.setValue;


        const rhythmPressed = rhythmPressedState.value
        const setRhythmPressed = rhythmPressedState.setValue



        const [changeBackground, setChangeBackground] = useState(() =>  functionButtons[title].length >= 1 ? true : false)

        const [showUndo, setShowUndo] = useState(() =>  functionButtons[title].length >= 1 ? true : false)

        //number of times pressed logic
        const [clicks, setClicks] = useState(functionButtons[title].length)


        // logs time with event button
        const updateTime = (title, oldState) => {
            const timeStamp = new Date();
            const oldButtonArray = oldState[title];
            const newButtonArray = oldButtonArray.concat(timeStamp);
                setFunctionButtons((oldState) => {
            const updatingState = oldState;
            updatingState[title] = newButtonArray;
                return updatingState;
            });
        }

        //uses state to change background button color after selected
       const handleChangeBackground = (changeBackground, oldState, title) => {
            const oldButtonArray = oldState[title]
            if (oldButtonArray.length < 2) {
                setChangeBackground(false)
                return changeBackground
            } else {
                return changeBackground
            }
       }


        const handlePress = () => {
        //some logic to prevent double pressing may need to go here
        setClicks(clicks + 1);
        setChangeBackground(true);
        updateTime(title, functionButtons);
        setShowUndo(true);
        console.log(functionButtons)
        if (title == "Ventricular Fibrillation" || title == "Pulseless VT") {
            Alert.alert(
                'Shock Advised',
                '',
                [
                    { text: 'Deliver Shock', onPress: () => {setModalVisible(false); setRhythmPressed(true); updateTime("Shock Delivered", functionButtons);  } },
                    { text: 'No Shock', onPress: () => {setModalVisible(false); setRhythmPressed(true); updateTime(title, functionButtons);} },
                    { text: 'Cancel', onPress: () => {setModalVisible(false); setRhythmPressed(true);} }

                ],
                { cancelable: false }
                );
            } else if (title == "Asystole" || title == "PEA") {
                
                Alert.alert(
                    'Consider Adrenaline',
                    '',
                    [
                        { text: 'OK', onPress: () => {setModalVisible(false); setRhythmPressed(true); updateTime(title, functionButtons)} }
    
                    ],
                    { cancelable: false }
                    );
                }
            
        }
        
        
        // handles undo click - changes background if appropriate and removes last added time
      const removeTime = (title, oldState) => {
          const oldButtonArray = oldState[title];
          if (oldButtonArray.length < 2 ) {
              setFunctionButtons((oldState) => {
                  const updatingState = oldState;
                  updatingState[title] = []
                  setShowUndo(false)
                  return updatingState
              })
         }  else {
            const newButtonArray = oldButtonArray.slice(0, -1)
            setFunctionButtons((oldState) => {
                const updatingState = oldState;
                updatingState[title] = newButtonArray
                setShowUndo(true)
                return updatingState;
         })
        }
    };


        // global undo click handling
        const handleUndo = () => {
            handleChangeBackground(changeBackground, functionButtons, title);
            removeTime(title, functionButtons)
            setRhythmPressed(false)
            console.log(functionButtons)
            setClicks(clicks -1)
        }

        // reset button logic

        useEffect(() => {
            if (reset == true){    
                setChangeBackground(false);
                setClicks(0);
                setShowUndo(false);
            };
        }
        )
    return (
        <TouchableOpacity onPress={handlePress} style={[ styles.button, style, changeBackground && styles.buttonPressed ]}>
        <AppText style={styles.text}>{`${title} ${clicks ? "x" + clicks: ""}`}</AppText>
        {showUndo && (
            <View style={styles.icon}>
            <TouchableOpacity onPress={handleUndo}>
            <ButtonIcon name="refresh" backgroundColor={colors.dark} marginBottom={0} />
            </TouchableOpacity>
            </View>
            )}
        </TouchableOpacity>
    )
}

export default RhythmButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        alignContent: "center",
        backgroundColor: colors.dark,
        borderRadius: 5,
        flex: 1,
        justifyContent: "center",
        margin: 5,
        padding: 10,
        textAlign: 'center'
    },
    buttonPressed: {
        flexWrap: "nowrap",
        justifyContent: "center",
        textAlign: 'center'
    },
    icon: {
        alignSelf: "auto"
    },
    text: {
        color: colors.white,
        margin: 5,
        textAlign: "center"
    } 
    
})
