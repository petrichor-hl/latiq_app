import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDidMount } from 'rooks';
import { SvgXml } from 'react-native-svg';
import { ColorPalette } from '../../base/constants/color-palette';
import { ScreenName } from '../../base/constants/screen-name';
import { push } from '../../navigation/navation.config';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import { PickAvatarScreenProps } from '../pick-avatar/pick-avatar.screen';
import { zustandUser } from '../../zustand/user.zustand';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoomCodeInput } from './components/room-code-input.component';
import { SlideIn } from './components/slide-in.component';

export interface HomeScreenProps {}

export const HomeScreen = () => {
  useDidMount(() => {
    StatusBar.setBarStyle('light-content');
  });
  const insets = useSafeAreaInsets();
  const { user } = zustandUser();

  const [collectionNumber, seedNumber] = user.avatar
    .split('-')
    .map(e => Number(e));

  return (
    <ImageBackground
      source={require('../../assets/images/png/background-3.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <SlideIn style={styles.expandWidth}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => push<PickAvatarScreenProps>(ScreenName.PICK_AVATAR)}
          style={styles.avatarImg}>
          <SvgXml
            xml={
              avatarCollectionsList[collectionNumber].avatarXml(160)[seedNumber]
            }
          />
          <View style={styles.editIcon}>
            <Ionicons name="brush" size={20} color={ColorPalette.black} />
          </View>
        </TouchableOpacity>
      </SlideIn>
      <SlideIn delay={200}>
        <Text style={styles.welcomeTxt}>Xin chào, {user.nickName}</Text>
      </SlideIn>
      <KeyboardAvoidingView
        style={styles.expandWidth}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SlideIn style={styles.expandWidth} delay={400}>
          <View style={styles.rowCtn}>
            <RoomCodeInput />
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {}}
              style={[styles.appBtn, { width: 80 }]}>
              <FontAwesome6 name="door-open" size={24} />
            </TouchableOpacity>
          </View>
        </SlideIn>
      </KeyboardAvoidingView>

      <SlideIn style={styles.expandWidth} delay={600}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {}}
          style={styles.appBtn}>
          <Text style={styles.btnTitle}>TẠO PHÒNG</Text>
        </TouchableOpacity>
      </SlideIn>
      <SlideIn style={styles.expandWidth} delay={800}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {}}
          style={[styles.appBtn, { backgroundColor: ColorPalette.secondary }]}>
          <Text style={styles.btnTitle}>PHÒNG SẴN CÓ</Text>
        </TouchableOpacity>
      </SlideIn>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    rowGap: 14,
  },
  expandWidth: {
    width: '100%',
  },
  rowCtn: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  avatarImg: {
    padding: 6,
    borderColor: ColorPalette.white,
    borderWidth: 4,
    alignSelf: 'center',
    borderRadius: 16,
  },
  welcomeTxt: {
    fontSize: 28,
    color: ColorPalette.white,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  editIcon: {
    position: 'absolute',
    right: -14,
    top: -14,
    backgroundColor: ColorPalette.white,
    padding: 8,
    borderRadius: 18,
  },
  btnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.white,
  },
  appBtn: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
});
