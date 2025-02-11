import { create } from 'zustand';
import { UserProfile } from '../base/model/user-profile';
import { immer } from 'zustand/middleware/immer';

interface UserState {
  user: UserProfile;
}

interface UserAction {
  updateProfile: (newProfile: UserProfile) => void;
}

export const zustandUser = create<UserState & UserAction>()(
  immer((set, _get) => ({
    user: {
      id: '',
      email: '',
      nickName: '',
      avatar: '',
      experience: 0,
    },
    updateProfile: newProfile => {
      set(s => {
        s.user = newProfile;
      });
    },
  })),
);
