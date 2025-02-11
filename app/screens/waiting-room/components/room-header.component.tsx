import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorPalette } from '../../../base/constants/color-palette';
import { goBack } from '../../../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { PhysicalButton } from '../../../base/components/physical-button.component';

interface RoomHeaderProps {
  roomCode: string;
}

export const RoomHeader = (props: RoomHeaderProps) => {
  const { roomCode } = props;
  const { connection } = zustandSignalR.getState();

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
      <PhysicalButton
        paddingVertical={0}
        paddingHorizontal={0}
        width={64}
        onPress={() => {
          connection?.invoke('LeaveRoom');
          goBack();
        }}>
        <Ionicons name={'arrow-undo'} size={28} color={ColorPalette.white} />
      </PhysicalButton>

      <TouchableOpacity
        style={{ flex: 1, alignItems: 'center' }}
        onPress={copyToClipboard}>
        <Text style={styles.roomCodeTitle}>Mã phòng</Text>
        <View
          style={{ flexDirection: 'row', columnGap: 4, alignItems: 'center' }}>
          <Text style={styles.roomCode}>{roomCode}</Text>
          <Ionicons name="copy" size={20} color={ColorPalette.primary} />
        </View>
      </TouchableOpacity>

      <PhysicalButton
        paddingVertical={0}
        paddingHorizontal={0}
        onPress={() => {}}>
        <Ionicons
          name="person-add"
          size={28}
          color={ColorPalette.white}
          style={{ transform: [{ scaleX: -1 }] }}
        />
      </PhysicalButton>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    columnGap: 12,
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
