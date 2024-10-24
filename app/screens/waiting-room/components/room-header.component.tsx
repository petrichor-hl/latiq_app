import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorPalette } from '../../../base/constants/color-palette';
import { pop } from '../../../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Room } from '../../make-room/make-room.type';

interface RoomHeaderProps {
  roomInfo: Room;
}

export const RoomHeader = (props: RoomHeaderProps) => {
  const { roomInfo } = props;
  const safeTop = useSafeAreaInsets().top;
  const copyToClipboard = () => {
    Clipboard.setString(roomInfo.roomId);
    showMessage({
      message: 'Đã sao chép Mã phòng',
      position: 'top',
      statusBarHeight: safeTop,
      duration: 2000,
      backgroundColor: ColorPalette.primary,
      style: { alignItems: 'center' },
      titleStyle: { fontSize: 16 },
    });
  };

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => pop(2)} style={styles.backBtn}>
        <Ionicons name="arrow-undo" size={44} color={ColorPalette.primary} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.roomCodeTitle}>{roomInfo.topic.name}</Text>
        <Text style={styles.roomCode}>{roomInfo.roomId}</Text>
      </View>

      <TouchableOpacity onPress={copyToClipboard} style={{ width: 44 }}>
        <Ionicons name="copy" size={36} color={ColorPalette.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomCode: {
    color: ColorPalette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
