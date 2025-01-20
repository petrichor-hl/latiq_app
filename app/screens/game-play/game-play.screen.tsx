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
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Spacer } from '../../base/components/spacer.component';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDrawController } from './controllers/draw.controller';
import { useCountdownController } from './controllers/countdown.controller';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { faker } from '@faker-js/faker';
import { AnswerItem } from './components/answer-item.component';
import { Rankings } from './components/rankings.component';

export interface GamePlayScreenProps {}

export const GamePlayScreen = (_props: GamePlayScreenProps) => {
  const {
    values: { countdown, scale },
  } = useCountdownController();

  const {
    refs: { canvasRef, textInputRef },
    values: {
      drawerNickName,
      word,
      isDrawer,
      answerList,
      panResponder,
      remainingTime,
      isShowTextInput,
    },
    actions: { clearPaint, setStrokeColor, handleAnswer },
  } = useDrawController();

  const insets = useSafeAreaInsets();

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${(remainingTime.value / 25) * 100}%`,
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View {...panResponder?.panHandlers}>
        <Canvas
          ref={canvasRef}
          style={{ backgroundColor: ColorPalette.white }}
        />

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

        <View
          style={{
            position: 'absolute',
            bottom: 8,
            left: 0,
            right: 0,
            marginHorizontal: 8,
            rowGap: 4,
          }}>
          {isDrawer && (
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
      </View>

      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Rankings />
        <View style={styles.answerListCtn}>
          <ScrollView>
            {answerList.map(answerItem => (
              <AnswerItem key={faker.string.uuid()} answerItem={answerItem} />
            ))}
          </ScrollView>
          {isShowTextInput && (
            <TextInput
              ref={textInputRef}
              placeholder="Answer here ..."
              placeholderTextColor={ColorPalette.white}
              onSubmitEditing={e => handleAnswer(e.nativeEvent.text)}
              style={styles.answerTextInput}
            />
          )}
        </View>
      </View>

      {countdown > 0 && (
        <Animated.View
          style={[styles.countdownContainer, { transform: [{ scale }] }]}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </Animated.View>
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
});
