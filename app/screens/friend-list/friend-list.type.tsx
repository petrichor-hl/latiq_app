export interface Friend {
  friendId: string;
  userId: string;
  email: string;
  nickName: string;
  avatar: string;
  isOnline: boolean;
}

export interface FriendData {
  sendRequests: Friend[];
  receiveRequests: Friend[];
  friends: Friend[];
}
