import { UserProfile } from '../../base/model/user-profile';

export interface Topic {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Room {
  roomId: number;
  ownerId: string;
  users: Omit<UserProfile, 'email'>[];
  topicId: number;
  round: number;
  capacity: number;
  isPublic: boolean;
}
