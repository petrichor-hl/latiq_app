import React, { useState } from 'react';
import { Control, FieldError, useController } from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColorPalette } from '../constants/color-palette';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface AppTextInputProps {
  name: string;
  control: Control<any, any>;
  placeHoder?: string;
  defaultValue?: string;
  secureTextEntry?: boolean;
  canSwitchSecure?: boolean;
  error?: FieldError;
}

export const AppTextInput = (props: AppTextInputProps) => {
  const {
    name,
    control,
    placeHoder = name,
    defaultValue = '',
    secureTextEntry = false,
    canSwitchSecure = secureTextEntry,
    error,
  } = props;

  const { field } = useController({
    name,
    control,
    defaultValue,
  });

  const [isHide, setHide] = useState(true);

  const borderColorAnim = useSharedValue<number>(0); // Giá trị khởi tạo cho border width

  const handleFocus = () => {
    borderColorAnim.value = withSpring(1);
  };

  const handleBlur = () => {
    borderColorAnim.value = withSpring(0);
  };

  const borderColorAnimStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderColorAnim.value,
        [0, 1],
        [ColorPalette.white, ColorPalette.primary],
      ),
    };
  });

  /*
  secureTextEntry === false
  canSwitchSecure === true
  => canSwitchSecure = false
  */
  const canSwitch = secureTextEntry && canSwitchSecure;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textInputWrap, borderColorAnimStyle]}>
        <TextInput
          placeholder={placeHoder}
          placeholderTextColor={ColorPalette.gray[400]}
          value={field.value}
          onChangeText={field.onChange}
          onFocus={() => handleFocus()}
          onBlur={() => handleBlur()}
          style={styles.textInput}
          autoCapitalize={'none'}
          autoCorrect={false}
          secureTextEntry={secureTextEntry && isHide}
        />
        {canSwitch && field.value && (
          <TouchableOpacity
            style={styles.suffixIconBtn}
            hitSlop={13}
            onPress={() => setHide(!isHide)}>
            <Ionicons
              name={isHide ? 'eye-off' : 'eye'}
              size={24}
              color={ColorPalette.gray[400]}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error?.message && (
        <Text style={styles.errorMessage}>{error?.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
  textInputWrap: {
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: ColorPalette.white,
    borderWidth: 3,
  },
  textInput: {
    flex: 1,
    padding: 13,
    backgroundColor: ColorPalette.white,
    borderRadius: 5,
  },
  suffixIconBtn: {
    marginRight: 13,
  },
  errorMessage: {
    color: ColorPalette.red[500],
    fontSize: 15,
    marginTop: 4,
    fontWeight: 'bold',
  },
});
