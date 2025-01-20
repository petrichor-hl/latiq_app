import { useRef, useState } from 'react';
import { PanResponder, TextInput } from 'react-native';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';
import { useDidMount, useWillUnmount } from 'rooks';
import { ColorPalette } from '../../../base/constants/color-palette';
import { WIDTH } from '../../../base/constants/size-screen';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { zustandUser } from '../../../zustand/user.zustand';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { zustandRoom } from '../../../zustand/room.zustand';
import { playSound } from '../../../base/helpers/sound.helper';
import { EnumSoundName } from '../../../base/constants/sound-name';
import { showMessage } from 'react-native-flash-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { navigate } from '../../../navigation/navation.config';
import {
  GameResultScreen,
  GameResultScreenProps,
} from '../../game-result/game-result.screen';
import LottieView from 'lottie-react-native';

interface Point {
  x: number;
  y: number;
}

interface IAnswerItem {
  userNickName: string;
  content: string;
  isCorrect: boolean;
}

export const useGamePlayController = () => {
  const [isShowTextInput, setShowTextInput] = useState(false);
  const { connection } = zustandSignalR.getState();
  const { setUsersInRoom, plusPoint } = zustandRoom.getState();

  const canvasRef = useRef<Canvas | null>(null);
  const [strokeColor, setStrokeColor] = useState(ColorPalette.black);
  const lineWidthRef = useRef(3.5);

  const drawerIdRef = useRef('');
  const [drawerNickName, setDrawerNickName] = useState('');
  const [word, setWord] = useState('');

  const remainingTime = useSharedValue(25); // 100%

  const { user } = zustandUser.getState();

  const [answerList, setAnswerList] = useState<IAnswerItem[]>([]);
  const textInputRef = useRef<TextInput>(null);

  const safeTop = useSafeAreaInsets().top;

  const fireworkRef = useRef<LottieView>(null);
  const tickRef = useRef<LottieView>(null);
  const [isShowFirework, setShowFirework] = useState(false);

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
      'StartNewTurn',
      (userId: string, userNickName: string, keyword: string) => {
        drawerIdRef.current = userId;
        if (userId === zustandUser.getState().user.id) {
          setWord(keyword);
          setShowTextInput(false);
        } else {
          setDrawerNickName(userNickName);
          setShowTextInput(true);
        }
        startProgress();
      },
    );

    connection?.on(
      'AnsweredCorrectly',
      (userId: string, userNickName: string, point: number) => {
        playSound(EnumSoundName.CorrectAnswer);

        setAnswerList(prev =>
          prev.concat({
            userNickName,
            content: 'đã trả lời đúng',
            isCorrect: true,
          }),
        );

        plusPoint(userId, point);
        plusPoint(drawerIdRef.current, point);

        if (userId === user.id) {
          setShowTextInput(false);
          showFireworkAnimation();
        }
      },
    );

    connection?.on('AnsweredWrong', (userNickName: string, answer: string) => {
      setAnswerList(prev =>
        prev.concat({
          userNickName,
          content: answer,
          isCorrect: false,
        }),
      );
    });

    connection?.on('LeaveRoom', (userId: string, userNickName: string) => {
      setUsersInRoom(
        zustandRoom
          .getState()
          .usersInRoom.filter(userInRoom => userInRoom.userId !== userId),
      );

      showMessage({
        message: `${userNickName} đã rời khỏi phòng`,
        position: 'top',
        statusBarHeight: safeTop,
        duration: 2000,
        backgroundColor: ColorPalette.primary,
        style: { alignItems: 'center' },
        titleStyle: { fontSize: 16 },
      });
    });

    connection?.on('EndGame', () => {
      navigate<GameResultScreenProps>(GameResultScreen);
    });
  });

  useWillUnmount(() => {
    connection?.off('BeginPath');
    connection?.off('LineTo');
    connection?.off('ClearPaint');
    connection?.off('SelectDrawer');

    connection?.off('CorrectAnswer');
    connection?.off('IncorrectAnswer');

    connection?.off('LeaveRoom');

    connection?.invoke('LeaveRoom');
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

  const panResponder =
    drawerIdRef.current === zustandUser.getState().user.id
      ? PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          // Callback này được kích hoạt ngay khi người dùng bắt đầu chạm vào màn hình
          onPanResponderStart: () => {},
          // Callback này được kích hoạt ngay sau khi hệ thống quyết định rằng thao tác cảm ứng này sẽ được cấp quyền cho PanResponder
          onPanResponderGrant: evt => {
            const { locationX, locationY } = evt.nativeEvent;
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx) {
              connection?.invoke(
                'BeginPath',
                strokeColor,
                lineWidthRef.current,
                {
                  x: locationX,
                  y: locationY,
                },
              );
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
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    locationX: number,
    locationY: number,
  ) => {
    ctx.lineTo(locationX, locationY);
    ctx.stroke();
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

  const handleAnswer = (answer: string) => {
    textInputRef.current?.clear();
    connection?.invoke('SendAnswer', answer, Math.floor(remainingTime.value));
  };

  const showFireworkAnimation = () => {
    setShowFirework(true);
    fireworkRef.current?.play();
    tickRef.current?.play();
    setTimeout(() => setShowFirework(false), 2500);
  };

  return {
    refs: {
      canvasRef,
      textInputRef,
      fireworkRef,
      tickRef,
    },
    values: {
      isDrawer: drawerIdRef.current === zustandUser.getState().user.id,
      drawerNickName,
      word,
      answerList,
      panResponder,
      remainingTime,
      isShowTextInput,
      isShowFirework,
    },
    actions: {
      setStrokeColor,
      clearPaint: () => {
        clearPaint();
        connection?.invoke('ClearPaint');
      },
      handleAnswer,
    },
  };
};
