import React, { useState, useContext } from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

import colors from '../../config/colors'
import AppText from '../AppText'

const ALSFunctionButton = ({ children, style }) => {
    const [isPressed, setPressed] = useState(false);
    const [log, setLog] = useState([])

    const handlePress = () => {
        //some logic to prevent double pressing may need to go here
        setPressed(true);
        setLog(log => [...log, children])
    };
    
    return (
        <TouchableHighlight 
        activeOpacity={0.5}
        underlayColor={colors.primary}
        onPress={handlePress}
        style={[ styles.button, style, isPressed && styles.buttonPressed ]}
        pressed={isPressed}
        >
         
        <AppText>{children}</AppText>
       
        </TouchableHighlight>
    )
}

export default ALSFunctionButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.medium,
        borderRadius: 5,
        color: colors.white,
        flexDirection: "row",
        height: 57,
        margin: 5, 
        padding: 10,
        width: "100%",
        
    },
    buttonPressed: {
        backgroundColor: colors.light,
      }
})
