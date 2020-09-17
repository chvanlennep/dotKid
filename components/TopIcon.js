import React from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import colors from '../config/colors'

function TopIcon({
    backgroundColor = colors.medium, 
    borderRadius, 
    height,
    iconColor = "#fff",
    name,
    onPress,
    width 
     }) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
        <View style={{
            width,
            height,
            borderRadius,
            backgroundColor,
            padding: 0,
            alignItems: 'center',
            justifyContent: 'center'
        }}>
        <MaterialCommunityIcons name={name} color={iconColor} size={width} />
        </View>
        </TouchableWithoutFeedback>
    )
}

export default TopIcon

     
