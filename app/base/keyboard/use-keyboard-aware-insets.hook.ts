import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useKeyboardAwareInsets = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', e =>
      setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardHeight;
};
