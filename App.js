import React, {useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNBootSplash from 'react-native-bootsplash';
import {debugMobxActions} from 'mobx-action-flipper';

import {lightTheme, darkTheme} from './app/navigation/navigationTheme';
import AppNavigator from './app/navigation/AppNavigator';
import {GlobalStatsProvider} from './app/components/GlobalStats';
import {readItemFromStorage, writeItemToStorage} from './app/brains/storage';
import AcceptConditionsModal from './app/components/AcceptConditionsModal';
import {timeout} from './app/brains/oddBits';
import WalkthroughModal from './app/components/WalkthroughModal';
import ErrorBoundary from './app/components/ErrorBoundary';
import {aplsStore} from './app/brains/stateManagement/aplsState.store';
import {nlsStore} from './app/brains/stateManagement/nlsState.store';

debugMobxActions({aplsStore, nlsStore});

export default () => {
  // Any number of stores can be passed in as an object:

  const scheme = useColorScheme();

  const [accepted, setAccepted] = useState(true);
  const [termsVisible, setTermsVisible] = useState(false);
  const [walkthroughVisible, setWalkthroughVisible] = useState(false);

  // add timeout to prevent white flash during splash screen transition when phone in dark mode
  useEffect(() => {
    timeout(500).then(async () => {
      await RNBootSplash.hide({fade: true});
      await readItemFromStorage('education_accepted', setAccepted, false);
    });
  }, []);

  useEffect(() => {
    if (!accepted && !termsVisible) {
      setTermsVisible(true);
    } else if (accepted && termsVisible) {
      writeItemToStorage('education_accepted', () => null, true);
      setTermsVisible(false);
      setWalkthroughVisible(true);
    }
  }, [accepted, termsVisible, walkthroughVisible]);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AcceptConditionsModal
          setAccepted={setAccepted}
          termsVisible={termsVisible}
        />
        <WalkthroughModal
          setWalkthroughVisible={setWalkthroughVisible}
          walkthroughVisible={walkthroughVisible}
        />
        <GlobalStatsProvider>
          <NavigationContainer
            theme={scheme === 'dark' ? darkTheme : lightTheme}>
            <AppNavigator />
          </NavigationContainer>
        </GlobalStatsProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};
