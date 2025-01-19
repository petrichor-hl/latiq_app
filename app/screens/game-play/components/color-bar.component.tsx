import React, { forwardRef } from 'react';
import { View, TouchableOpacity, ViewStyle, StyleSheet } from 'react-native';

interface ColorBarProps {
  style?: ViewStyle;
  onColorPressed: (color: string) => void;
}

const colors = ['black', 'red', 'green', 'blue', 'purple', 'orange'];

export const ColorBar = forwardRef<View, ColorBarProps>((props, ref) => {
  const { style, onColorPressed } = props;

  return (
    <View ref={ref} style={[styles.defaultCtn, style]}>
      {colors.map(color => (
        <TouchableOpacity
          key={color}
          onPress={() => onColorPressed(color)}
          style={[styles.colorBtn, { backgroundColor: color }]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  defaultCtn: {
    flexDirection: 'row',
    gap: 10,
  },
  colorBtn: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});
