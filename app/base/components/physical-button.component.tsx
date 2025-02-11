import React, { PropsWithChildren } from 'react';
import { DimensionValue, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ColorPalette } from '../constants/color-palette';
import { playSound } from '../helpers/sound.helper';
import { EnumSoundName } from '../constants/sound-name';

interface PhysicalButtonProps extends PropsWithChildren {
  width?: DimensionValue;
  height?: DimensionValue;
  paddingVertical?: number;
  paddingHorizontal?: number;
  buttonColor?: string;
  buttonBackgroundColor?: string;
  onPress?: () => void;
}

const MIN_WIDTH = 64;
const MIN_HEIGHT = 56;

export const PhysicalButton = (props: PhysicalButtonProps) => {
  const {
    width,
    height,
    paddingVertical = 16,
    paddingHorizontal = 20,
    buttonColor = ColorPalette.primary,
    buttonBackgroundColor = ColorPalette.primaryActive,
    onPress,
    children,
  } = props;

  const y = useSharedValue(0);

  const handlePressIn = () => {
    playSound(EnumSoundName.ButtonClick);
    y.value = withTiming(5, {
      duration: 100, // Thời gian chạy animation
      easing: Easing.ease,
    });
  };

  const handlePressOut = () => {
    y.value = withTiming(0, {
      duration: 100,
      easing: Easing.ease,
    });
  };

  return (
    <Pressable
      style={{
        minWidth: MIN_WIDTH,
        minHeight: MIN_HEIGHT,
        width: width,
        height: height,
      }}
      onPressIn={handlePressIn}
      onPress={onPress}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          // eslint-disable-next-line react-native/no-inline-styles
          {
            flex: height ? 1 : undefined,
            paddingVertical: paddingVertical,
            paddingHorizontal: paddingHorizontal,
            backgroundColor: buttonColor,
            transform: [{ translateY: y }],
          },
        ]}>
        {children}
      </Animated.View>
      <View
        style={[
          styles.buttonBackground,
          { backgroundColor: buttonBackgroundColor },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: MIN_HEIGHT - 8,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonBackground: {
    position: 'absolute',
    borderRadius: 14,
    height: MIN_HEIGHT - 8,
    zIndex: -1,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
