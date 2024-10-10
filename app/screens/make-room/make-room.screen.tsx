import React from 'react';
import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorPalette } from '../../base/constants/color-palette';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../navigation/navation.config';
import { MakeRoomForm, makeRoomSchema } from './make-room.form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { AppTextInput } from '../../base/components/app-text-input.component';
import { RoomService } from '../../services/features/room.services';
import { TopicDropdown } from './components/topic-dropdown.component';

export interface MakeRoomScreenProps {}

export const MakeRoomScreen = (_props: MakeRoomScreenProps) => {
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    // formState: { errors },
  } = useForm<MakeRoomForm>({
    mode: 'onSubmit',
    resolver: zodResolver(makeRoomSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const onSubmit = async (makeRoomForm: MakeRoomForm) => {
    await RoomService.makeRoom(makeRoomForm);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <TouchableOpacity onPress={() => goBack()} style={styles.backBtn}>
        <Ionicons name={'arrow-undo'} size={44} color={ColorPalette.primary} />
      </TouchableOpacity>

      <TopicDropdown control={control} />

      <AppTextInput
        name="capacity"
        control={control}
        placeHoder="số lượng người chơi"
        keyboardType="number-pad"
        // error={errors.nickName}
      />

      <AppTextInput
        name="round"
        control={control}
        placeHoder="số vòng chơi"
        keyboardType="number-pad"
        // error={errors.password}
      />

      <Controller
        control={control}
        name="isPublic"
        render={({ field }) => {
          return (
            <View>
              <Text style={styles.titleTxt}>Khoá phòng</Text>
              <Switch
                trackColor={{
                  false: ColorPalette.disableBg,
                  true: ColorPalette.primary,
                }}
                thumbColor={ColorPalette.white}
                ios_backgroundColor="#3e3e3e"
                onValueChange={field.onChange}
                value={field.value}
              />
            </View>
          );
        }}
      />
      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          handleSubmit(onSubmit)();
        }}
        activeOpacity={0.5}
        style={styles.appBtn}>
        <Text style={styles.btnTitle}>TẠO PHÒNG</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 16,
    width: WIDTH,
    height: HEIGHT,
    paddingHorizontal: 20,
  },
  titleTxt: {
    color: ColorPalette.white,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  btnTitle: {
    fontWeight: '700',
    color: ColorPalette.white,
  },
  appBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
});
