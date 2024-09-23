import { create } from 'zustand';

export interface ModalState {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

export const zustandLoading = create<ModalState>(set => ({
  loading: false,
  showLoading: () => set({ loading: true }),
  hideLoading: () => set({ loading: false }),
}));

export const showLoading = () => {
  __DEV__ && console.log('----showLoading----');
  zustandLoading.getState().showLoading();
};
export const hideLoading = () => {
  __DEV__ && console.log('----hideLoading----');
  zustandLoading.getState().hideLoading();
};
