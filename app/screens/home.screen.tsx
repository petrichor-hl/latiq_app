import React, { useState } from 'react';
import { View, Button, Keyboard, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette } from '../base/constants/color-palette';
import { useKeyboardAwareInsets } from '../base/keyboard/use-keyboard-aware-insets.hook';
import { navigate } from '../navigation/navation.config';
import { showLoading } from '../zustand/loading.zustand';

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
      </View>
      <View
        style={{
          padding: 14,
          backgroundColor: ColorPalette.indigo[500],
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
