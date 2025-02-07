import React, { useEffect, useState } from 'react';
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
import { UserService } from '../../services/features/user.services';
import { Friend } from './friend-list.type';
import { FlatList } from 'react-native';
import { FriendCard } from './components/friend-card.component';

export interface FriendListScreenProps {}

export const FriendListScreen = (_props: FriendListScreenProps) => {
  const insets = useSafeAreaInsets();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isFriendsCollapsed, setIsFriendsCollapsed] = useState(false);
  const [isRequestsCollapsed, setIsRequestsCollapsed] = useState(false);

  // Lấy danh sách bạn bè
  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const friendList: Friend[] = await UserService.getFriends(false); // true để hiển thị loading
        setFriends(friendList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách bạn bè:', error);
        return [];
      }
    };
    fetchUserFriends();
  }, []);

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
          <Text style={styles.sreenTitle}>Danh sách bạn bè</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>
      {/* Body */}
      {/* Friends List */}
      <TouchableOpacity
        onPress={() => setIsFriendsCollapsed(!isFriendsCollapsed)}
        style={styles.toggleButton}>
        <View
          style={{ flexDirection: 'row', gap: 5, justifyContent: 'center' }}>
          <Ionicons
            name="people-circle-outline"
            size={24}
            color={ColorPalette.violet[500]}
          />
          <Text style={styles.toggleText}>Bạn bè ({friends.length})</Text>
        </View>

        <Ionicons
          name={isFriendsCollapsed ? 'chevron-down' : 'chevron-up'}
          size={24}
          color={ColorPalette.violet[500]}
        />
      </TouchableOpacity>

      {!isFriendsCollapsed && (
        <View style={{ flex: 1, width: '100%', paddingVertical: 10 }}>
          <View style={styles.innerContainer}>
            <FlatList
              data={friends}
              keyExtractor={item => item.friendId.toString()}
              renderItem={({ item }) => <FriendCard friend={item} />}
            />
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  innerContainer: {
    width: '100%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: ColorPalette.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  toggleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColorPalette.violet[500],
  },
});
