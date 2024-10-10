import React from 'react';
import { Control, useController } from 'react-hook-form';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ColorPalette } from '../../../../base/constants/color-palette';
import { push } from '../../../../navigation/navation.config';
import { avatarCollectionsList } from '../../../pick-avatar/pick-avatar.constants';
import {
  PickAvatarScreen,
  PickAvatarScreenProps,
} from '../../../pick-avatar/pick-avatar.screen';

interface AvatarProps {
  control: Control<
    {
      avatar: string;
      email: string;
      password: string;
      nickName: string;
      confirmPassword: string;
    },
    any
  >;
}

export const Avatar = (props: AvatarProps) => {
  const { control } = props;

  const { field } = useController({
    control,
    name: 'avatar',
  });

  const [collectionNumber, seedNumber] = field.value
    .split('-')
    .map(e => Number(e));

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() =>
        push<PickAvatarScreenProps>(PickAvatarScreen, {
          collectionNumber,
          onPickAvatar: avatar => field.onChange(avatar),
        })
      }
      style={styles.avatarImg}>
      <SvgXml
        xml={avatarCollectionsList[collectionNumber].avatarXml(160)[seedNumber]}
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
    marginBottom: 10,
    borderRadius: 16,
  },
  editIcon: {
    position: 'absolute',
    right: -14,
    top: -14,
    backgroundColor: ColorPalette.white,
    padding: 8,
    borderRadius: 18,
  },
});
