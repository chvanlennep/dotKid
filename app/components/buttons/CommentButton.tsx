import React, {FC} from 'react';
import {useNavigation} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity} from 'react-native';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {aplsStore} from '../../brains/stateManagement/aplsState.store';
import {nlsStore} from '../../brains/stateManagement/nlsState.store';
import colors from '../../config/colors';
import routes from '../../navigation/routes';
import {observer} from 'mobx-react';
import {ALSFunctionButtonsProps} from './ALSFunctionButton';

export const CommentButton: FC<ALSFunctionButtonsProps> = observer(
  ({kind, title}) => {
    const navigation: any = useNavigation();

    const store = kind === 'child' ? aplsStore : nlsStore;
    let entryComment = [...store.getFunctionButtonTime(title)][0].comment;

    const commentIcon = entryComment
      ? 'comment-text-outline'
      : 'comment-edit-outline';

    return (
      <TouchableOpacity
        style={styles.icon}
        onPress={() =>
          navigation.navigate(routes.COMMENT_MODAL, {kind, title})
        }>
        <MaterialCommunityIcons
          name={commentIcon}
          color={colors.white}
          size={25}
        />
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 35,
  },
});
