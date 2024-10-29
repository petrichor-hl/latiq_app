export interface Topic {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Room {
  roomId: string;
  ownerId: string;
  topic: Topic;
  round: number;
  capacity: number;
  isPublic: boolean;
}

export interface PayloadGetRoomInfo {
  roomId: string;
}
