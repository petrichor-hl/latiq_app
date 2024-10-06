import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ColorPalette } from '../../../../base/constants/color-palette';
import { ScreenName } from '../../../../base/constants/screen-name';
import { push } from '../../../../navigation/navation.config';
import { avatarCollectionsList } from '../../../pick-avatar/pick-avatar.constants';
import { PickAvatarScreenProps } from '../../../pick-avatar/pick-avatar.screen';

interface AvatarProps {
  control: Control<any, any>;
}

export const Avatar = (props: AvatarProps) => {
  const { control } = props;

  const avatar: string = useWatch({
    control,
    name: 'avatar', // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
  });

  const [collectionNumber, seedNumber] = avatar.split('-').map(e => Number(e));

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => push<PickAvatarScreenProps>(ScreenName.PICK_AVATAR)}
      style={styles.avatarImg}>
      <SvgXml
        xml={avatarCollectionsList[collectionNumber].avatarXml[seedNumber]}
      />
      <View style={styles.editIcon}>
        <Ionicons name={'brush'} size={20} color={ColorPalette.black} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatarImg: {
    padding: 6,
    borderColor: ColorPalette.white,
    borderWidth: 4,
    alignSelf: 'center',
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 16,
    transform: [{ scale: 1.2 }],
  },
  editIcon: {
    position: 'absolute',
    right: -14,
    top: -14,
    backgroundColor: ColorPalette.white,
    padding: 8,
    borderRadius: 18,
  },
  textInput: {
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: ColorPalette.white,
    alignSelf: 'stretch',
    borderRadius: 8,
  },
});
