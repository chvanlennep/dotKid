import { Share } from 'react-native';

export default async (message) => {
  try {
    const result = await Share.share({
      message: message,
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
