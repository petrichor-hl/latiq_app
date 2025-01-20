import { Alert, BackHandler } from 'react-native';
import { goBack } from '../../../navigation/navation.config';
import { useEffect } from 'react';

export const useBackHandlerController = () => {
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'Hold on!',
        'Bạn có chắc chắn muốn thoát khỏi trò chơi không?',
        [
          {
            text: 'Huỷ',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'Xác nhận', onPress: () => goBack() },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
};
