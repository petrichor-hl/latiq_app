import { useEffect, useRef, useState } from 'react';
import { zustandAuth } from '../../../zustand/auth.zustand';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { zustandUser } from '../../../zustand/user.zustand';
import { CameraStatus, IUserInRoom } from '../waiting-room.type';

interface WaitingRoomSignalRProps {
  roomCode: string;
  getLocalSteam: () => void;
}

export const useWaitingRoomSignalR = (props: WaitingRoomSignalRProps) => {
  const { roomCode, getLocalSteam } = props;

  const { connection, isConnected, initializeConnection, stopConnection } =
    zustandSignalR();

  const [usersInRoom, setUsersInRoom] = useState<IUserInRoom[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isConnected) {
      initializeConnection(zustandAuth.getState().accessToken);
    } else {
      connection?.on('JoinRoom', (newUser: IUserInRoom) => {
        console.log(`${newUser.userEmail} just joined room`);
        setUsersInRoom(prevUsers => prevUsers.concat(newUser));
      });

      connection?.on('LeaveRoom', (userEmail: string) => {
        console.log(`${userEmail} just left room`);
        setUsersInRoom(prevUsers =>
          prevUsers.filter(user => user.userEmail !== userEmail),
        );
      });

      connection?.on('ReceiveUserInRooms', (userInRooms: IUserInRoom[]) => {
        console.log(userInRooms);
        setUsersInRoom(userInRooms);
      });

      connection?.on(
        'ChangeCameraStatus',
        (email: string, cameraStatus: CameraStatus) => {
          setUsersInRoom(prevUsers =>
            prevUsers.map(user =>
              user.userEmail === email ? { ...user, cameraStatus } : user,
            ),
          );
        },
      );

      connection?.invoke('JoinRoom', {
        userEmail: zustandUser.getState().user.email,
        userAvatar: zustandUser.getState().user.avatar,
        cameraStatus: CameraStatus.On,
        roomId: roomCode,
      });

      // Đệm 500ms cho giao diện render mượt hơn
      timeoutRef.current = setTimeout(getLocalSteam, 500);
    }

    return () => {
      if (isConnected) {
        // Đệm 1s cho giao diện render mượt hơn
        setTimeout(() => stopConnection(), 1000);
      }
      if (timeoutRef.current) {
        /* Nếu trong vòng 500ms trước khi getLocalSteam mà người dùng thoát khỏi màn hình này
         * thì phải clear Timeout
         * Nếu không, tuy đã rời màn hình waiting-room, nhưng thì sau 500ms
         * App vẫn lấy stream camera và mic
         */
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isConnected]);

  return {
    // ref: {},
    values: {
      usersInRoom,
    },
    // actions: {},
  };
};
