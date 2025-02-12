import { useEffect, useRef } from 'react';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { zustandUser } from '../../../zustand/user.zustand';
import { IUserInRoom } from '../waiting-room.type';
import { zustandRoom } from '../../../zustand/room.zustand';
import { showMessage } from 'react-native-flash-message';
import { ColorPalette } from '../../../base/constants/color-palette';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../../navigation/navation.config';
import {
  GamePlayScreen,
  GamePlayScreenProps,
} from '../../game-play/game-play.screen';
import { Platform } from 'react-native';

interface WaitingRoomSignalRProps {
  getLocalSteam: () => void;
  receiveProducer: () => void;
}

export const useWaitingRoomSignalR = (props: WaitingRoomSignalRProps) => {
  const { getLocalSteam, receiveProducer } = props;

  const { connection } = zustandSignalR.getState();

  const { user } = zustandUser.getState();

  const { roomInfo, usersInRoom, setRoomOwnerId, setUsersInRoom } =
    zustandRoom();
  // const [usersInRoom, setUsersInRoom] = useState<IUserInRoom[]>([]);

  const timeoutRef = useRef<NodeJS.Timeout>();
  const safeTop = useSafeAreaInsets().top;

  useEffect(() => {
    connection?.on('JoinRoom', (newUser: IUserInRoom) => {
      setUsersInRoom(zustandRoom.getState().usersInRoom.concat(newUser));
      showMessage({
        message: `${newUser.userNickName} vừa vào phòng`,
        position: 'top',
        statusBarHeight: safeTop,
        duration: 2000,
        backgroundColor: ColorPalette.primary,
        style: { alignItems: 'center' },
        titleStyle: { fontSize: 16 },
      });
    });

    connection?.on('LeaveRoom', (userId: string, userNickName: string) => {
      setUsersInRoom(
        zustandRoom
          .getState()
          .usersInRoom.filter(userInRoom => userInRoom.userId !== userId),
      );

      showMessage({
        message: `${userNickName} đã rời khỏi phòng`,
        position: 'top',
        statusBarHeight: safeTop,
        duration: 2000,
        backgroundColor: ColorPalette.primary,
        style: { alignItems: 'center' },
        titleStyle: { fontSize: 16 },
      });
    });

    connection?.on('NewRoomOwner', (newOwnerId: string) => {
      setRoomOwnerId(newOwnerId);
      if (user.id === newOwnerId) {
        showMessage({
          message: 'Bây giờ Bạn là chủ phòng',
          position: 'top',
          statusBarHeight: safeTop,
          duration: 2000,
          backgroundColor: ColorPalette.primary,
          style: { alignItems: 'center' },
          titleStyle: { fontSize: 16 },
        });
      }
    });

    connection?.on('ReceiveUserInRooms', (userInRooms: IUserInRoom[]) => {
      setUsersInRoom(userInRooms);
    });

    connection?.on('StartGame', () => {
      navigate<GamePlayScreenProps>(GamePlayScreen);
    });

    // connection?.on(
    //   'ChangeCameraStatus',
    //   (email: string, cameraStatus: CameraStatus) => {
    //     setUsersInRoom(prevUsers =>
    //       prevUsers.map(user =>
    //         user.userEmail === email ? { ...user, cameraStatus } : user,
    //       ),
    //     );
    //   },
    // );

    connection?.invoke('JoinRoom', {
      userId: user.id,
      userNickName: user.nickName,
      userAvatar: user.avatar,
      roomId: roomInfo.roomId,
      // cameraStatus: CameraStatus.On,
    });

    // Đệm 500ms cho giao diện render mượt hơn
    if (Platform.OS === 'android') {
      timeoutRef.current = setTimeout(getLocalSteam, 500);
    }

    if (Platform.OS === 'ios') {
      timeoutRef.current = setTimeout(receiveProducer, 500);
    }

    return () => {
      connection?.off('JoinRoom');
      connection?.off('LeaveRoom');
      connection?.off('NewRoomOwner');
      connection?.off('ReceiveUserInRooms');
      connection?.off('StartGame');

      connection?.off('ReceiveInviteToJoinRoom');

      if (timeoutRef.current) {
        /* Nếu trong vòng 500ms trước khi getLocalSteam mà người dùng thoát khỏi màn hình này
         * thì phải clear Timeout
         * Nếu không, tuy đã rời màn hình waiting-room, nhưng thì sau 500ms
         * App vẫn lấy stream camera và mic
         */
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartGame = () => {
    connection?.invoke('StartGame');
  };

  return {
    ref: {},
    values: {
      isRoomOwner: roomInfo.ownerId === user.id,
      otherUsersInRoom: [...usersInRoom].filter(
        userInRoom => userInRoom.userId !== user.id,
      ),
    },
    actions: {
      handleStartGame,
    },
  };
};
