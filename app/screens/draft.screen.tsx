import React, { useState } from 'react';
import { View, StyleSheet, Button, Keyboard, TextInput } from 'react-native';
import { refNavigation } from '../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { ColorPalette } from '../base/constants/color-palette';
import { lorelei } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { SvgXml } from 'react-native-svg';
import { Endpoints } from '../base/constants/endpoints';
import { useKeyboardAwareInsets } from '../base/keyboard/use-keyboard-aware-insets.hook';
import { ApiClient } from '../services/api-client/api-client';
import { zustandAuth } from '../zustand/auth.zustand';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SoundName } from '../base/constants/sound-name';
import Sound from 'react-native-sound';
import { AuthService } from '../services/features/auth.services';

export interface DraftScreenProps {
  text: string;
}

export const buttonClickSound = new Sound(
  SoundName.ButtonClick,
  Sound.MAIN_BUNDLE,
  error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  },
);

export const DraftScreen = () => {
  const [number, onChangeNumber] = useState('');
  const insets = useSafeAreaInsets();

  const playSound = () => {
    buttonClickSound.play();
  };

  const kittyAvatar = createAvatar(lorelei, {
    seed: 'Kitty',
    size: 100,
    // flip: true,
    // scale: 150, // %
    backgroundColor: ['bfdbfe'],
  }).toString();

  const jessicaAvatar = createAvatar(lorelei, {
    seed: 'Jessica',
    size: 100,
    backgroundType: ['gradientLinear'],
    backgroundColor: ['b6e3f4', 'c0aede'],
  }).toString();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <FontAwesome name="rocket" size={30} color="#090" />
        <FontAwesome5
          name="rocket"
          size={30}
          color="#009"
          style={{
            marginHorizontal: 14,
            padding: 6,
            borderColor: ColorPalette.primary,
            borderWidth: 2,
            borderRadius: 6,
          }}
        />
        <FontAwesome6 name="rocket" size={30} color="#090" />
      </View>
      <Ionicons
        name="logo-octocat"
        size={30}
        color="#900"
        onPress={() => {
          refNavigation.current?.canGoBack && refNavigation.goBack();
        }}
      />
      <View style={styles.row}>
        <FontAwesome5 name={'comments'} size={30} />
        <FontAwesome5
          name={'comments'}
          size={30}
          brand
          style={{ margin: 14 }}
        />
        <FontAwesome5 name={'comments'} size={30} solid />
      </View>
      <SvgXml xml={kittyAvatar} />
      <SvgXml xml={jessicaAvatar} />
      <Ionicons.Button
        name="arrow-back"
        backgroundColor="#3b5998"
        onPress={() => {
          refNavigation.current?.canGoBack && refNavigation.goBack();
        }}>
        Go Back
      </Ionicons.Button>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Button onPress={() => Keyboard.dismiss()} title="dismiss keyboard" />
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

        <Button onPress={() => playSound()} title={'Sound'} />
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
