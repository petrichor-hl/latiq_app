import { Endpoints } from '../../base/constants/endpoints';
import { MakeRoomForm } from '../../screens/make-room/make-room.form';
import { Room, Topic } from '../../screens/make-room/make-room.type';
import { ApiClient } from '../api-client/api-client';

export const RoomService = {
  makeRoom: async (payload: MakeRoomForm, isShowLoading?: boolean) => {
    return await ApiClient<{}, Room>({
      method: 'post',
      endpoint: Endpoints.Room.MAKE_ROOM,
      data: payload,
      loading: isShowLoading,
    });
  },
  getListTopic: async (isShowLoading?: boolean) => {
    return await ApiClient<{}, Topic[]>({
      method: 'get',
      endpoint: Endpoints.Room.GET_LIST_TOPIC,
      loading: isShowLoading,
    });
  },
};
