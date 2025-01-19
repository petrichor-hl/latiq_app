import { useRef, useState } from 'react';
import { PanResponder } from 'react-native';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';
import { useDidMount } from 'rooks';
import { ColorPalette } from '../../../base/constants/color-palette';
import { WIDTH } from '../../../base/constants/size-screen';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import {} from '../../../zustand/auth.zustand';
import { zustandUser } from '../../../zustand/user.zustand';
import { useSharedValue, withTiming } from 'react-native-reanimated';

interface Point {
  x: number;
  y: number;
}

interface DrawControllerProps {
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useDrawController = (props: DrawControllerProps) => {
  const { setShowTextInput } = props;
  const { connection } = zustandSignalR();

  const canvasRef = useRef<Canvas | null>(null);
  const [strokeColor, setStrokeColor] = useState(ColorPalette.black);
  const lineWidthRef = useRef(3.5);

  const [isDrawer, setDrawer] = useState(false);
  const [word, setWord] = useState('');
  const [drawerNickName, setDrawerNickName] = useState('');

  const remainingTime = useSharedValue(25); // 100%

  useDidMount(() => {
    connection?.on(
      'BeginPath',
      (lineColor: string, lineWidth: number, point: Point) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          beginPath(ctx, lineColor, lineWidth, point.x, point.y);
        }
      },
    );

    connection?.on('LineTo', (point: Point) => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        draw(ctx, point.x, point.y);
      }
    });

    connection?.on('ClearPaint', () => {
      clearPaint();
    });

    connection?.on(
      'SelectDrawer',
      (userId: string, userNickName: string, keyword: string) => {
        if (userId === zustandUser.getState().user.id) {
          setDrawer(true);
          setWord(keyword);
          setShowTextInput(false);
        } else {
          setDrawerNickName(userNickName);
          setShowTextInput(true);
        }
        startProgress();
      },
    );
  });

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

  const panResponder = isDrawer
    ? PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        // Callback này được kích hoạt ngay khi người dùng bắt đầu chạm vào màn hình
        onPanResponderStart: () => {},
        // Callback này được kích hoạt ngay sau khi hệ thống quyết định rằng thao tác cảm ứng này sẽ được cấp quyền cho PanResponder
        onPanResponderGrant: evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            connection?.invoke('BeginPath', strokeColor, lineWidthRef.current, {
              x: locationX,
              y: locationY,
            });
            beginPath(
              ctx,
              strokeColor,
              lineWidthRef.current,
              locationX,
              locationY,
            );
          }
        },
        onPanResponderMove: evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            connection?.invoke('LineTo', { x: locationX, y: locationY });
            draw(ctx, locationX, locationY);
          }
        },
        onPanResponderRelease: () => {},
      })
    : undefined;

  const beginPath = (
    ctx: CanvasRenderingContext2D,
    lineColor: string,
    lineWidth: number,
    locationX: number,
    locationY: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(locationX, locationY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    // pathStack.current.push({
    //   color: lineColor,
    //   lineWidth: lineWidth,
    //   points: [{ x: locationX, y: locationY }],
    // });
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    locationX: number,
    locationY: number,
  ) => {
    ctx.lineTo(locationX, locationY);
    ctx.stroke();
    // pathStack.current.peek()?.points.push({ x: locationX, y: locationY });
  };

  const clearPaint = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // Xóa canvas
    }
  };

  const startProgress = () => {
    // cancelAnimation(progress); // Dừng bất kỳ animation đang chạy
    remainingTime.value = 25; // Reset về 100%
    remainingTime.value = withTiming(0, { duration: 25000 }); // Bắt đầu giảm về 0
  };

  return {
    refs: {
      canvasRef,
    },
    values: {
      isDrawer,
      word,
      drawerNickName,
      panResponder,
      strokeColor,
      remainingTime,
    },
    actions: {
      setStrokeColor,
      clearPaint: () => {
        clearPaint();
        connection?.invoke('ClearPaint');
      },
    },
  };
};
