import React, { useEffect } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorPalette } from '../../base/constants/color-palette';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { pop } from '../../navigation/navation.config';
import { zustandSignalR } from '../../zustand/signal-r.zustand';
import { zustandAuth } from '../../zustand/auth.zustand';
import { Room } from '../make-room/make-room.type';
import { zustandUser } from '../../zustand/user.zustand';
import { UserProfile } from '../../base/model/user-profile';

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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => pop(2)} style={styles.backBtn}>
          <Ionicons name="arrow-undo" size={44} color={ColorPalette.primary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.roomCodeTitle}>Mã phòng</Text>
          <Text style={styles.roomCode}>{roomInfo.roomId}</Text>
        </View>

        <TouchableOpacity onPress={() => {}} style={{ width: 44 }}>
          <Ionicons name="copy" size={36} color={ColorPalette.primary} />
        </TouchableOpacity>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    alignSelf: 'flex-start',
  },
  roomCodeTitle: {
    color: ColorPalette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomCode: {
    color: ColorPalette.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
