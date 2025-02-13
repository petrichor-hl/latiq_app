import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ColorPalette } from '../base/constants/color-palette';
import { useDidMount } from 'rooks';
import { zustandAuth } from '../zustand/auth.zustand';
import { reset } from '../navigation/navation.config';
import { LoginScreen, LoginScreenProps } from './auth/login/login.screen';
import { UserService } from '../services/features/user.services';
import { HomeScreen, HomeScreenProps } from './home/home.screen';
import { hideLoading, showLoading } from '../zustand/loading.zustand';
import { AuthService } from '../services/features/auth.services';
import { loadSounds } from '../base/helpers/sound.helper';

export const SplashScreen = () => {
  useDidMount(async () => {
    await loadSounds();
    checkLoginStatus();
  });

  const checkLoginStatus = async () => {
    showLoading();
    const localToken = {
      accessToken: zustandAuth.getState().accessToken,
      refreshToken: zustandAuth.getState().refreshToken,
    };

    if (localToken.accessToken !== '' && localToken.refreshToken !== '') {
      const isAuthenticated = await AuthService.refreshToken(localToken, false);

      if (isAuthenticated) {
        await UserService.getProfile(false);
        reset<HomeScreenProps>(HomeScreen);
      }
    } else {
      reset<LoginScreenProps>(LoginScreen);
    }
    hideLoading();
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={ColorPalette.white} />
      {/* {isError ? (
        <Text style={styles.errorMsg}>Vui lòng thử lại sau</Text>
      ) : (
        <ActivityIndicator size={'large'} color={ColorPalette.white} />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ColorPalette.secondary,
  },
  errorMsg: {
    fontSize: 18,
    color: ColorPalette.white,
  },
});
