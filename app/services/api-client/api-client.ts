import { ColorPalette } from '../../base/constants/color-palette';
import { zustandAuth } from '../../zustand/auth.zustand';
import { hideLoading, showLoading } from '../../zustand/loading.zustand';
import { zustandGlobalModal } from '../../zustand/modal.zustand';
import { api, createHeader } from './api-client.helper';
import { ApiRequest } from './api-client.type';
import { Endpoints } from '../../base/constants/endpoints';
import { JwtToken } from '../../base/model/jwt-token';
import { CLIENT_ERROR, SERVER_ERROR, TIMEOUT_ERROR } from 'apisauce';
import { reset } from '../../navigation/navation.config';
import { LoginScreenProps } from '../../screens/auth/login/login.screen';
import { ScreenName } from '../../base/constants/screen-name';

export const ApiClient = <ReqType, ResType>(request: ApiRequest<ReqType>) => {
  return new Promise<ResType>(async (resolve, reject) => {
    // Tại sao khi lỗi xảy ra trong ApiClient (đã được xử lý), thì các code phía sau ApiClient không được gọi
    const { endpoint, method, data, loading = true } = request;

    if (loading) {
      showLoading();
    }

    const nameUrlLog = `[${method.toUpperCase()}] - ${endpoint}`;
    console.log(`${nameUrlLog} - ⏰`);

    try {
      /*
        api.post: <T, U = T>
        T là kiểu trả về của API nếu thành công.
        U là kiểu của lỗi (error) hoặc thông tin phụ, mặc định giống với T nếu bạn không chỉ định.
        Ex: await api.post<TokenResponse, ErrorResponse>('/api/token', data);
        */
      const response = await api[method]<ResType>(endpoint, data, {
        headers: createHeader(),
      });

      // ok - Boolean - True if the status code is in the 200's; false otherwise.
      if (response.ok && response.data) {
        console.log(`${nameUrlLog} - ✅`);
        return resolve(response.data);
      }

      // CLIENT_ERROR
      if (response.problem === CLIENT_ERROR) {
        if (
          endpoint === Endpoints.Account.GENERATE_NEW_JWT_TOKEN &&
          response.status === 400
        ) {
          console.log(`${nameUrlLog} - GENERATE_NEW_JWT_TOKEN - ❌`);
          zustandGlobalModal.getState().show({
            title: '- THÔNG BÁO -',
            content: `Phiên đăng nhập hết hạn.\ncode: ${response.status}`,
            buttons: [
              {
                title: 'Đăng nhập lại',
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
          return reject('TOKEN_EXPIRED');
        }
        // UNAUTHORIZED
        if (response.status === 401) {
          try {
            const responseNewToken = await ApiClient<JwtToken, JwtToken>({
              endpoint: Endpoints.Account.GENERATE_NEW_JWT_TOKEN,
              method: 'post',
              data: {
                accessToken: zustandAuth.getState().accessToken,
                refreshToken: zustandAuth.getState().refreshToken,
              },
            });
            zustandAuth.getState().updateAuth({
              accessToken: responseNewToken.accessToken,
              refreshToken: responseNewToken.refreshToken,
            });
            ApiClient(request);
          } catch {
            console.log('ERORR: UNAUTHORIZED - GENERATE_NEW_JWT_TOKEN FAIL');
          }
        } else {
          console.log(`${nameUrlLog} - CLIENT_ERROR - ❌`);
          zustandGlobalModal.getState().show({
            title: '- THÔNG BÁO -',
            content:
              `${response.data}\ncode ${response.status}` ||
              `${response.status} - Yêu cầu lỗi`,
            buttons: [
              {
                title: 'OK',
                onPress: () => zustandGlobalModal.getState().hide(),
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
          return reject(CLIENT_ERROR);
        }
      }

      // SERVER_ERROR
      if (response.problem === SERVER_ERROR) {
        console.log(`${nameUrlLog} - SERVER_ERROR - ❌❌❌`);
        zustandGlobalModal.getState().show({
          title: '- LỖI SERVER -',
          content: `Máy chủ gặp lỗi khi thực hiện yêu cầu\ncode: ${response.status}`,
          buttons: [
            {
              title: 'OK',
              onPress: () => zustandGlobalModal.getState().hide(),
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
        return reject(SERVER_ERROR);
      }

      // TIMEOUT_ERROR
      if (response.problem === TIMEOUT_ERROR) {
        console.log(`${nameUrlLog} - TIMEOUT_ERROR - ❌❌❌`);
        zustandGlobalModal.getState().show({
          title: '- TIMEOUT -',
          content: 'Máy chủ không phản hồi.\nVui lòng thử lại sau.',
          buttons: [
            {
              title: 'OK',
              onPress: () => zustandGlobalModal.getState().hide(),
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
        return reject(TIMEOUT_ERROR);
      }
    } catch (error) {
      console.log(`${nameUrlLog} - UNEXPECTED_ERROR - ❌❌❌`);
      zustandGlobalModal.getState().show({
        title: 'LỖI KHÔNG XÁC ĐỊNH',
        content: 'Đã xảy ra lỗi trong quá trình xử lý.\nVui lòng thử lại sau.',
        buttons: [
          {
            title: 'OK',
            onPress: () => zustandGlobalModal.getState().hide(),
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
      return reject('UNEXPECTED_ERROR');
    } finally {
      if (loading) {
        hideLoading();
      }
    }
  });
};
