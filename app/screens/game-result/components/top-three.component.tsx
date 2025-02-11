import React, { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Polygon,
  Rect,
  Stop,
  Text as SvgText,
  SvgXml,
} from 'react-native-svg';
import { ColorPalette } from '../../../base/constants/color-palette';
import { zustandRoom } from '../../../zustand/room.zustand';
import { avatarCollectionsList } from '../../pick-avatar/pick-avatar.constants';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export const TopicThree = () => {
  const { usersInRoom } = zustandRoom.getState();

  const sortedUsersByPoint = usersInRoom.sort(
    (a, b) => b.userPoints - a.userPoints,
  );

  const [goldCollectionNumber, goldSeedNumber] =
    sortedUsersByPoint[0].userAvatar.split('-').map(e => Number(e));

  const [silverCollectionNumber, silverSeedNumber] =
    sortedUsersByPoint[1].userAvatar.split('-').map(e => Number(e));

  const [bronzeCollectionNumber, bronzeSeedNumber] =
    sortedUsersByPoint[2].userAvatar.split('-').map(e => Number(e));

  return (
    <View style={styles.container}>
      {/* TOP 2 */}
      <View style={{ alignItems: 'center', rowGap: 4 }}>
        <View>
          <View style={styles.avatarWrapper}>
            <SvgXml
              xml={
                avatarCollectionsList[silverCollectionNumber].avatarXml(80)[
                  silverSeedNumber
                ]
              }
            />
          </View>

          <View
            style={[
              styles.awardWrapper,
              { borderColor: ColorPalette.zinc[300] },
            ]}>
            <FontAwesome6
              name="award"
              size={24}
              color={ColorPalette.zinc[300]}
            />
          </View>
        </View>

        <Text style={styles.userNicknameTxt}>
          {sortedUsersByPoint[1].userNickName}
        </Text>

        <View style={styles.userPoinstWrapper}>
          <Text style={styles.userPointsTxt}>
            {`${sortedUsersByPoint[1].userPoints}p`}
          </Text>
        </View>

        <Svg width="110" height="130">
          <Defs>
            <LinearGradient id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={ColorPalette.primaryActive}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={ColorPalette.primary}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>

          <Polygon
            points="20,0 110,0 110,20 0,20"
            fill={ColorPalette.primary}
          />
          <Rect x="0" y="20" width="110" height="110" fill="url(#gradientId)" />
          <SvgText
            x="55" // Canh giữa theo chiều ngang
            y="100"
            fontSize="68"
            fontWeight="bold"
            fill="white"
            textAnchor="middle" // Canh giữa text
          >
            2
          </SvgText>
        </Svg>
      </View>

      {/* TOP 1 */}
      <View style={{ alignItems: 'center', rowGap: 4 }}>
        <View>
          <View style={styles.avatarWrapper}>
            <SvgXml
              xml={
                avatarCollectionsList[goldCollectionNumber].avatarXml(80)[
                  goldSeedNumber
                ]
              }
            />
          </View>

          <View
            style={[
              styles.awardWrapper,
              { borderColor: ColorPalette.primary },
            ]}>
            <FontAwesome6 name="award" size={24} color={ColorPalette.primary} />
          </View>
        </View>

        <Text style={styles.userNicknameTxt}>
          {sortedUsersByPoint[0].userNickName}
        </Text>

        <View style={styles.userPoinstWrapper}>
          <Text style={styles.userPointsTxt}>
            {`${sortedUsersByPoint[0].userPoints}p`}
          </Text>
        </View>

        <Svg width="110" height="180">
          <Defs>
            <LinearGradient id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={ColorPalette.primaryActive}
                stopOpacity="1"
              />
              <Stop
                offset="50%"
                stopColor={ColorPalette.primary}
                stopOpacity="1"
              />
              <Stop offset="100%" stopColor="#fcd265" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          <Polygon points="20,0 90,0 110,20 0,20" fill={ColorPalette.primary} />
          <Rect x="0" y="20" width="110" height="160" fill="url(#gradientId)" />
          <SvgText
            x="55" // Canh giữa theo chiều ngang
            y="125"
            fontSize="68"
            fontWeight="bold"
            fill="white"
            textAnchor="middle" // Canh giữa text
          >
            1
          </SvgText>
        </Svg>
      </View>

      {/* TOP 3 */}
      <View style={{ alignItems: 'center', rowGap: 4 }}>
        <View>
          <View style={styles.avatarWrapper}>
            <SvgXml
              xml={
                avatarCollectionsList[bronzeCollectionNumber].avatarXml(80)[
                  bronzeSeedNumber
                ]
              }
            />
          </View>

          <View
            style={[
              styles.awardWrapper,
              { borderColor: ColorPalette.orange[700] },
            ]}>
            <FontAwesome6
              name="award"
              size={24}
              color={ColorPalette.orange[700]}
            />
          </View>
        </View>

        <Text style={styles.userNicknameTxt}>
          {sortedUsersByPoint[2].userNickName}
        </Text>

        <View style={styles.userPoinstWrapper}>
          <Text style={styles.userPointsTxt}>
            {`${sortedUsersByPoint[2].userPoints}p`}
          </Text>
        </View>

        <Svg width="110" height="100">
          <Defs>
            <LinearGradient id="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop
                offset="0%"
                stopColor={ColorPalette.primaryActive}
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor={ColorPalette.primary}
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>

          <Polygon points="0,0 90,0 110,20 0,20" fill={ColorPalette.primary} />
          <Rect x="0" y="20" width="110" height="80" fill="url(#gradientId)" />
          <SvgText
            x="55" // Canh giữa theo chiều ngang
            y="85"
            fontSize="68"
            fontWeight="bold"
            fill="white"
            textAnchor="middle" // Canh giữa text
          >
            3
          </SvgText>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  avatarWrapper: {
    borderRadius: 44,
    borderWidth: 4,
    overflow: 'hidden',
    borderColor: ColorPalette.white,
  },
  awardWrapper: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: ColorPalette.white,
    padding: 4,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 3,
  },
  userNicknameTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  userPoinstWrapper: {
    width: 90,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF99',
    borderRadius: 15,
  },
  userPointsTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
});
