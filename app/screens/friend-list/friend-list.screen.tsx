import React, { useState } from 'react';
import {
  FlatList,
  ImageBackground,
  ListRenderItem,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDidMount } from 'rooks';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { PhysicalButton } from '../../base/components/physical-button.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../navigation/navation.config';
import { ColorPalette } from '../../base/constants/color-palette';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AccordionItem } from './components/accordion-item.component';
import { Friend } from './friend-list.type';
import { UserService } from '../../services/features/user.services';
import { hideLoading, showLoading } from '../../zustand/loading.zustand';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export interface FriendListScreenProps {}

export const FriendListScreen = (_props: FriendListScreenProps) => {
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');

  const borderColorAnim = useSharedValue<number>(0); // Giá trị khởi tạo cho border width

  const borderColorAnimStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderColorAnim.value,
        [0, 1],
        [ColorPalette.white, ColorPalette.primary],
      ),
    };
  });

  const [sendRequests, setSendRequests] = useState<Friend[]>([]);
  const [receiveRequests, setReceiveRequests] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);

  useDidMount(async () => {
    showLoading();
    const {
      sendRequests: fetchedSendRequests,
      receiveRequests: fetchedReceiveRequests,
      friends: fetchedFriends,
    } = await UserService.getFriends(false);

    setSendRequests(fetchedSendRequests);
    setReceiveRequests(fetchedReceiveRequests);
    setFriends(fetchedFriends);

    hideLoading();
  });

  const handleFocus = () => {
    borderColorAnim.value = withSpring(1);
  };

  const handleBlur = () => {
    borderColorAnim.value = withSpring(0);
  };

  const onSubmitEmail = async () => {};

  const renderSendRequestItem: ListRenderItem<Friend> = ({ item }) => {
    const [collectionNumber, seedNumber] = item.avatar
      .split('-')
      .map(e => Number(e));

    return (
      <View
        style={{ flexDirection: 'row', columnGap: 12, alignItems: 'center' }}>
        <View
          style={{
            borderColor: item.isOnline
              ? ColorPalette.green[400]
              : ColorPalette.primary,
            borderWidth: 3,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          <SvgXml
            xml={
              avatarCollectionsList[collectionNumber].avatarXml(60)[seedNumber]
            }
          />
        </View>

        <View style={{ flex: 1, rowGap: 2 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {item.nickName}
          </Text>

          <Text
            style={{
              color: item.isOnline
                ? ColorPalette.green[400]
                : ColorPalette.gray[400],
            }}>
            {item.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <PhysicalButton
          paddingHorizontal={0}
          paddingVertical={0}
          buttonColor={ColorPalette.tertiary}
          buttonBackgroundColor={ColorPalette.tertiaryActive}>
          <FontAwesome name="close" size={32} color={ColorPalette.white} />
        </PhysicalButton>
      </View>
    );
  };

  const renderReceiveRequestItem: ListRenderItem<Friend> = ({ item }) => {
    const [collectionNumber, seedNumber] = item.avatar
      .split('-')
      .map(e => Number(e));

    return (
      <View
        style={{ flexDirection: 'row', columnGap: 12, alignItems: 'center' }}>
        <View
          style={{
            borderColor: item.isOnline
              ? ColorPalette.green[400]
              : ColorPalette.primary,
            borderWidth: 3,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          <SvgXml
            xml={
              avatarCollectionsList[collectionNumber].avatarXml(60)[seedNumber]
            }
          />
        </View>

        <View style={{ flex: 1, rowGap: 2 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {item.nickName}
          </Text>

          <Text
            style={{
              color: item.isOnline
                ? ColorPalette.green[400]
                : ColorPalette.gray[400],
            }}>
            {item.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <PhysicalButton
          paddingHorizontal={0}
          paddingVertical={0}
          buttonColor={ColorPalette.tertiary}
          buttonBackgroundColor={ColorPalette.tertiaryActive}>
          <FontAwesome name="close" size={32} color={ColorPalette.white} />
        </PhysicalButton>

        <PhysicalButton
          paddingHorizontal={0}
          paddingVertical={0}
          buttonColor={ColorPalette.green[700]}
          buttonBackgroundColor={ColorPalette.green[900]}>
          <FontAwesome name="check" size={32} color={ColorPalette.white} />
        </PhysicalButton>
      </View>
    );
  };

  const renderFriendItem: ListRenderItem<Friend> = ({ item }) => {
    const [collectionNumber, seedNumber] = item.avatar
      .split('-')
      .map(e => Number(e));

    return (
      <View
        style={{ flexDirection: 'row', columnGap: 12, alignItems: 'center' }}>
        <View
          style={{
            borderColor: item.isOnline
              ? ColorPalette.green[400]
              : ColorPalette.primary,
            borderWidth: 3,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          <SvgXml
            xml={
              avatarCollectionsList[collectionNumber].avatarXml(60)[seedNumber]
            }
          />
        </View>

        <View style={{ flex: 1, rowGap: 2 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {item.nickName}
          </Text>

          <Text
            style={{
              color: item.isOnline
                ? ColorPalette.green[400]
                : ColorPalette.gray[400],
            }}>
            {item.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <TouchableOpacity>
          <Entypo
            name="dots-three-vertical"
            size={20}
            color={ColorPalette.gray[400]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const separator = () => {
    return <View style={styles.separatorStyle} />;
  };

  const emptyList = () => {
    return <Text style={styles.emptyRoomTxt}>{'Danh sách rỗng'}</Text>;
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-3.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top + 15, paddingBottom: insets.bottom },
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

        <Text style={styles.sreenTitle}>Bạn bè</Text>

        <View style={{ width: 64 }} />
      </View>

      {/* Body */}
      <View style={styles.rowCtn}>
        <Animated.View style={[styles.textInputWrap, borderColorAnimStyle]}>
          <TextInput
            placeholder={'tìm kiếm theo email'}
            placeholderTextColor={ColorPalette.gray[400]}
            value={searchText}
            onChangeText={setSearchText}
            onFocus={() => handleFocus()}
            onBlur={() => handleBlur()}
            style={styles.textInput}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </Animated.View>

        <PhysicalButton
          width={80}
          height={Platform.OS === 'android' ? 60 : 56}
          paddingVertical={0}
          buttonColor={ColorPalette.primary}
          buttonBackgroundColor={ColorPalette.primaryActive}
          onPress={onSubmitEmail}>
          <Ionicons name="search" size={28} color={ColorPalette.white} />
        </PhysicalButton>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        alwaysBounceVertical={false}
        contentContainerStyle={{ rowGap: 8 }}>
        <AccordionItem label="Lời mời đã gửi">
          <FlatList
            style={styles.flatListStyle}
            contentContainerStyle={{ padding: 20 }}
            data={sendRequests}
            keyExtractor={item => item.friendId}
            renderItem={renderSendRequestItem}
            ItemSeparatorComponent={separator}
            ListEmptyComponent={emptyList}
            scrollEnabled={false}
          />
        </AccordionItem>

        <AccordionItem label="Lời mời đã nhận">
          <FlatList
            style={styles.flatListStyle}
            contentContainerStyle={{ padding: 20 }}
            data={receiveRequests}
            keyExtractor={item => item.friendId}
            renderItem={renderReceiveRequestItem}
            ItemSeparatorComponent={separator}
            ListEmptyComponent={emptyList}
            scrollEnabled={false}
          />
        </AccordionItem>

        <AccordionItem label="Danh sách bạn bè" expanded>
          <FlatList
            style={styles.flatListStyle}
            contentContainerStyle={{ padding: 20 }}
            data={friends}
            keyExtractor={item => item.friendId}
            renderItem={renderFriendItem}
            ItemSeparatorComponent={separator}
            ListEmptyComponent={emptyList}
            scrollEnabled={false}
          />
        </AccordionItem>
      </ScrollView>
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
  rowCtn: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  textInputWrap: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: ColorPalette.white,
    borderWidth: 3,
  },
  textInput: {
    flex: 1,
    padding: 13,
    backgroundColor: ColorPalette.white,
    borderRadius: 5,
    fontSize: 18,
  },
  separatorStyle: {
    height: 2,
    backgroundColor: ColorPalette.gray[200],
    marginVertical: 10,
  },
  emptyRoomTxt: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: ColorPalette.gray[400],
    marginVertical: 40,
  },
  flatListStyle: {
    backgroundColor: ColorPalette.white,
    width: '100%',
    borderRadius: 8,
  },
});
