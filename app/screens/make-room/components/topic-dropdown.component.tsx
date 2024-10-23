import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { ColorPalette } from '../../../base/constants/color-palette';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';
import { WIDTH } from '../../../base/constants/size-screen';
import { Control, useController } from 'react-hook-form';
import { Topic } from '../make-room.type';
import FastImage from 'react-native-fast-image';
import { TopicService } from '../../../services/features/topic.services';

interface TopicDropdownProps {
  control: Control<
    {
      topicId: string;
      capacity: number;
      round: number;
      isPublic: boolean;
    },
    any
  >;
}

export const TopicDropdown = (props: TopicDropdownProps) => {
  const { control } = props;
  const { field } = useController({
    control,
    name: 'topicId',
  });

  const menuRef = useRef<Menu>(null); // Tạo ref cho Menu

  const [topics, setTopics] = useState<Topic[] | null>(null);
  const selectedTopic = topics?.find(topic => topic.id === String(field.value));

  const borderColorAnim = useSharedValue<number>(0); // Giá trị khởi tạo cho border width

  const handleFocus = () => {
    borderColorAnim.value = withSpring(1);
  };

  const handleBlur = () => {
    borderColorAnim.value = withSpring(0);
  };

  const borderColorAnimStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        borderColorAnim.value,
        [0, 1],
        [ColorPalette.white, ColorPalette.primary],
      ),
    };
  });

  const renderMenuTrigger = () => {
    return (
      <Animated.View style={[styles.menuTriggerWrapper, borderColorAnimStyle]}>
        <View style={styles.menuTrigger}>
          <Text
            style={{
              color: field.value ? ColorPalette.black : ColorPalette.gray[400],
            }}>
            {selectedTopic?.name ?? 'chọn chủ đề'}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const renderMenuOptions = () => {
    return (
      <ScrollView showsVerticalScrollIndicator>
        {topics === null ? (
          <ActivityIndicator
            size={'small'}
            color={ColorPalette.gray[400]}
            style={styles.loading}
          />
        ) : (
          topics.map(renderMenuOption)
        )}
      </ScrollView>
    );
  };

  const renderMenuOption = (topic: Topic, index: number) => {
    return (
      <MenuOption key={index} value={topic} style={styles.menuOption}>
        <Text>{topic.name}</Text>
      </MenuOption>
    );
  };

  return (
    <React.Fragment>
      <TouchableOpacity
        style={styles.topicImageWrapper}
        onPress={async () => {
          menuRef.current?.open();
          if (topics === null) {
            setTopics(await TopicService.getListTopic(false));
          }
        }}>
        {selectedTopic ? (
          <FastImage
            source={{ uri: selectedTopic?.imageUrl }}
            style={styles.topicImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderCtn}>
            <Text style={styles.placeholderTxt}>Chọn chủ đề</Text>
          </View>
        )}
      </TouchableOpacity>

      <Menu
        ref={menuRef}
        onSelect={(topic: Topic) => field.onChange(topic.id)}
        onOpen={async () => {
          handleFocus();
          if (topics === null) {
            setTopics(await TopicService.getListTopic(false));
          }
        }}
        onClose={handleBlur}>
        <MenuTrigger
          children={renderMenuTrigger()}
          customStyles={{
            TriggerTouchableComponent: TouchableOpacity,
            triggerTouchable: { activeOpacity: 0.85 },
          }}
        />
        <MenuOptions
          optionsContainerStyle={styles.optionsContainer}
          children={renderMenuOptions()}
        />
      </Menu>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  topicImageWrapper: {
    padding: 6,
    borderColor: ColorPalette.white,
    borderWidth: 4,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 10,
  },
  topicImage: {
    height: 160,
    width: 160,
    borderRadius: 6,
    alignSelf: 'center',
  },
  optionsContainer: {
    borderRadius: 4,
    marginTop: 53,
    width: WIDTH - 40,
    maxHeight: 310,
  },
  menuTriggerWrapper: {
    borderWidth: 3,
    borderRadius: 8,
  },
  menuTrigger: {
    borderRadius: 5,
    padding: 13,
    backgroundColor: ColorPalette.white,
  },
  menuOption: {
    padding: 14,
  },
  loading: {
    paddingVertical: 16,
  },
  placeholderCtn: {
    height: 160,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTxt: {
    color: ColorPalette.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
