import { Endpoints } from '../../base/constants/endpoints';
import { UserProfile } from '../../base/model/user-profile';
import { FriendData } from '../../screens/friend-list/friend-list.type';
import { zustandUser } from '../../zustand/user.zustand';
import { ApiClient } from '../api-client/api-client';

export const UserService = {
  getProfile: async (isShowLoading?: boolean) => {
    const response = await ApiClient<{}, UserProfile>({
      method: 'get',
      endpoint: Endpoints.User.GET_PROFILE,
      loading: isShowLoading,
    });
    zustandUser.getState().updateProfile(response);
  },
  updateProfile: async (
    payload: Partial<UserProfile>,
    isShowLoading?: boolean,
  ) => {
    const response = await ApiClient<Partial<UserProfile>, UserProfile>({
      method: 'put',
      endpoint: Endpoints.User.UPDATE_PROFILE,
      data: payload,
      loading: isShowLoading,
    });
    zustandUser.getState().updateProfile(response);
  },
  getFriends: async (isShowLoading?: boolean) => {
    return await ApiClient<{}, FriendData>({
      method: 'get',
      endpoint: Endpoints.User.GET_FRIENDS,
      loading: isShowLoading,
    });
  },
};
