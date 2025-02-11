import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Text,
  View,
  KeyboardAvoidingView,
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
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { zustandSignalR } from '../../zustand/signal-r.zustand';
import { useDidMount } from 'rooks';
import { zustandAuth } from '../../zustand/auth.zustand';
import { PhysicalButton } from '../../base/components/physical-button.component';
import { ProfileScreen, ProfileScreenProps } from '../profile/profile.screen';
import {
  PublicRoomListScreen,
  PublicRoomListScreenProps,
} from '../public-room/public-room-list.screen';
import {
  FriendListScreen,
  FriendListScreenProps,
} from '../friend-list/friend-list.screen';

export interface HomeScreenProps {}

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = zustandUser();

  const [collectionNumber, seedNumber] = user.avatar
    .split('-')
    .map(e => Number(e));

  const { initializeConnection } = zustandSignalR.getState();

  useDidMount(() => {
    initializeConnection(zustandAuth.getState().accessToken);
  });

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <SlideIn>
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
      <KeyboardAvoidingView style={styles.expandWidth} behavior="padding">
        {/* Trong TH này: 'padding' work for both Android * iOS */}
        <SlideIn style={styles.expandWidth} delay={400}>
          <RoomCodeInput />
        </SlideIn>
      </KeyboardAvoidingView>

      <SlideIn style={styles.expandWidth} delay={600}>
        <PhysicalButton
          onPress={() => push<MakeRoomScreenProps>(MakeRoomScreen)}>
          <Text style={styles.btnTitle}>TẠO PHÒNG</Text>
        </PhysicalButton>
      </SlideIn>

      <SlideIn style={styles.expandWidth} delay={800}>
        <PhysicalButton
          buttonColor={ColorPalette.secondary}
          buttonBackgroundColor={ColorPalette.secondaryActive}
          onPress={() => push<PublicRoomListScreenProps>(PublicRoomListScreen)}>
          <Text style={styles.btnTitle}>DANH SÁCH PHÒNG</Text>
        </PhysicalButton>
      </SlideIn>

      <SlideIn style={styles.expandWidth} delay={1000}>
        <View style={{ flexDirection: 'row', columnGap: 16 }}>
          <View style={{ flex: 1 }}>
            <PhysicalButton
              buttonColor={ColorPalette.green[700]}
              buttonBackgroundColor={ColorPalette.green[900]}
              onPress={() => push<FriendListScreenProps>(FriendListScreen)}>
              <Text style={styles.btnTitle}>BẠN BÈ</Text>
            </PhysicalButton>
          </View>
          <View style={{ flex: 1 }}>
            <PhysicalButton
              buttonColor={ColorPalette.tertiary}
              buttonBackgroundColor={ColorPalette.tertiaryActive}
              onPress={() => push<ProfileScreenProps>(ProfileScreen)}>
              <Text style={styles.btnTitle}>HỒ SƠ</Text>
            </PhysicalButton>
          </View>
        </View>
      </SlideIn>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEIGHT,
    width: WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    rowGap: 16,
  },
  expandWidth: {
    width: '100%',
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
});
