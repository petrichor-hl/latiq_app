import React from 'react';
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInfo, loginSchema } from '../auth.form';
import { ColorPalette } from '../../../base/constants/color-palette';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { push } from '../../../navigation/navation.config';
import { SignUpScreen, SignUpScreenProps } from '../signup/signup.screen';
import { AppTextInput } from '../../../base/components/app-text-input.component';
import { AuthService } from '../../../services/features/auth.services';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { zustandGlobalModal } from '../../../zustand/modal.zustand';
import { zustandAuth } from '../../../zustand/auth.zustand';

export interface LoginScreenProps {}

export const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const initializeConnection = zustandSignalR.getState().initializeConnection;
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginInfo>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (loginInfo: LoginInfo) => {
    const isLogged = await AuthService.login(loginInfo);
    if (isLogged) {
      await initializeConnection(zustandAuth.getState().accessToken);
      if (!zustandSignalR.getState().isConnected) {
        zustandGlobalModal.getState().show({
          title: '- THÔNG BÁO -',
          content: 'Không thể tạo kết nối thời gian thực đến máy chủ',
          buttons: [
            {
              title: 'OK',
              onPress: () => {
                zustandGlobalModal.getState().hide();
              },
              buttonStyle: {
                title: {
                  color: ColorPalette.white,
                  fontSize: 15,
                  fontWeight: '700',
                },
                container: {
                  backgroundColor: ColorPalette.primary,
                  borderRadius: 8,
                },
              },
            },
          ],
        });
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/background/background-0.png')}
      resizeMode="cover"
      style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Image
        source={require('../../../assets/images/png/latiq_logo.png')}
        resizeMode="contain"
        style={styles.logoLaTiQ}
      />
      <KeyboardAvoidingView
        style={{ alignSelf: 'stretch', rowGap: 14 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <AppTextInput name="email" control={control} />

        <AppTextInput
          name="password"
          control={control}
          placeHoder="mật khẩu"
          secureTextEntry
          canSwitchSecure
        />
      </KeyboardAvoidingView>

      <TouchableOpacity
        hitSlop={14}
        onPress={() => {}}
        style={styles.alignSeftFlexStart}>
        <Text style={styles.btnTitle}>Quên mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={!isValid}
        activeOpacity={0.5}
        style={[
          styles.appBtn,
          !isValid && { backgroundColor: ColorPalette.disableBg },
        ]}>
        <Text style={styles.btnTitle}>ĐĂNG NHẬP</Text>
      </TouchableOpacity>

      <Text style={{ color: ColorPalette.white }}>Hoặc</Text>

      <TouchableOpacity
        onPress={() => push<SignUpScreenProps>(SignUpScreen)}
        hitSlop={18}
        style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.btnTitle, { fontSize: 16 }]}>
          Tạo tài khoản mới{' '}
        </Text>
        <Ionicons name={'arrow-forward'} size={20} color={ColorPalette.white} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    rowGap: 14,
  },
  logoLaTiQ: {
    height: 200,
    width: 230,
    marginBottom: 30,
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
  alignSeftFlexStart: {
    alignSelf: 'flex-start',
  },
  btnTitle: {
    fontWeight: '700',
    color: ColorPalette.white,
  },
  appBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
});
