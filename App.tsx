import React, { useEffect } from 'react';
import { Appearance } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalLoading } from './app/base/components/global-loading.component';
import { DraftScreen } from './app/screens/draft.screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { refNavigation } from './app/navigation/navation.config';
import { HomeScreen } from './app/screens/home.screen';
import { GlobalModal } from './app/base/components/global-modal.component';

function App(): React.JSX.Element {
  useEffect(() => Appearance.setColorScheme('light'), []);
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer ref={refNavigation}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            orientation: 'portrait',
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Draft" component={DraftScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <GlobalLoading />
      <GlobalModal />
    </SafeAreaProvider>
  );
}

export default App;
