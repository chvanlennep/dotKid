import React, {useState, FC, useRef} from 'react';
//@ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultStyles from '../../app/config/styles';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  useColorScheme,
} from 'react-native';
import colors from '../config/colors';
import AppText from './AppText';
import {aplsStore} from '../brains/stateManagement/aplsState.store';
import {nlsStore} from '../brains/stateManagement/nlsState.store';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ALSFunctionButtonsProps} from './buttons/ALSFunctionButton';
import {Platform} from 'react-native';

export const ALSCommentModal: FC<ALSFunctionButtonsProps> = () => {
  const {
    params: {kind, title},
  } = useRoute();

  const navigation: any = useNavigation();
  const scheme = useColorScheme();
  const store = kind === 'child' ? aplsStore : nlsStore;

  let entryComment = [...store.getFunctionButtonTime(title)][0].comment;
  const [text, setChangeText] = useState(entryComment);

  const textInputRef = useRef<TextInput>(null);

  const background = kind === 'child' ? colors.primary : colors.secondary;

  const referenceEntry = [...store.getFunctionButtonTime(title)][0].date
    .toString()
    .split(' ');
  const date = referenceEntry[4];

  const submitComment = () => {
    store.addComment(title, text);
    navigation.goBack();
  };
  const system = Platform.OS === 'ios' ? 'ios' : 'android';

  return (
    <View
      style={[
        styles.centeredView,
        {backgroundColor: scheme === 'dark' ? colors.dark : colors.white},
      ]}>
      {system === 'ios' ? (
        <View style={styles.pulldown} />
      ) : (
        <View style={styles.closeIcon}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <MaterialCommunityIcons
              name="close-circle"
              color={colors.black}
              size={30}
            />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.modalView}>
        <View style={[styles.titleDisplay, {backgroundColor: background}]}>
          <MaterialCommunityIcons
            name="comment-processing"
            color={colors.white}
            size={20}
          />
          <AppText style={styles.titleText}>
            {date} {title}
          </AppText>
        </View>
        <TextInput
          autoFocus
          enablesReturnKeyAutomatically
          onChangeText={setChangeText}
          onSubmitEditing={() => submitComment()}
          ref={textInputRef}
          returnKeyType="done"
          style={styles.input}
          value={text}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    flex: 1,
    height: defaultStyles.container.width + 20,
    width: defaultStyles.container.width - 10,
  },
  closeIcon: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    height: 30,
    justifyContent: 'center',
    marginTop: 10,
    width: 50,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
    margin: 12,
    padding: 10,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: 'orange',
    justifyContent: 'center',
    height: 40,
    width: 35,
  },
  modalView: {
    margin: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    height: defaultStyles.container.width - 60,
    marginTop: 25,
    paddingBottom: 10,
    width: defaultStyles.container.width - 20,
    backgroundColor: colors.medium,
  },
  pulldown: {
    alignSelf: 'center',
    backgroundColor: colors.medium,
    borderRadius: 15,
    height: 5,
    marginTop: 10,
    width: defaultStyles.container.width / 1.4,
  },
  text: {
    color: colors.black,
    textAlign: 'center',
    marginHorizontal: 15,
  },
  titleDisplay: {
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: 'row',
    height: 50,
    margin: 12,
    padding: 10,
  },
  titleText: {
    color: colors.white,
    textAlign: 'center',
    marginHorizontal: 15,
  },
});
