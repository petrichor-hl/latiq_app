import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ColorPalette } from '../../../base/constants/color-palette';

// interface AppTextInputProps {
//   name: string;
//   control: Control<any, any>;
//   placeHoder?: string;
//   defaultValue?: string;
//   secureTextEntry?: boolean;
//   canSwitchSecure?: boolean;
//   error?: FieldError;
// }

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

  return (
    <Animated.View style={[styles.textInputWrap, borderColorAnimStyle]}>
      <TextInput
        placeholder={'Nhập mã phòng'}
        placeholderTextColor={ColorPalette.gray[400]}
        value={code}
        onChangeText={setCode}
        onFocus={() => handleFocus()}
        onBlur={() => handleBlur()}
        style={styles.textInput}
        autoCapitalize={'characters'}
        autoCorrect={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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
  suffixIconBtn: {
    marginRight: 13,
  },
  errorMessage: {
    color: ColorPalette.red[500],
    fontSize: 15,
    marginTop: 4,
    fontWeight: 'bold',
  },
});
