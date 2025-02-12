import Sound from 'react-native-sound';
import { EnumSoundName } from '../constants/sound-name';

// Interface định nghĩa cấu trúc của danh sách âm thanh
type SoundMap = {
  [key in EnumSoundName]?: Sound;
};

// Biến lưu trữ tất cả các âm thanh đã được tải
const soundMap: SoundMap = {};

Sound.setCategory('Playback');

// Hàm load tất cả các file âm thanh
export const loadSounds = (): void => {
  Object.values(EnumSoundName).forEach(soundName => {
    soundMap[soundName] = new Sound(soundName, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.log(`Error loading sound ${soundName}:`, error);
      } else {
        console.log(`Sound ${soundName} loaded successfully`);
      }
    });
  });
};

// Hàm phát âm thanh dựa trên tên
export const playSound = (soundName: EnumSoundName): void => {
  const sound = soundMap[soundName];
  if (sound) {
    sound.play(success => {
      if (!success) {
        console.log(`Failed to play sound ${soundName}`);
      }
    });
  } else {
    console.log(`Sound ${soundName} not found`);
  }
};

export const playSoundWithLoop = (soundName: EnumSoundName): void => {
  const sound = soundMap[soundName];

  if (sound) {
    sound.setNumberOfLoops(-1);
    sound.setVolume(0.3);
    sound.play(success => {
      if (!success) {
        console.log(`Failed to play sound ${soundName}`);
      }
    });
  } else {
    console.log(`Sound ${soundName} not found`);
  }
};

export const playSoundsInOrder = async (
  sounds: EnumSoundName[],
): Promise<void> => {
  for (const soundName of sounds) {
    await new Promise<void>(resolve => {
      const sound = soundMap[soundName];
      if (sound) {
        sound.play(success => {
          if (!success) {
            console.log(`Failed to play sound ${soundName}`);
          }
          resolve(); // Gọi resolve khi âm thanh đã phát xong
        });
      } else {
        console.log(`Sound ${soundName} not found`);
        resolve(); // Gọi resolve nếu âm thanh không tìm thấy
      }
    });
  }
};

export const stopCurrentSound = (soundName: EnumSoundName): void => {
  const sound = soundMap[soundName];
  if (sound) {
    sound.stop();
  }
};
