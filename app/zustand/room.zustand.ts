import { create } from 'zustand/react';
import { Room } from '../screens/make-room/make-room.type';
import { IUserInRoom } from '../screens/waiting-room/waiting-room.type';
import { immer } from 'zustand/middleware/immer';

interface RoomState {
  roomInfo: Room;
  usersInRoom: IUserInRoom[];
}

interface RoomAction {
  setRoomInfo: (room: Room) => void;
  setRoomOwnerId: (newOwnerEmail: string) => void;
  setUsersInRoom: (users: IUserInRoom[]) => void;
  plusPoint: (userId: string, point: number) => void;
}

export const zustandRoom = create<RoomState & RoomAction>()(
  immer((set, get) => ({
    roomInfo: undefined as any,
    usersInRoom: [],
    setRoomInfo: room => {
      set(s => {
        s.roomInfo = room;
      });
    },
    setRoomOwnerId: newOwnerId => {
      set(s => {
        s.roomInfo.ownerId = newOwnerId;
      });
    },
    setUsersInRoom: users => {
      set(s => {
        s.usersInRoom = users;
      });
    },
    plusPoint: (userId: string, point: number) => {
      const userIndex = get().usersInRoom.findIndex(u => u.userId === userId);
      if (userIndex > -1) {
        set(s => {
          s.usersInRoom[userIndex].userPoints += point;
        });
      }
    },
  })),
);
