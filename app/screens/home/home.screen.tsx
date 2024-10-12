import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { ColorPalette } from '../../base/constants/color-palette';
import { push } from '../../navigation/navation.config';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import {
  PickAvatarScreen,
  PickAvatarScreenProps,
} from '../pick-avatar/pick-avatar.screen';
import { zustandUser } from '../../zustand/user.zustand';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoomCodeInput } from './components/room-code-input.component';
import { SlideIn } from './components/slide-in.component';
import { UserService } from '../../services/features/user.services';
import {
  MakeRoomScreen,
  MakeRoomScreenProps,
} from '../make-room/make-room.screen';
import {
  GamePlayScreen,
  GamePlayScreenProps,
} from '../game-play/game-play.screen';

export interface HomeScreenProps {}

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = zustandUser();

  const [collectionNumber, seedNumber] = user.avatar
    .split('-')
    .map(e => Number(e));

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <SlideIn style={styles.expandWidth}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() =>
            push<PickAvatarScreenProps>(PickAvatarScreen, {
              collectionNumber: collectionNumber,
              onPickAvatar: avatar => UserService.updateProfile({ avatar }),
            })
          }
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
              style={[styles.appBtn, styles.joinRoomBtn]}>
              <Ionicons name="arrow-forward-circle-outline" size={32} />
            </TouchableOpacity>
          </View>
        </SlideIn>
      </KeyboardAvoidingView>

      <SlideIn style={styles.expandWidth} delay={600}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => push<MakeRoomScreenProps>(MakeRoomScreen)}
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
      <SlideIn style={styles.expandWidth} delay={1000}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => push<GamePlayScreenProps>(GamePlayScreen)}
          style={[styles.appBtn, { backgroundColor: ColorPalette.rose[600] }]}>
          <Text style={styles.btnTitle}>TEST PAINT</Text>
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
  joinRoomBtn: {
    width: 80,
  },
});
