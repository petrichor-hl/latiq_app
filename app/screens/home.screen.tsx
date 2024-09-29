import React, { useState } from 'react';
import { View, Button, Keyboard, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette } from '../base/constants/color-palette';
import { useKeyboardAwareInsets } from '../base/keyboard/use-keyboard-aware-insets.hook';
import { navigate } from '../navigation/navation.config';
import { showLoading } from '../zustand/loading.zustand';
import { zustandGlobalModal } from '../zustand/modal.zustand';
import { zustandAuth } from '../zustand/auth.zustand';
import { ApiClient } from '../services/api-client/api-client';
import { Endpoints } from '../base/constants/endpoints';

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
        <Button onPress={() => showLoading()} title="show loading" />
        <Button
          onPress={() => navigate('Draft', { text: 'DRAFT --> HELLO THERE' })}
          title="open second screen"
        />
        <Button
          onPress={() =>
            zustandGlobalModal.getState().show({
              title: 'PETRICHOR',
              content:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis nulla erat, placerat id elit ut, viverra commodo urna.',
              buttons: [
                {
                  title: 'OK',
                  onPress: () => zustandGlobalModal.getState().hide(),
                  buttonStyle: {
                    title: { color: ColorPalette.white, fontWeight: 'bold' },
                    container: {
                      backgroundColor: ColorPalette.green['600'],
                      borderRadius: 8,
                    },
                  },
                },
              ],
            })
          }
          title="show global modal"
        />
        <Button
          onPress={() =>
            zustandAuth.getState().updateAuth({
              accessToken:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkODI2NjVmMS1mNzVkLTQ0M2YtYmIyNC0wOGRjZDk5MmZlM2YiLCJqdGkiOiI3ZDMxMjlkYi0xYWYxLTQwNzItOWEzMy05Y2Y4ZGU0MGIyZmMiLCJpYXQiOiIyOS8wOS8yMDI0IDExOjU0OjQ2IEFNIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoibWF0YWJhMzkzM0BzaWdtYXpvbi5jb20iLCJ0b2tlblZlcnNpb24iOiIwIiwiZXhwIjoxNzI3NjExMjQ2LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTQ4IiwiYXVkIjoiKiJ9.5UY0HrW2pQbTYDkbL7vgOeJKg-Nsi1nRcEZO4BY3sm8',
              refreshToken:
                'Bz5e0lnwiA/Dx+0bVouQr+yt8F3z+2kPE2xQR2TXj4IZhxMx9ThQ3jskUWjmPNx0D7z+SwPDFzmXLPhzidq/Jg==',
            })
          }
          title="store JWT token to MMKV"
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
