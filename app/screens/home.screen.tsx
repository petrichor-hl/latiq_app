import React, { useState } from 'react';
import { View, Button, Keyboard, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette } from '../base/constants/color-palette';
import { useKeyboardAwareInsets } from '../base/keyboard/use-keyboard-aware-insets.hook';
import { navigate } from '../navigation/navation.config';
import { ApiClient } from '../services/api-client/api-client';
import { Endpoints } from '../base/constants/endpoints';
import { zustandAuth } from '../zustand/auth.zustand';
import { AuthService } from '../services/features/auth.services';

export interface HomeScreenProps {}

export const HomeScreen = () => {
  const [number, onChangeNumber] = useState('');
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
        <Button
          onPress={() => navigate('Draft', { text: 'DRAFT --> HELLO THERE' })}
          title="open second screen"
        />

        <Button
          onPress={() =>
            zustandAuth.getState().updateAuth({
              accessToken: '',
              refreshToken: '',
            })
          }
          title="reset MMKV"
        />

        <Button
          onPress={() =>
            ApiClient<any, any>({
              endpoint: Endpoints.Test.AUTHENTICATED,
              method: 'get',
            })
          }
          title={Endpoints.Test.AUTHENTICATED}
        />
        <Button
          onPress={() =>
            ApiClient<any, any>({
              endpoint: Endpoints.Test.TIMEOUT,
              method: 'get',
            })
          }
          title={Endpoints.Test.TIMEOUT}
        />
        <Button
          onPress={() =>
            ApiClient<any, any>({
              endpoint: Endpoints.Test.SERVER_ERROR,
              method: 'get',
            })
          }
          title={Endpoints.Test.SERVER_ERROR}
        />
        <Button
          onPress={() => AuthService.logout()}
          title={Endpoints.Account.LOGOUT}
        />
      </View>
      <View
        style={[
          styles.inputWrapper,
          {
            paddingBottom:
              Math.max(insets.bottom, useKeyboardAwareInsets()) + 14,
          },
        ]}>
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
  inputWrapper: {
    padding: 14,
    backgroundColor: ColorPalette.indigo[500],
  },
});
