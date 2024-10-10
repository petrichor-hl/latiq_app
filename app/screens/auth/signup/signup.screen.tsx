import React from 'react';
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { AppTextInput } from '../../../base/components/app-text-input.component';
import { useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpInfo, signUpSchema } from '../auth.form';
import { ColorPalette } from '../../../base/constants/color-palette';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../../navigation/navation.config';
import { HEIGHT, WIDTH } from '../../../base/constants/size-screen';
import { AuthService } from '../../../services/features/auth.services';
import { Avatar } from './components/avatar.component';

export interface SignUpScreenProps {}

export const SignUpScreen = () => {
  const insets = useSafeAreaInsets();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInfo>({
    mode: 'onSubmit',
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      nickName: '',
      password: '',
      confirmPassword: '',
      avatar: '4-9', // collection 4 & seed 9
    },
  });

  const onSubmit = async (singUpInfo: SignUpInfo) => {
    console.log(singUpInfo);
    await AuthService.signup(singUpInfo);
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/png/background-0.png')}
      resizeMode="cover"
      style={{ width: WIDTH, height: HEIGHT }}>
      <TouchableOpacity
        onPress={() => goBack()}
        style={[styles.backBtn, { marginTop: insets.top }]}>
        <Ionicons name={'arrow-undo'} size={44} color={ColorPalette.primary} />
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContentCtn,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              paddingBottom: Platform.OS === 'ios' ? insets.bottom : 20,
            },
          ]}>
          <Avatar control={control} />
          <AppTextInput name="email" control={control} error={errors.email} />

          <AppTextInput
            name="nickName"
            control={control}
            placeHoder="nickname"
            error={errors.nickName}
          />

          <AppTextInput
            name="password"
            control={control}
            placeHoder="mật khẩu"
            secureTextEntry
            canSwitchSecure
            error={errors.password}
          />

          <AppTextInput
            name="confirmPassword"
            control={control}
            placeHoder="xác nhận mật khẩu"
            secureTextEntry
            canSwitchSecure
            error={errors.confirmPassword}
          />

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            activeOpacity={0.5}
            style={styles.appBtn}>
            <Text style={styles.btnTitle}>ĐĂNG KÝ</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  scrollViewContentCtn: {
    rowGap: 16,
    paddingHorizontal: 20,
  },
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
  textInputFocused: {
    borderWidth: 3,
    borderColor: ColorPalette.primary,
    paddingHorizontal: 13,
  },
  btnTitle: {
    fontWeight: '700',
    color: ColorPalette.white,
  },
  appBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
});
