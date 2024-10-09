import React, { PropsWithChildren } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useDidMount } from 'rooks';

interface SlideInProps extends PropsWithChildren {
  style?: ViewStyle;
  delay?: number;
}

export const SlideIn = (props: SlideInProps) => {
  const { children, style, delay = 0 } = props;

  // Shared value for vertical translation
  const translateY = useSharedValue(500); // Initial position off-screen (above the screen)

  // Animated style for sliding in from bottom to top
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Trigger the animation with delay
  useDidMount(() => {
    const timeoutId = setTimeout(() => {
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 120,
      });
    }, delay); // Delay before starting the animation

    return () => clearTimeout(timeoutId); // Clean up the timeout if the component unmounts
  });

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
};
