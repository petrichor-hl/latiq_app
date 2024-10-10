import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';
import { ScreenWrapperProps } from './screen-wrapper';
import { ScreenName } from '../base/constants/screen-name';

export type ParamList = {
  ScreenWrapper: ScreenWrapperProps;
};

export const refNavigation = createNavigationContainerRef<ParamList>();

export const push = async <T>(
  screen: (params: any) => React.JSX.Element,
  screenParams?: T,
) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  refNavigation.dispatch(
    StackActions.push(ScreenName.SCREEN_WRAPPER, {
      screen,
      ...screenParams,
    }),
  );
};

export const navigate = async <T>(
  screen: (params: any) => React.JSX.Element,
  screenParams?: T,
) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  refNavigation.dispatch(
    CommonActions.navigate({
      name: ScreenName.SCREEN_WRAPPER,
      params: { screen, ...screenParams },
    }),
  );
};

export const reset = async <T>(
  screen: (params: any) => React.JSX.Element,
  screenParams?: T,
) => {
  if (!refNavigation.isReady()) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  refNavigation.reset({
    index: 0,
    routes: [
      {
        name: ScreenName.SCREEN_WRAPPER,
        params: { screen, ...screenParams },
      },
    ],
  });
};

export const goBack = () => {
  refNavigation.current?.canGoBack && refNavigation.goBack();
};
