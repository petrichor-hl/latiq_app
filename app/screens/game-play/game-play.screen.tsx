import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';
import { WIDTH } from '../../base/constants/size-screen';
import { ColorPalette } from '../../base/constants/color-palette';
import Slider from '@react-native-community/slider';
import { useDidMount } from 'rooks';
import { ColorBar } from './components/color-bar.component';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Spacer } from '../../base/components/spacer.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Stack } from '../../base/types/stack';

export interface GamePlayScreenProps {}

interface Point {
  x: number;
  y: number;
}

interface Path {
  color: string;
  points: Point[];
}

export const GamePlayScreen = (_props: GamePlayScreenProps) => {
  const insets = useSafeAreaInsets();
  const activeOpacity = useSharedValue<number>(1);

  const canvasRef = useRef<Canvas | null>(null);
  const [strokeColor, setStrokeColor] = useState(ColorPalette.black);

  const pathStack = useRef(new Stack<Path>());

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        // Callback này được kích hoạt ngay khi người dùng bắt đầu chạm vào màn hình
        onPanResponderStart: () => {
          activeOpacity.value = withTiming(0.2);
        },
        // Callback này được kích hoạt ngay sau khi hệ thống quyết định rằng thao tác cảm ứng này sẽ được cấp quyền cho PanResponder
        onPanResponderGrant: evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            ctx.beginPath();
            ctx.moveTo(locationX, locationY);
            ctx.strokeStyle = strokeColor;
            pathStack.current.push({
              color: strokeColor,
              points: [{ x: locationX, y: locationY }],
            });
          }
        },
        onPanResponderMove: evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            draw(ctx, locationX, locationY);
            pathStack.current
              .peek()
              ?.points.push({ x: locationX, y: locationY });
          }
        },
        onPanResponderRelease: () => {
          activeOpacity.value = withTiming(1);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strokeColor],
  );

  const draw = (
    ctx: CanvasRenderingContext2D,
    locationX: number,
    locationY: number,
  ) => {
    // console.log(`x = ${locationX}, y = ${locationY}`);
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

  const undoDraw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && pathStack.current.pop()) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // Xóa canvas
      pathStack.current.forEach(path => {
        const points = path.points;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.strokeStyle = path.color;
        for (let i = 1; i < points.length; ++i) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      });
    }
  };

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
        <Animated.View
          style={[styles.topControlsCtn, { opacity: activeOpacity }]}>
          <ColorBar onColorPressed={color => setStrokeColor(color)} />
          <Spacer />
          <TouchableOpacity onPress={undoDraw}>
            <Ionicons name="arrow-undo-outline" size={32} />
          </TouchableOpacity>
        </Animated.View>
        <Slider
          style={styles.sliderCtn}
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
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topControlsCtn: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  sliderCtn: {
    position: 'absolute',
    right: 16,
    bottom: 0,
    width: 200,
  },
});
