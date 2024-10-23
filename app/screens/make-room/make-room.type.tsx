import { UserProfile } from '../../base/model/user-profile';

export interface Topic {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Room {
  roomId: string;
  ownerId: string;
  topicId: Topic;
  round: number;
  capacity: number;
  isPublic: boolean;
  users: UserProfile[];
}

export interface PayloadGetRoomInfo {
  roomId: string;
}
