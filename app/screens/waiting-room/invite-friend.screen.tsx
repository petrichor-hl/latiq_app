import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette } from '../../base/constants/color-palette';
import { goBack } from '../../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface InviteFriendScreenProps {}

export const InviteFriendScreen = (_props: InviteFriendScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-undo" size={44} color={ColorPalette.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.sreenTitle}>Mời bạn bè</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    rowGap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sreenTitle: {
    color: ColorPalette.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
