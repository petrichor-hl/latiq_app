import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { zustandSignalR } from '../../zustand/signal-r.zustand';
import { zustandAuth } from '../../zustand/auth.zustand';
import { Room } from '../make-room/make-room.type';
import { zustandUser } from '../../zustand/user.zustand';
import { UserProfile } from '../../base/model/user-profile';
import { RoomHeader } from './components/room-header.component';

export interface WaitingRoomScreenProps {
  roomInfo: Room;
}

export const WaitingRoomScreen = (props: WaitingRoomScreenProps) => {
  const { roomInfo } = props;

  const insets = useSafeAreaInsets();
  const { connection, isConnected, initializeConnection, stopConnection } =
    zustandSignalR();

  useEffect(() => {
    if (!isConnected) {
      initializeConnection(zustandAuth.getState().accessToken);
    } else {
      connection?.invoke('JoinRoom', {
        userEmail: zustandUser.getState().user.email,
        roomId: roomInfo.roomId,
      });

      connection?.on('JoinRoom', (userProfile: UserProfile) => {
        console.log(`${userProfile.email} just joined room`);
      });

      connection?.on('LeaveRoom', (userEmail: string) => {
        console.log(`${userEmail} just left room`);
      });
    }

    return () => {
      if (isConnected) {
        connection?.invoke('LeaveRoom');
        setTimeout(() => stopConnection(), 2000);
      }
    };
  }, [isConnected]);

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <RoomHeader roomCode={roomInfo.roomId} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 16,
    width: WIDTH,
    height: HEIGHT,
    paddingHorizontal: 20,
  },
});
