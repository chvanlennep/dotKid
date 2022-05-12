import React from 'react';
import {StyleSheet, View, Appearance} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {windowWidth} from '../config/styles';
import AppText from './AppText';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return {hasError: true};
  }

  componentDidCatch(error, errorInfo) {
    // Catch the error in any logging service
    console.log({error: error, errorInfo: errorInfo});
  }

  render() {
    const colorScheme = Appearance.getColorScheme();

    if (this.state.hasError) {
      // Render fallback UI
      return (
        <View
          style={[
            styles.errorMessage,
            {backgroundColor: colorScheme === 'dark' ? 'black' : 'white'},
          ]}>
          <MaterialCommunityIcons name="alert-octagon" color="red" size={80} />
          <AppText style={styles.errorText}>
            Oops! Something went wrong. Please quit and reopen the app.
          </AppText>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  errorMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    width: windowWidth * 0.75,
  },
});

export default ErrorBoundary;
