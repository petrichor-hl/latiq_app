import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Animated, {
  FadeIn,
  FadeOut,
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Friend } from '../friend-list.type';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../../pick-avatar/pick-avatar.constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FriendCardProps {
  friend: Friend;
}

export const FriendCard = (props: FriendCardProps) => {
  const { friend } = props;

  const scale = useSharedValue(1);
  const [collectionNumber, seedNumber] = friend.avatar
    .split('-')
    .map(e => Number(e));

  useEffect(() => {
    if (friend.isOnline) {
      scale.value = withRepeat(
        withTiming(1.5, {
          duration: 500,
          easing: Easing.linear,
        }),
        -1,
        true,
      );
    } else {
      scale.value = 1; // Đặt lại kích thước khi offline
    }
  }, [friend.isOnline, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={styles.card} entering={FadeIn} exiting={FadeOut}>
      <View style={styles.userInfo}>
        <SvgXml
          xml={
            avatarCollectionsList[collectionNumber].avatarXml(160)[seedNumber]
          }
          width={50}
          height={50}
        />

        <View>
          <Text style={styles.username}>{friend.nickName}</Text>
          <View style={styles.status}>
            <Animated.View style={[animatedStyle]}>
              {friend.isOnline ? (
                <Ionicons name="ellipse" size={10} color="green" /> // Biểu tượng cho trạng thái online
              ) : (
                <Ionicons name="ellipse" size={10} color="gray" /> // Biểu tượng cho trạng thái offline
              )}
            </Animated.View>

            <Text style={styles.lastSeen}>
              {friend.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity>
          <Feather name="message-square" size={24} color="#6D28D9" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Feather name="play" size={24} color="#6D28D9" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatar: {
    width: 50,
    height: 50,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  lastSeen: {
    fontSize: 12,
    color: 'gray',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  status: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
});
