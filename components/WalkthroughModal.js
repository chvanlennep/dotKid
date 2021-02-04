import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import AppText from '../components/AppText';
import colors from '../config/colors';
import {windowWidth} from '../config/styles';


const walkthroughModal = ({setWalkthroughAccepted, walkthroughVisible}) => {
    
    
    const [currentPosition, setCurrentPosition] = useState(0);
   

    

    const accept = () => {
        if (currentPosition === 2) {
            setWalkthroughAccepted(true)
            }
        //walkthroughAccepted(true)}; come back to this
        setCurrentPosition((old) => old + 1)
        
      }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={walkthroughVisible}
      onRequestClose={() => {
        Alert.alert('App Will Not Be Loaded', '', [
          {text: 'OK', onPress: () => null},
        ]);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.fullScreen}>
          <AppText style={styles.title}>Walkthrough</AppText>
          <View style={styles.centeredView}>
          {currentPosition === 0 && (<AppText style={styles.additionalWarningText}>
            Just a quick walkthrough...
            </AppText>)

        } 
        {currentPosition === 1 && (
            <Image style={styles.image} source={require('../assets/walkthrough/SwitchScreenshot.png') } />)
        }
        {currentPosition === 2 && (
            <Image style={styles.image} source={require('../assets/walkthrough/ResusScreenshot.png') } />
            )
        }
        
        </View> 
          {currentPosition === 1 && (
            <View style={styles.walkthrough}>
            <AppText style={styles.additionalWarningText}>
            At the top of the screen, press here to change between paediatric and neonatal modes.
            </AppText>
            </View>
             )}
             {currentPosition === 2 && (
                <View style={styles.walkthrough}>
                <AppText style={styles.additionalWarningText}>
                At the bottom of the screen, press here to access the resuscitation mode.
                </AppText>
                </View>
                 )}
                 
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={accept} style={styles.smallButton}>
                <AppText style={{color: 'white'}}>Next</AppText>
              </TouchableOpacity>
            </View>
            <View>
            
            </View>
        </View>
      </View>
    </Modal>
  );
};

export default walkthroughModal;

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '50%',
    marginBottom: 15,
    marginTop: 10,
  },
  image: {
    width: windowWidth * 0.9,
    height: windowWidth * 0.7,
    resizeMode: 'center',
    borderRadius: 10,
    overflow: 'hidden',
},
  fullScreen: {
    height: '90%',
    width: '98%',
    justifyContent: 'center',
    backgroundColor: 'black',
    alignItems: 'center',
    borderRadius: 15,
  },
  title: {
      color: 'white',
      fontSize: 28,
      fontWeight: '500',
      marginTop: 15,
      marginBottom: 10,
      textAlign: 'center',
  },
  mainMessage: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: 'white',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: colors.dark,
    height: 50,
    padding: 10,
  },
  additionalWarningText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: 'black',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    padding: 5,
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  },
  legalText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 5,
    margin: 15,
  },
  walkthrough: {
      alignItems: 'center',
      borderRadius: 10,
      flex: 0.5,
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10, 
      width: '100%',
  },
});
