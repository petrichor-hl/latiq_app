import { Endpoints } from '../../base/constants/endpoints';
import { UserProfile } from '../../base/model/user-profile';
import { zustandUser } from '../../zustand/user.zustand';
import { ApiClient } from '../api-client/api-client';

export const UserService = {
  getProfile: async (isShowLoading?: boolean) => {
    const response = await ApiClient<void, UserProfile>({
      method: 'get',
      endpoint: Endpoints.User.GET_PROFILE,
      loading: isShowLoading,
    });

    zustandUser.getState().updateProfile(response);
  },
};
