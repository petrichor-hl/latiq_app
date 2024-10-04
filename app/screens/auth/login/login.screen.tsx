import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInfo, loginSchema } from './login.form';
import { ColorPalette } from '../../../base/constants/color-palette';
import { AuthService } from '../../../services/features/auth.services';

export interface LoginScreenProps {}

export const LoginScreen = () => {
  const insets = useSafeAreaInsets();
  const [isEmailFocus, setEmailFocus] = useState(false);
  const [isPasswordFocus, setPasswordFocus] = useState(false);

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
    await AuthService.login(loginInfo);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextInput
            placeholder="email"
            value={field.value}
            onChangeText={field.onChange}
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            style={[styles.textInput, isEmailFocus && styles.textInputFocused]}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <TextInput
            placeholder="password"
            value={field.value}
            onChangeText={field.onChange}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            style={[
              styles.textInput,
              isPasswordFocus && styles.textInputFocused,
            ]}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
        )}
      />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPalette.secondary,
    paddingHorizontal: 20,
    rowGap: 16,
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
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
});
