import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorPalette } from '../../../base/constants/color-palette';
import { goBack } from '../../../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';

interface RoomHeaderProps {
  roomCode: string;
}

export const RoomHeader = (props: RoomHeaderProps) => {
  const { roomCode } = props;

  const { stopConnection } = zustandSignalR.getState();

  const safeTop = useSafeAreaInsets().top;

  const copyToClipboard = () => {
    Clipboard.setString(roomCode);
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
      <TouchableOpacity
        onPress={() => {
          stopConnection();
          goBack();
        }}
        style={styles.backBtn}>
        <Ionicons name="arrow-undo" size={44} color={ColorPalette.primary} />
      </TouchableOpacity>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.roomCodeTitle}>Mã phòng</Text>
        <Text style={styles.roomCode}>{roomCode}</Text>
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
    paddingHorizontal: 20,
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
