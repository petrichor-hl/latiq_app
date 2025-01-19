import { useRef, useState } from 'react';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { useDidMount } from 'rooks';
import { SharedValue } from 'react-native-reanimated';
import { TextInput } from 'react-native';
import { zustandRoom } from '../../../zustand/room.zustand';
import { playSound } from '../../../base/helpers/sound.helper';
import { EnumSoundName } from '../../../base/constants/sound-name';

export interface IAnswerItem {
  userNickName: string;
  content: string;
  isCorrect: boolean;
}

interface AnswerControllerProps {
  remainingTime: SharedValue<number>;
  setShowTextInput: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAnswerController = (props: AnswerControllerProps) => {
  const { remainingTime, setShowTextInput } = props;

  const { connection } = zustandSignalR();
  const { usersInRoom, plusPoint } = zustandRoom();

  const [answerList, setAnswerList] = useState<IAnswerItem[]>([]);
  const textInputRef = useRef<TextInput>(null);

  const handleAnswer = (answer: string) => {
    textInputRef.current?.clear();
    connection?.invoke('Answer', answer, Math.floor(remainingTime.value));
  };

  useDidMount(() => {
    connection?.on(
      'CorrectAnswer',
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

        setShowTextInput(false);
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
      usersInRoom,
      answerList,
    },
    actions: {
      handleAnswer,
    },
  };
};
