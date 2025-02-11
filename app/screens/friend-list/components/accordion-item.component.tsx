import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ColorPalette } from '../../../base/constants/color-palette';

interface AccordionItemProps extends PropsWithChildren {
  label: string;
  expanded?: boolean;
}

export const AccordionItem = (props: AccordionItemProps) => {
  const { label, expanded = false, children } = props;

  const [isExpanded, setExpanded] = useState(expanded);

  const height = useSharedValue(0);

  const expandableContentStyle = useAnimatedStyle(() => ({
    height: withTiming(height.value * Number(isExpanded)),
    overflow: 'hidden',
  }));

  return (
    <View style={{ rowGap: 4 }}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => setExpanded(!isExpanded)}
        style={{
          padding: 16,
          backgroundColor: ColorPalette.secondary,
          borderRadius: 8,
        }}>
        <View
          style={{
            flexDirection: 'row',
            columnGap: 16,
            alignItems: 'center',
          }}>
          <Text style={styles.lableTxt}>{label}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={ColorPalette.white}
          />
        </View>
      </TouchableOpacity>

      {/* Expandable Content */}
      <Animated.View style={expandableContentStyle}>
        <View
          onLayout={e => {
            height.value = e.nativeEvent.layout.height;
          }}
          style={styles.wrapper}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  lableTxt: {
    flex: 1,
    color: ColorPalette.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: 'red',  // uncomment => Xem để hiểu
  },
});
