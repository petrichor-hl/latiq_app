import React from 'react';
import { zustandGlobalModal } from '../../zustand/modal.zustand';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ColorPalette } from '../constants/color-palette';
import { WIDTH } from '../constants/size-screen';

export const GlobalModal = () => {
  const { visible, title, content, buttons } = zustandGlobalModal();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.modalOverlay}>
      <View style={styles.modalCtn}>
        <Text style={styles.modalTitleTxt}>{title}</Text>
        <Text style={styles.modalContextTxt}>{content}</Text>
        {buttons.map((button, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={button.onPress}
              style={[styles.actionBtn, button.buttonStyle.container]}>
              <Text style={button.buttonStyle.title}>{button.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0006',
  },
  modalCtn: {
    width: WIDTH - 64,
    padding: 20,
    backgroundColor: ColorPalette.white,
    borderRadius: 8,
    rowGap: 12,
  },
  modalTitleTxt: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContextTxt: {
    textAlign: 'center',
  },
  actionBtn: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
