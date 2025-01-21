import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Canvas from 'react-native-canvas';
import { ColorPalette } from '../../base/constants/color-palette';
import { ColorBar } from './components/color-bar.component';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Spacer } from '../../base/components/spacer.component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useGamePlayController } from './controllers/game-play.controller';
import { useCountdownController } from './controllers/countdown.controller';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { faker } from '@faker-js/faker';
import { AnswerItem } from './components/answer-item.component';
import { Rankings } from './components/rankings.component';
import { useBackHandlerController } from './controllers/back-handler.controller';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import LottieView from 'lottie-react-native';

export interface GamePlayScreenProps {}

export const GamePlayScreen = (_props: GamePlayScreenProps) => {
  const {
    values: { countdown, scale },
  } = useCountdownController();

  useBackHandlerController();

  const {
    refs: { canvasRef, textInputRef, fireworkRef, tickRef },
    values: {
      drawerNickName,
      word,
      isDrawer,
      answerList,
      panResponder,
      progressTime,
      isShowTextInput,
      isShowFirework,
      isShowAnswer,
    },
    actions: { clearPaint, setStrokeColor, handleAnswer },
  } = useGamePlayController();

  const insets = useSafeAreaInsets();

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressTime.value}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View
        {...panResponder?.panHandlers}
        style={{
          backgroundColor: ColorPalette.white,
          width: WIDTH,
          height: WIDTH,
        }}>
        <Canvas ref={canvasRef} />

        {!isShowAnswer && (
          <View style={styles.topControlsCtn}>
            {isDrawer ? (
              <React.Fragment>
                <ColorBar onColorPressed={color => setStrokeColor(color)} />
                <Spacer />
                <TouchableOpacity onPress={clearPaint}>
                  <MaterialIcons
                    name="cleaning-services"
                    size={32}
                    color={ColorPalette.black}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ) : (
              <Text style={styles.drawer}>{`Người vẽ: ${drawerNickName}`}</Text>
            )}
          </View>
        )}

        <View
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            marginHorizontal: 8,
            rowGap: 4,
          }}>
          {isDrawer && !isShowAnswer && (
            <TouchableOpacity>
              <Text>
                Từ khoá:{' '}
                <Text style={{ color: ColorPalette.black, fontWeight: '500' }}>
                  {word}
                </Text>
              </Text>
            </TouchableOpacity>
          )}
          <View style={styles.progressCtn}>
            <Animated.View style={[styles.progress, progressAnimatedStyle]} />
          </View>
        </View>

        {isShowAnswer && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{
              position: 'absolute',
              width: WIDTH,
              height: WIDTH,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <LottieView
              style={{ width: 240, height: 240 }}
              resizeMode="cover"
              source={require('../../assets/lottie/travel.json')}
              autoPlay
              loop
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: '500',
                color: ColorPalette.black,
                top: -10,
              }}>{`Đáp án:`}</Text>

            <Text
              style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: ColorPalette.green[600],
                top: -10,
              }}>
              {word}
            </Text>
          </Animated.View>
        )}
      </View>

      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Rankings />
        <View style={styles.answerListCtn}>
          <ScrollView>
            {answerList.map(answerItem => (
              <AnswerItem key={faker.string.uuid()} answerItem={answerItem} />
            ))}
          </ScrollView>
          {isShowTextInput ? (
            <TextInput
              ref={textInputRef}
              placeholder="Answer here ..."
              placeholderTextColor={ColorPalette.white}
              onSubmitEditing={e => handleAnswer(e.nativeEvent.text)}
              style={styles.answerTextInput}
            />
          ) : (
            !isDrawer && (
              <View style={styles.answerCorrectCtn}>
                <FontAwesome5
                  name="check-circle"
                  size={24}
                  color={ColorPalette.green[500]}
                  solid
                />
              </View>
            )
          )}
        </View>
      </View>

      {isShowFirework && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.fireworkContainer}>
          <LottieView
            style={styles.tickStyle}
            resizeMode="cover"
            ref={tickRef}
            source={require('../../assets/lottie/green-tick.json')}
            loop={false}
          />
          <LottieView
            style={{ width: WIDTH, height: HEIGHT }}
            resizeMode="cover"
            ref={fireworkRef}
            source={require('../../assets/lottie/firework-0.json')}
            loop={false}
          />
        </Animated.View>
      )}

      {countdown > 0 && (
        <View style={[styles.countdownContainer]}>
          <Animated.Text
            style={[styles.countdownText, { transform: [{ scale }] }]}>
            {countdown}
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.secondary,
  },
  topControlsCtn: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  sliderCtn: {
    width: 200,
  },
  countdownContainer: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000AA',
  },
  fireworkContainer: {
    position: 'absolute',
    width: WIDTH,
    height: HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000055',
  },
  tickStyle: {
    position: 'absolute',
    width: 240,
    height: 240,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  drawer: {
    fontSize: 15,
    fontWeight: '500',
    color: ColorPalette.black,
  },
  progressCtn: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderRadius: 11,
    borderColor: ColorPalette.primary,
    padding: 2,
  },
  progress: {
    backgroundColor: ColorPalette.primary,
    height: 10,
    borderRadius: 7,
  },
  answerListCtn: {
    flex: 1,
    backgroundColor: '#0143bd',
    padding: 6,
    rowGap: 6,
  },
  answerTextInput: {
    borderRadius: 8,
    borderColor: ColorPalette.white,
    borderWidth: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: ColorPalette.white,
    fontSize: 18,
    fontWeight: '500',
  },
  answerCorrectCtn: {
    height: 48,
    borderWidth: 2,
    borderColor: ColorPalette.green[500],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF22',
  },
});
