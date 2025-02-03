import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ColorPalette } from '../../base/constants/color-palette';
import { WIDTH, HEIGHT } from '../../base/constants/size-screen';
import { goBack } from '../../navigation/navation.config';
import { PhysicalButton } from '../../base/components/physical-button.component';
import { AuthService } from '../../services/features/auth.services';
import { zustandUser } from '../../zustand/user.zustand';

export interface ProfileScreenProps {}

export const ProfileScreen = (_props: ProfileScreenProps) => {
  const { user } = zustandUser.getState();

  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-0.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 20) },
      ]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons name="arrow-undo" size={44} color={ColorPalette.primary} />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.sreenTitle}>Hồ sơ</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>
      {/* Body */}
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 36, color: ColorPalette.white }}>
          {`KINH NGHIỆM: ${user.experience}`}
        </Text>
      </View>
      {/* Logout Button */}
      <View style={{}}>
        <PhysicalButton
          buttonColor={ColorPalette.tertiary}
          buttonBackgroundColor={ColorPalette.tertiaryActive}
          onPress={handleLogout}>
          <Text style={styles.btnTitle}>ĐĂNG XUẤT</Text>
        </PhysicalButton>
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
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sreenTitle: {
    color: ColorPalette.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  btnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.white,
  },
});
