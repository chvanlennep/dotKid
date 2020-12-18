import {Alert, Share} from 'react-native';

export default async (message) => {
  try {
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        Alert.alert(
          'Log Successfully Exported',
          '',
          [
            {
              text: 'OK',
              onPress: () => null,
            },
          ],
          {cancelable: false},
        );
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
