import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ColorPalette } from '../base/constants/color-palette';
import { useDidMount } from 'rooks';
import { AuthService } from '../services/features/auth.services';
import { zustandAuth } from '../zustand/auth.zustand';
import { reset } from '../navigation/navation.config';
import { ScreenName } from '../base/constants/screen-name';
import { LoginScreenProps } from './auth/login/login.screen';
import { UserService } from '../services/features/user.services';
import { HomeScreenProps } from './home/home.screen';
import { hideLoading, showLoading } from '../zustand/loading.zustand';

export const SplashScreen = () => {
  useDidMount(() => {
    const checkLoginStatus = async () => {
      showLoading();
      const localToken = {
        accessToken: zustandAuth.getState().accessToken,
        refreshToken: zustandAuth.getState().refreshToken,
      };

      if (localToken.accessToken !== '' && localToken.refreshToken !== '') {
        const isAuthenticated = await AuthService.refreshToken(
          localToken,
          false,
        );

        if (isAuthenticated) {
          await UserService.getProfile(false);
          reset<HomeScreenProps>(ScreenName.HOME);
        }
      } else {
        reset<LoginScreenProps>(ScreenName.LOGIN);
      }
      hideLoading();
    };

    checkLoginStatus();
  });

  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={ColorPalette.white} />
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
});
