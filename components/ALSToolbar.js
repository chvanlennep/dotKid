import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ALSToolButton from './buttons/ALSToolButton'

const ALSToolbar = ({reset, rip, rosc}) => {
    return (
        <View style={styles.container}>
        <ALSToolButton name="RIP" onPress={rip}/>
        <ALSToolButton name="Reset" onPress={reset} />
        <ALSToolButton name="ROSC" onPress={rosc}/>
        </View>
    )
}

export default ALSToolbar

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        
    },

})
