import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { DraftScreenProps } from '../screens/draft.screen';

export type ParamList = {
  Home: undefined;
  Draft: DraftScreenProps;
};

export const refNavigation = createNavigationContainerRef<ParamList>();

export const navigate = async <T = {}>(name: string, params?: T) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // refNavigation.dispatch(
  //   CommonActions.navigate({ name, params: { ...params } }),
  // );

  refNavigation.dispatch(
    StackActions.push(name, {
      ...params,
    }),
  );
};

export const goBack = () => {
  refNavigation.current?.canGoBack && refNavigation.goBack();
  // refNavigation.dispatch(StackActions.pop());
};
