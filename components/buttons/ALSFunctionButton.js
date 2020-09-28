import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableHighlight, View } from 'react-native'

import colors from '../../config/colors'
import AppText from '../AppText'

const ALSFunctionButton = ({  onPress, style, title }) => {
 

        const [changeBackground, setChangeBackground] = useState(false)

        const handlePress = () => {
        //some logic to prevent double pressing may need to go here
        
        setChangeBackground(true);
        reducer(state, action)
        console.log(log)
        
        }
        
     
    return (
        <TouchableHighlight 
        activeOpacity={0.5}
        underlayColor={colors.light}
        onPress={onPress}
        style={[ styles.button, style, changeBackground && styles.buttonPressed ]}
        pressed={changeBackground}
        title={title}
        >
         
        <AppText>{title}</AppText>
        
       
        </TouchableHighlight>
    )
};

export default ALSFunctionButton

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: colors.medium,
        borderRadius: 5,
        flexDirection: "row",
        height: 57,
        margin: 5, 
        padding: 10,
        width: "98%",
        
    },
    buttonPressed: {
        backgroundColor: colors.primary
    }

})


