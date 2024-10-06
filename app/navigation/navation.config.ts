import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { DraftScreenProps } from '../screens/draft.screen';
import { SignUpScreenProps } from '../screens/auth/signup/signup.screen';

export type ParamList = {
  Home: undefined;
  Draft: DraftScreenProps;
  SignUp: SignUpScreenProps;
};

export const refNavigation = createNavigationContainerRef<ParamList>();

export const push = async <T>(name: string, params?: T) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  refNavigation.dispatch(
    StackActions.push(name, {
      ...params,
    }),
  );
};

export const navigate = async <T>(name: string, params?: T) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  refNavigation.dispatch(
    CommonActions.navigate({ name, params: { ...params } }),
  );
};

export const reset = async <T>(name: string, params?: T) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  refNavigation.reset({
    index: 0,
    routes: [
      {
        name,
        params: {
          ...params,
        },
      },
    ],
  });
};

export const goBack = () => {
  refNavigation.current?.canGoBack && refNavigation.goBack();
  // refNavigation.dispatch(StackActions.pop());
};
