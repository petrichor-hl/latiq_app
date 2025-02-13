import React, { useEffect } from 'react';
import { Appearance, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalLoading } from './app/base/components/global-loading.component';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { refNavigation } from './app/navigation/navation.config';
import { GlobalModal } from './app/base/components/global-modal.component';
import { ScreenName } from './app/base/constants/screen-name';
import { MenuProvider } from 'react-native-popup-menu';
import { ColorPalette } from './app/base/constants/color-palette';
import { SplashScreen } from './app/screens/splash.screen';
import { ScreenWrapper } from './app/navigation/screen-wrapper';
import { HomeScreen } from './app/screens/home/home.screen';
import 'react-native-url-polyfill/auto';
// import { CodePushContainer } from './app/codepush/code-push-container.component';
import { registerGlobals } from 'react-native-webrtc';
import FlashMessage from 'react-native-flash-message';

registerGlobals();

const ignoreWarnings = [
  'Non-serializable values were found in the navigation state',
  'Warning: No client method with the name',
];

const originalWarn = console.warn;
console.warn = (...args) => {
  if (!ignoreWarnings.some(warning => args[0].includes(warning))) {
    originalWarn(...args);
  }
};

const App = (): React.JSX.Element => {
  useEffect(() => {
    Appearance.setColorScheme('light');
    Platform.OS === 'android' && StatusBar.setTranslucent(true);
    Platform.OS === 'android' &&
      StatusBar.setBackgroundColor(ColorPalette.transparent);
    StatusBar.setBarStyle('light-content');
  }, []);

  const Stack = createNativeStackNavigator();

  return (
    // <CodePushContainer>
    <SafeAreaProvider>
      <MenuProvider>
        <NavigationContainer ref={refNavigation}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              orientation: 'portrait',
            }}>
            <Stack.Screen name={ScreenName.SPLASH} component={SplashScreen} />
            <Stack.Screen
              name={ScreenName.SCREEN_WRAPPER}
              component={ScreenWrapper}
              initialParams={{ screen: HomeScreen }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        <GlobalModal />
      </MenuProvider>
      <FlashMessage />
      <GlobalLoading />
    </SafeAreaProvider>
    // </CodePushContainer>
  );
};

export default App;
