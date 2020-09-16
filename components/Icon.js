import React from 'react'
import { View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import colors from '../config/colors'

function Icon({
    backgroundColor = colors.medium, 
    borderRadius, 
    height,
    iconColor = "#fff",
    name,
    width 
     }) {
    return (
        <View style={{
            width,
            height,
            borderRadius,
            backgroundColor,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <MaterialCommunityIcons name={name} color={iconColor} size={height / 2} />
        </View>
    )
}

export default Icon

     
