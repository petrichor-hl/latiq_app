import { Endpoints } from '../../base/constants/endpoints';
import { Topic } from '../../screens/make-room/make-room.type';
import { ApiClient } from '../api-client/api-client';

export const TopicService = {
  getListTopic: async (isShowLoading?: boolean) => {
    return await ApiClient<{}, Topic[]>({
      method: 'get',
      endpoint: Endpoints.Topic.GET_LIST_TOPIC,
      loading: isShowLoading,
    });
  },
};
