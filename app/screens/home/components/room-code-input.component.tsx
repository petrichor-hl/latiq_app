import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ColorPalette } from '../../../base/constants/color-palette';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoomService } from '../../../services/features/room.services';
import { push } from '../../../navigation/navation.config';
import {
  WaitingRoomScreen,
  WaitingRoomScreenProps,
} from '../../waiting-room/waiting-room.screen';
import { hideLoading, showLoading } from '../../../zustand/loading.zustand';

export const RoomCodeInput = () => {
  const [code, setCode] = useState('');

  const borderColorAnim = useSharedValue<number>(0); // Giá trị khởi tạo cho border width

  const handleFocus = () => {
    borderColorAnim.value = withSpring(1);
  };

  const handleBlur = () => {
    borderColorAnim.value = withSpring(0);
  };

  const borderColorAnimStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderColorAnim.value,
        [0, 1],
        [ColorPalette.white, ColorPalette.primary],
      ),
    };
  });

  const onSubmitRoomCode = async () => {
    if (code) {
      showLoading();
      Keyboard.dismiss();
      try {
        const roomInfo = await RoomService.getRoomInfo({ roomId: code }, false);
        setTimeout(async () => {
          hideLoading();
          push<WaitingRoomScreenProps>(WaitingRoomScreen, { roomInfo });
        }, 500);
      } catch (error) {
        hideLoading();
      }
    }
  };

  return (
    <View style={styles.rowCtn}>
      <Animated.View style={[styles.textInputWrap, borderColorAnimStyle]}>
        <TextInput
          placeholder={'Nhập mã phòng'}
          placeholderTextColor={ColorPalette.gray[400]}
          value={code}
          onChangeText={setCode}
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          style={styles.textInput}
          autoCorrect={false}
          keyboardType="number-pad"
        />
      </Animated.View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={onSubmitRoomCode}
        style={[styles.appBtn, styles.joinRoomBtn]}>
        <Ionicons
          name="arrow-forward-circle-outline"
          size={32}
          color={ColorPalette.black}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rowCtn: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  textInputWrap: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: ColorPalette.white,
    borderWidth: 3,
  },
  textInput: {
    flex: 1,
    padding: 13,
    backgroundColor: ColorPalette.white,
    borderRadius: 5,
    fontSize: 18,
  },
  appBtn: {
    height: Platform.OS === 'ios' ? 54 : 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
  joinRoomBtn: {
    width: 80,
  },
});
