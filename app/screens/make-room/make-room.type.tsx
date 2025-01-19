export interface Topic {
  id: string;
  name: string;
  imageUrl: string;
}

export interface Room {
  roomId: string;
  ownerId: string;
  topic: Topic;
  points: number;
  capacity: number;
  isPublic: boolean;
}
