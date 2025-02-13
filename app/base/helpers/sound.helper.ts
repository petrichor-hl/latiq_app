import Sound from 'react-native-sound';
import { EnumSoundName } from '../constants/sound-name';
import { consoleStyle } from '../../configs/console-style.config';

// Interface định nghĩa cấu trúc của danh sách âm thanh
type SoundMap = {
  [key in EnumSoundName]?: Sound;
};

// Biến lưu trữ tất cả các âm thanh đã được tải
const soundMap: SoundMap = {};

Sound.setCategory('Playback');

export const loadSounds = async (): Promise<void> => {
  const promises = Object.values(EnumSoundName).map(soundName => {
    return new Promise<void>((resolve, reject) => {
      soundMap[soundName] = new Sound(soundName, Sound.MAIN_BUNDLE, error => {
        if (error) {
          console.log(`Error loading sound ${soundName}:`, error);
          reject(error);
        } else {
          console.log(`Sound ${soundName} loaded successfully`);
          resolve();
        }
      });
    });
  });

  try {
    await Promise.all(promises);
    console.log(
      consoleStyle.bg.green,
      consoleStyle.fg.black,
      'All sounds loaded successfully',
      consoleStyle.reset,
      '✅',
    );
    console.log();
  } catch (error) {
    console.log(
      consoleStyle.bg.green,
      consoleStyle.fg.black,
      'Some sounds failed to load',
      consoleStyle.reset,
      '❌',
    );
  }
};

// Hàm phát âm thanh dựa trên tên
export const playSound = (
  soundName: EnumSoundName,
  loop?: boolean,
  volume?: number,
): void => {
  const sound = soundMap[soundName];

  if (sound) {
    if (loop) {
      sound.setNumberOfLoops(-1);
    }

    if (volume) {
      sound.setVolume(volume);
    }

    sound.play(success => {
      if (!success) {
        console.log(`Failed to play sound ${soundName}`);
      }
    });
  } else {
    console.log(`Sound ${soundName} not found`);
  }
};

export const stopCurrentSound = (soundName: EnumSoundName): void => {
  const sound = soundMap[soundName];
  if (sound) {
    sound.stop();
  }
};
