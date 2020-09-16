import React from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from './Icon'
import colors from "../config/colors"
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const LowerNavBar = () => {
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            height: 60 + insets.bottom,
            width:"100%",
            alignItems: "flex-start",
            backgroundColor: colors.medium,
        }
    })
    return (
        <View style={styles.container}>
        <Icon name="calculator" height={60} width="25%" />
        <Icon name="hospital-box" height={60} width="25%" />
        <Icon name="book-open-variant" height={60} width="25%" />
        <Icon name="settings" height={60} width="25%" />
        </View>
    )
}

export default LowerNavBar


