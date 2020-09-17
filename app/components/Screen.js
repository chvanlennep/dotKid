import React from 'react'
import { StyleSheet, View, Platform } from 'react-native'
import Constants from 'expo-constants';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import colors from '../config/colors';
import LowerNavBar from './LowerNavBar';



const Screen = ({ children, style }) => {
    const insets = useSafeAreaInsets();
    const styles = StyleSheet.create({
        screen: {
            paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : insets.top,
            flex: 1,
        },
        view: {
            flex: 1,
            backgroundColor: colors.white
        }
    })
    return (
        <View style={{flex: 1}}>
        <View style={[styles.screen, style]}>
        <View style={[styles.view, style]}>{children}</View>
        <LowerNavBar />
        </View>
        </View>
    )
}

export default Screen


