import React, { useEffect } from 'react';
import {
  Appearance,
  Button,
  Keyboard,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useKeyboardAwareInsets } from './app/base/keyboard/use-keyboard-aware-insets.hook';
import { showLoading } from './app/zustand/loading.zustand';
import { GlobalLoading } from './app/base/components/global-loading.component';

function App(): React.JSX.Element {
  useEffect(() => Appearance.setColorScheme('light'), []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <HomeScreen />
      <GlobalLoading />
    </SafeAreaProvider>
  );
}

const HomeScreen = () => {
  const [number, onChangeNumber] = React.useState('');
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button onPress={() => Keyboard.dismiss()} title="dismiss keyboard" />
        <Button onPress={() => showLoading()} title="show loading" />
      </View>
      <View
        style={{
          padding: 14,
          backgroundColor: '#00F8',
          paddingBottom: Math.max(insets.bottom, useKeyboardAwareInsets()) + 14,
        }}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeNumber}
          value={number}
          placeholder="useless placeholder"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 14,
    color: 'black',
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
  },
});

export default App;
