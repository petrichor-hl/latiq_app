import { useRef, useState } from 'react';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { useDidMount } from 'rooks';
import { SharedValue } from 'react-native-reanimated';
import { TextInput } from 'react-native';
import { zustandRoom } from '../../../zustand/room.zustand';

export interface IAnswerItem {
  userNickName: string;
  content: string;
  isCorrect: boolean;
}

interface AnswerControllerProps {
  remainingTime: SharedValue<number>;
}

export const useAnswerController = (props: AnswerControllerProps) => {
  const { remainingTime } = props;

  const { connection } = zustandSignalR();
  const { plusPoint } = zustandRoom.getState();

  const [answerList, setAnswerList] = useState<IAnswerItem[]>([]);
  const textInputRef = useRef<TextInput>(null);

  const handleAnswer = (answer: string) => {
    console.log(answer);
    console.log(remainingTime.value);
    textInputRef.current?.clear();
    connection?.invoke('Answer', answer, Math.floor(remainingTime.value));
  };

  useDidMount(() => {
    connection?.on(
      'CorrectAnswer',
      (userId: string, userNickName: string, point: number) => {
        setAnswerList(prev =>
          prev.concat({
            userNickName,
            content: 'đã trả lời đúng',
            isCorrect: true,
          }),
        );

        plusPoint(userId, point);
      },
    );

    connection?.on(
      'IncorrectAnswer',
      (userNickName: string, answer: string) => {
        setAnswerList(prev =>
          prev.concat({
            userNickName,
            content: answer,
            isCorrect: false,
          }),
        );
      },
    );
  });

  return {
    refs: {
      textInputRef,
    },
    values: {
      answerList,
    },
    actions: {
      handleAnswer,
    },
  };
};
