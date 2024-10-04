import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ColorPalette } from '../base/constants/color-palette';
import { useDidMount } from 'rooks';
import { AuthService } from '../services/features/auth.services';
import { zustandAuth } from '../zustand/auth.zustand';
import { reset } from '../navigation/navation.config';
import { ScreenName } from '../base/constants/screen-name';
import { LoginScreenProps } from './auth/login/login.screen';

export const SplashScreen = () => {
  useDidMount(() => {
    const checkLoginStatus = async () => {
      const localToken = {
        accessToken: zustandAuth.getState().accessToken,
        refreshToken: zustandAuth.getState().refreshToken,
      };

      if (localToken.accessToken !== '' && localToken.refreshToken !== '') {
        const isAuthenticated = await AuthService.refreshToken(localToken);

        if (isAuthenticated) {
          reset<LoginScreenProps>(ScreenName.HOME);
        }
      } else {
        reset<LoginScreenProps>(ScreenName.LOGIN);
      }
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
