import { Endpoints } from '../../base/constants/endpoints';
import { MakeRoomForm } from '../../screens/make-room/make-room.form';
import {
  PayloadGetRoomInfo,
  Room,
} from '../../screens/make-room/make-room.type';
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
  getRoomInfo: async (payload: PayloadGetRoomInfo, isShowLoading?: boolean) => {
    return await ApiClient<{}, Room>({
      method: 'get',
      endpoint: Endpoints.Room.GET_ROOM,
      data: payload,
      loading: isShowLoading,
    });
  },
};
