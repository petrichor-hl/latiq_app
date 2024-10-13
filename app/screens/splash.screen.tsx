import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { ColorPalette } from '../base/constants/color-palette';
import { useDidMount } from 'rooks';
import { zustandAuth } from '../zustand/auth.zustand';
import { reset } from '../navigation/navation.config';
import { LoginScreen, LoginScreenProps } from './auth/login/login.screen';
import { UserService } from '../services/features/user.services';
import { HomeScreen, HomeScreenProps } from './home/home.screen';
import { hideLoading, showLoading } from '../zustand/loading.zustand';
import { AuthService } from '../services/features/auth.services';
import { zustandSignalR } from '../zustand/signal-r.zustand';
import { zustandGlobalModal } from '../zustand/modal.zustand';

export const SplashScreen = () => {
  const initializeConnection = zustandSignalR.getState().initializeConnection;
  const [isError, setError] = useState(false);

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
          await initializeConnection(zustandAuth.getState().accessToken);
          if (zustandSignalR.getState().isConnected) {
            reset<HomeScreenProps>(HomeScreen);
          } else {
            zustandGlobalModal.getState().show({
              title: '- THÔNG BÁO -',
              content: 'Không thể tạo kết nối thời gian thực đến máy chủ',
              buttons: [
                {
                  title: 'OK',
                  onPress: () => {
                    zustandGlobalModal.getState().hide();
                    setError(true);
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
      } else {
        reset<LoginScreenProps>(LoginScreen);
      }
      hideLoading();
    };

    checkLoginStatus();
  });

  return (
    <View style={styles.container}>
      {isError ? (
        <Text style={styles.errorMsg}>Vui lòng thử lại sau</Text>
      ) : (
        <ActivityIndicator size={'large'} color={ColorPalette.white} />
      )}
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
