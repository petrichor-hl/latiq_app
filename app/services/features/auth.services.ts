import { Endpoints } from '../../base/constants/endpoints';
import { consoleStyle } from '../../configs/console-style.config';
import { reset } from '../../navigation/navation.config';
import { LoginInfo, SignUpInfo } from '../../screens/auth/auth.form';
import { zustandAuth } from '../../zustand/auth.zustand';
import { ApiClient } from '../api-client/api-client';
import { ScreenName } from '../../base/constants/screen-name';
import { HomeScreenProps } from '../../screens/home/home.screen';
import { LoginScreenProps } from '../../screens/auth/login/login.screen';
import { LoginResponse } from '../../screens/auth/auth.type';
import { zustandGlobalModal } from '../../zustand/modal.zustand';
import { ColorPalette } from '../../base/constants/color-palette';
import { UserService } from './user.services';
import { hideLoading, showLoading } from '../../zustand/loading.zustand';

interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

const printToken = (token: JwtToken) => {
  console.log(
    consoleStyle.bg.green,
    consoleStyle.fg.yellow,
    '[Access Token] ',
    consoleStyle.bg.black,
    consoleStyle.fg.yellow,
    `Bearer ${token.accessToken}`,
    consoleStyle.reset,
  );
  console.log(
    consoleStyle.bg.green,
    consoleStyle.fg.yellow,
    '[Refresh Token] ',
    consoleStyle.bg.black,
    consoleStyle.fg.yellow,
    token.refreshToken,
    consoleStyle.reset,
  );
};

export const AuthService = {
  login: async (payload: LoginInfo) => {
    showLoading();
    try {
      const response = await ApiClient<LoginInfo, LoginResponse>({
        endpoint: Endpoints.Account.LOGIN,
        method: 'post',
        data: payload,
        loading: false,
      });
      zustandAuth.getState().updateAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      printToken({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      await UserService.getProfile(false);
      reset<HomeScreenProps>(ScreenName.HOME);
    } catch {
      console.log('Login Failed');
    }
    hideLoading();
  },
  signup: async (payload: SignUpInfo) => {
    try {
      await ApiClient<LoginInfo, LoginResponse>({
        endpoint: Endpoints.Account.REGISTER,
        method: 'post',
        data: payload,
      });

      zustandGlobalModal.getState().show({
        title: '- ĐĂNG KÝ THÀNH CÔNG -',
        content: `Kiểm tra hộp thư email ${payload.email} để xác nhận tài khoản.`,
        buttons: [
          {
            title: 'OK',
            onPress: () => {
              zustandGlobalModal.getState().hide();
              reset<LoginScreenProps>(ScreenName.LOGIN);
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
    } catch {
      console.log('SignUp Failed');
    }
  },
  logout: async () => {
    try {
      await ApiClient<{}, {}>({
        endpoint: Endpoints.Account.LOGOUT,
        method: 'get',
      });
      zustandAuth.getState().clearToken();
      reset<LoginScreenProps>(ScreenName.LOGIN);
    } catch {
      console.log('Logout Failed');
    }
  },
  refreshToken: async (
    payload: JwtToken,
    isShowLoading?: boolean,
  ): Promise<boolean> => {
    try {
      const response = await ApiClient<JwtToken, JwtToken>({
        endpoint: Endpoints.Account.GENERATE_NEW_JWT_TOKEN,
        method: 'post',
        data: payload,
        loading: isShowLoading,
      });
      zustandAuth.getState().updateAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      printToken({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      return true;
    } catch {
      zustandAuth.getState().clearToken();
      return false;
    }
  },
};
