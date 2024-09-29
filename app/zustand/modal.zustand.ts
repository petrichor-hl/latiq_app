import { TextStyle, ViewStyle } from 'react-native';
import { create } from 'zustand';
import { hideLoading } from './loading.zustand';

interface ModalButton {
  onPress: () => void;
  title: string;
  buttonStyle: {
    title: TextStyle;
    container: ViewStyle;
  };
}

interface GlobalModalState {
  visible: boolean;
  title: string;
  content: string;
  buttons: ModalButton[];
}

interface GlobalModalAction {
  show: (state: PayloadGlobalModal) => void;
  hide: () => void;
}

type PayloadGlobalModal = Omit<GlobalModalState, 'visible'>;

export const zustandGlobalModal = create<GlobalModalState & GlobalModalAction>(
  (set, _) => ({
    visible: false,
    title: '',
    content: '',
    buttons: [],
    show: state => {
      hideLoading();
      set({
        ...state,
        visible: true,
      });
    },
    hide: () => {
      set({ visible: false });
    },
  }),
);
