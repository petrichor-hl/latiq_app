import React from 'react';
import { View, Text, Button } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ParamList, refNavigation } from '../navigation/navation.config';

export interface DraftScreenProps {
  text: string;
}

export const DraftScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'Draft'>>();
  const { text } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{text}</Text>
      <Button
        onPress={() => {
          refNavigation.current?.canGoBack && refNavigation.goBack();
        }}
        title="go back"
      />
    </View>
  );
};
