import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ALSToolButton from './buttons/ALSToolButton'

const ALSToolbar = () => {
    return (
        <View style={styles.container}>
        <ALSToolButton name="Undo"/>
        <ALSToolButton name="Reset"/>
        <ALSToolButton name="ROSC"/>
        <ALSToolButton name="RIP"/>
        </View>
    )
}

export default ALSToolbar

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        
    },

})
