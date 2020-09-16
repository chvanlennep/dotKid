import React from 'react'
import { View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import colors from '../../config/colors'

function Icon({
    backgroundColor = colors.dark, 
    borderRadius, 
    height = 20,
    iconColor = colors.white,
    name,
    width = 20
     }) {
    return (
        <View style={{
            width,
            height,
            borderRadius,
            backgroundColor,
            margin: 10,
            marginRight: 15,
            marginTop: 12,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <MaterialCommunityIcons name={name} color={iconColor} size={height} />
        </View>
    )
}

export default Icon
