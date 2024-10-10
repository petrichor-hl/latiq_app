import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { ParamList } from './navation.config';

export interface ScreenWrapperProps {
  screen: any;
}

export const ScreenWrapper = () => {
  const route = useRoute<RouteProp<ParamList, 'ScreenWrapper'>>();
  const { screen: Screen, ...rest } = route.params;

  return <Screen {...rest} />;
};
