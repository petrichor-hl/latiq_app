import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDidMount } from 'rooks';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { PhysicalButton } from '../../base/components/physical-button.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../navigation/navation.config';
import { ColorPalette } from '../../base/constants/color-palette';

export interface FriendListScreenProps {}

export const FriendListScreen = (_props: FriendListScreenProps) => {
  const insets = useSafeAreaInsets();

  useDidMount(() => {
    // initializeConnection(zustandAuth.getState().accessToken);
  });

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-3.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View style={styles.headerRow}>
        <PhysicalButton
          paddingVertical={0}
          paddingHorizontal={0}
          width={64}
          onPress={() => goBack()}>
          <Ionicons name={'arrow-undo'} size={28} color={ColorPalette.white} />
        </PhysicalButton>

        <Text style={styles.sreenTitle}>Bạn bè</Text>

        <View style={{ width: 64 }} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    paddingHorizontal: 20,
    rowGap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sreenTitle: {
    flex: 1,
    textAlign: 'center',
    color: ColorPalette.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
