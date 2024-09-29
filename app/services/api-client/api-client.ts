import { ColorPalette } from '../../base/constants/color-palette';
import { zustandAuth } from '../../zustand/auth.zustand';
import { hideLoading, showLoading } from '../../zustand/loading.zustand';
import { zustandGlobalModal } from '../../zustand/modal.zustand';
import { api, createHeader } from './api-client.helper';
import { ApiRequest } from './api-client.type';
import { Endpoints } from '../../base/constants/endpoints';
import { JwtToken } from '../../base/model/jwt-token';
import { CLIENT_ERROR, SERVER_ERROR, TIMEOUT_ERROR } from 'apisauce';

export const ApiClient = <ReqType, ResType>(request: ApiRequest<ReqType>) => {
  return new Promise<ResType>(async (resolve, _) => {
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
        // UNAUTHORIZED
        if (response.status === 401) {
          // -> HANDLE REFRESH TOKEN
          const newTokenResult = await api.post<JwtToken>(
            Endpoints.Account.GENERATE_NEW_JWT_TOKEN,
            {
              accessToken: zustandAuth.getState().accessToken,
              refreshToken: zustandAuth.getState().refreshToken,
            },
          );

          if (newTokenResult.ok && newTokenResult.data) {
            zustandAuth.getState().updateAuth({
              accessToken: newTokenResult.data.accessToken,
              refreshToken: newTokenResult.data.refreshToken,
            });
            ApiClient(request);
          } else {
            console.log(`${nameUrlLog} - UNAUTHORIZED - ❌`);
            zustandGlobalModal.getState().show({
              title: '- THÔNG BÁO -',
              content: 'Phiên đăng nhập hết hạn.',
              buttons: [
                {
                  title: 'Đăng nhập lại',
                  onPress: () => zustandGlobalModal.getState().hide(),
                  buttonStyle: {
                    title: {
                      color: ColorPalette.white,
                      fontSize: 15,
                      fontWeight: '500',
                    },
                    container: {
                      backgroundColor: ColorPalette.green['600'],
                      borderRadius: 8,
                    },
                  },
                },
              ],
            });
          }
        } else {
          console.log(`${nameUrlLog} - CLIENT_ERROR - ❌`);
          zustandGlobalModal.getState().show({
            title: '- THÔNG BÁO -',
            content: (response.data as string) || 'Yêu cầu lỗi',
            buttons: [
              {
                title: 'OK',
                onPress: () => zustandGlobalModal.getState().hide(),
                buttonStyle: {
                  title: {
                    color: ColorPalette.white,
                    fontSize: 15,
                    fontWeight: '500',
                  },
                  container: {
                    backgroundColor: ColorPalette.green['600'],
                    borderRadius: 8,
                  },
                },
              },
            ],
          });
        }
      }

      // SERVER_ERROR
      if (response.problem === SERVER_ERROR) {
        console.log(`${nameUrlLog} - SERVER_ERROR - ❌❌❌`);
        zustandGlobalModal.getState().show({
          title: '- LỖI SERVER -',
          content: 'Máy chủ gặp lỗi khi thực hiện yêu cầu',
          buttons: [
            {
              title: 'OK',
              onPress: () => zustandGlobalModal.getState().hide(),
              buttonStyle: {
                title: {
                  color: ColorPalette.white,
                  fontSize: 15,
                  fontWeight: '500',
                },
                container: {
                  backgroundColor: ColorPalette.green['600'],
                  borderRadius: 8,
                },
              },
            },
          ],
        });
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
                  fontWeight: '500',
                },
                container: {
                  backgroundColor: ColorPalette.green['600'],
                  borderRadius: 8,
                },
              },
            },
          ],
        });
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
                fontWeight: '500',
              },
              container: {
                backgroundColor: ColorPalette.green['600'],
                borderRadius: 8,
              },
            },
          },
        ],
      });
    } finally {
      if (loading) {
        hideLoading();
      }
    }
  });
};
