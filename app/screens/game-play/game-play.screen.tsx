import React, { useRef, useState } from 'react';
import { View, StyleSheet, ImageBackground, PanResponder } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';
import { WIDTH } from '../../base/constants/size-screen';
import { ColorPalette } from '../../base/constants/color-palette';
import Slider from '@react-native-community/slider';
import { useDidMount } from 'rooks';
import { ColorBar } from './components/color-bar.component';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

export interface GamePlayScreenProps {}

export const GamePlayScreen = (_props: GamePlayScreenProps) => {
  const insets = useSafeAreaInsets();
  const activeOpacity = useSharedValue<number>(1);

  const canvasRef = useRef<Canvas | null>(null);
  const [strokeColor, setStrokeColor] = useState(ColorPalette.black);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: () => {
        activeOpacity.value = withTiming(0.2);
      },
      onPanResponderGrant: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
        ctx?.moveTo(locationX, locationY);
      },
      onPanResponderMove: evt => {
        const { locationX, locationY } = evt.nativeEvent;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          draw(ctx, locationX, locationY);
        }
      },
      onPanResponderRelease: () => {
        activeOpacity.value = withTiming(1);
      },
    }),
  ).current;

  const draw = (
    ctx: CanvasRenderingContext2D,
    locationX: number,
    locationY: number,
  ) => {
    ctx.lineTo(locationX, locationY);
    ctx.stroke();
  };

  useDidMount(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = WIDTH;
      canvas.height = WIDTH;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
      }
    }
  });

  const AnimatedColorBar = Animated.createAnimatedComponent(ColorBar);

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View
        {...panResponder.panHandlers}
        style={{ backgroundColor: ColorPalette.white }}>
        <Canvas ref={canvasRef} />
        <AnimatedColorBar
          style={[styles.colorBar, { opacity: activeOpacity }]}
          onColorPressed={color => {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
              ctx.strokeStyle = color;
              setStrokeColor(color);
            }
          }}
        />

        <Animated.View style={[styles.sliderCtn, { opacity: activeOpacity }]}>
          <Slider
            step={0.5}
            value={3}
            // vertical={true}  Note: Only for Window :)
            minimumValue={0}
            maximumValue={5}
            lowerLimit={1}
            onSlidingComplete={value => {
              const ctx = canvasRef.current?.getContext('2d');
              if (ctx) {
                ctx.lineWidth = value;
              }
            }}
            minimumTrackTintColor={strokeColor}
            maximumTrackTintColor={ColorPalette.gray[300]}
            thumbTintColor={strokeColor}
          />
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  colorBar: {
    position: 'absolute',
  },
  sliderCtn: {
    position: 'absolute',
    right: 20,
    bottom: 0,
    width: 200,
  },
});
