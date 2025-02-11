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
import { push } from '../../navigation/navation.config';
import {
  PickAvatarScreen,
  PickAvatarScreenProps,
} from '../pick-avatar/pick-avatar.screen';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import { SvgXml } from 'react-native-svg';
import { UserService } from '../../services/features/user.services';
import { ScrollView } from 'react-native';

export interface ProfileScreenProps {}

export const ProfileScreen = (_props: ProfileScreenProps) => {
  const { user } = zustandUser.getState();

  const achievements = [
    { id: 1, title: 'Word Master', icon: '🎯' },
    { id: 2, title: 'Speed Demon', icon: '⚡' },
    { id: 3, title: 'Champion', icon: '🏆' },
    { id: 4, title: 'Perfectionist', icon: '✨' },
  ];

  const insets = useSafeAreaInsets();

  const [collectionNumber, seedNumber] = user.avatar
    .split('-')
    .map(e => Number(e));

  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-0.png')}
      resizeMode="cover"
      style={[
        styles.container,
        {
          paddingTop: insets.top + 15,
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <PhysicalButton
          paddingVertical={0}
          paddingHorizontal={0}
          width={64}
          onPress={() => goBack()}>
          <Ionicons name={'arrow-undo'} size={28} color={ColorPalette.white} />
        </PhysicalButton>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.sreenTitle}>Hồ sơ</Text>
        </View>

        <View style={{ width: 64 }} />
      </View>
      {/* Body */}
      <ScrollView
        style={{ flex: 1, paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ flexGrow: 1 }}>
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
                avatarCollectionsList[collectionNumber].avatarXml(160)[
                  seedNumber
                ]
              }
            />
            <View style={styles.editIcon}>
              <Ionicons name="brush" size={20} color={ColorPalette.black} />
            </View>
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 28,
              color: ColorPalette.white,
              paddingTop: 10,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {user.nickName}
          </Text>

          <Text
            style={{
              fontSize: 24,
              color: ColorPalette.gray[400],
              textAlign: 'center',
              fontWeight: 'light',
              fontStyle: 'italic',
              paddingBottom: 10,
            }}>
            {user.email}
          </Text>

          {/* Exp */}
          <View style={styles.expBarContainer}>
            <View style={styles.expInfo}>
              <Text>{`Level ${Math.floor(user.experience / 500)}`}</Text>
              <Text>{`${user.experience % 500}/500 XP`}</Text>
            </View>
            <View style={styles.expBarBackground}>
              <View
                style={[
                  styles.expBar,
                  { width: `${((user.experience % 500) / 500) * 100}%` },
                ]}
              />
            </View>
          </View>

          {/* Other status */}
          <View style={styles.statsContainer}>
            {[
              { title: 'Số từ đã đoán', value: 588, color: 'blue' },
              {
                title: 'Số game đã chơi',
                value: 211,
                color: 'purple',
              },
              {
                title: 'Tỉ lệ thắng',
                value: '56.1%',
                color: 'green',
              },
              {
                title: 'Thành tựu',
                value: '11',
                color: 'gold',
              },
            ].map((item, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statTitle}>{item.title}</Text>
                <Text style={[styles.statValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Recent Achievement */}
          <View style={styles.achievementsContainer}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.achievementsTitle}>Thành tựu gần đây</Text>
              <Ionicons name="trophy" size={24} color={ColorPalette.primary} />
            </View>
            <View style={styles.achievementsGrid}>
              {achievements.map(achievement => (
                <View key={achievement.id} style={styles.achievementCard}>
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 22 }} />
        </View>
      </ScrollView>

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
  avatarImg: {
    padding: 6,
    borderColor: ColorPalette.white,
    borderWidth: 4,
    alignSelf: 'center',
    borderRadius: 16,
  },
  editIcon: {
    position: 'absolute',
    right: -14,
    top: -14,
    backgroundColor: ColorPalette.white,
    padding: 8,
    borderRadius: 18,
  },
  expBarContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  expInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  expBarBackground: {
    height: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 8,
  },
  expBar: { height: '100%', backgroundColor: 'blue' },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  statTitle: { fontSize: 16, fontWeight: '600' },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  achievementsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  achievementsTitle: { fontSize: 20, fontWeight: 'bold' },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  achievementIcon: { fontSize: 24, marginRight: 8 },
  achievementTitle: { fontSize: 14, fontWeight: '500' },
});
