import React, { useEffect } from 'react';
import { Appearance, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalLoading } from './app/base/components/global-loading.component';
import { DraftScreen } from './app/screens/draft.screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { refNavigation } from './app/navigation/navation.config';
import { HomeScreen } from './app/screens/home.screen';
import { GlobalModal } from './app/base/components/global-modal.component';
import { ScreenName } from './app/base/constants/screen-name';
import { PickAvatarScreen } from './app/screens/pick-avatar/pick-avatar.screen';
import { MenuProvider } from 'react-native-popup-menu';
import { ColorPalette } from './app/base/constants/color-palette';

function App(): React.JSX.Element {
  useEffect(() => {
    Appearance.setColorScheme('light');
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    Platform.OS === 'android' &&
      StatusBar.setBackgroundColor(ColorPalette.transparent);
    StatusBar.setBarStyle('light-content');
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      <MenuProvider>
        <NavigationContainer ref={refNavigation}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              orientation: 'portrait',
            }}>
            <Stack.Screen
              name={ScreenName.PICK_AVATAR}
              component={PickAvatarScreen}
            />
            <Stack.Screen name={ScreenName.HOME} component={HomeScreen} />
            <Stack.Screen name={ScreenName.DRAFT} component={DraftScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </MenuProvider>
      <GlobalLoading />
      <GlobalModal />
    </SafeAreaProvider>
  );
}

export default App;
