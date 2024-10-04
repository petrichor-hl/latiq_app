import { Endpoints } from '../../base/constants/endpoints';
import { LoginInfo } from '../../screens/auth/login/login.form';
import { LoginResponse } from '../../screens/auth/login/login.type';
import { zustandAuth } from '../../zustand/auth.zustand';
import { ApiClient } from '../api-client/api-client';

export const AuthService = {
  login: async (payload: LoginInfo) => {
    const response = await ApiClient<LoginInfo, LoginResponse>({
      endpoint: Endpoints.Account.LOGIN,
      method: 'post',
      data: payload,
    });

    if (response) {
      zustandAuth.getState().updateAuth({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
    }
  },
};
