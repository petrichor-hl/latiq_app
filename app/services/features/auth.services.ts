import { Endpoints } from '../../base/constants/endpoints';
import { consoleStyle } from '../../configs/console-style.config';
import { reset } from '../../navigation/navation.config';
import { LoginInfo } from '../../screens/auth/login/login.form';
import { LoginResponse } from '../../screens/auth/login/login.type';
import { zustandAuth } from '../../zustand/auth.zustand';
import { ApiClient } from '../api-client/api-client';
import { ScreenName } from '../../base/constants/screen-name';
import { HomeScreenProps } from '../../screens/home.screen';

interface JwtToken {
  accessToken: string;
  refreshToken: string;
}

export const AuthService = {
  login: async (payload: LoginInfo) => {
    try {
      const response = await ApiClient<LoginInfo, LoginResponse>({
        endpoint: Endpoints.Account.LOGIN,
        method: 'post',
        data: payload,
      });
      zustandAuth.getState().updateAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      reset<HomeScreenProps>(ScreenName.HOME);
    } catch {
      console.log('Login Fail');
    }
  },

  refreshToken: async (payload: JwtToken): Promise<boolean> => {
    try {
      const response = await ApiClient<JwtToken, JwtToken>({
        endpoint: Endpoints.Account.GENERATE_NEW_JWT_TOKEN,
        method: 'post',
        data: payload,
      });
      zustandAuth.getState().updateAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      console.log(
        consoleStyle.bg.green,
        consoleStyle.fg.yellow,
        '[Access Token] ',
        consoleStyle.bg.black,
        consoleStyle.fg.yellow,
        `Bearer ${response.accessToken}`,
        consoleStyle.reset,
      );
      console.log(
        consoleStyle.bg.green,
        consoleStyle.fg.yellow,
        '[Refresh Token] ',
        consoleStyle.bg.black,
        consoleStyle.fg.yellow,
        `${response.refreshToken}`,
        consoleStyle.reset,
      );
      return true;
    } catch {
      zustandAuth.getState().clearToken();
      return false;
    }
  },
};
