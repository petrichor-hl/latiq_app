import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { ColorPalette } from '../../base/constants/color-palette';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../navigation/navation.config';
import { WIDTH } from '../../base/constants/size-screen';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {
  avatarCollectionsList,
  IAvatarCollection,
} from './pick-avatar.constants';

export interface PickAvatarScreenProps {}

export const PickAvatarScreen = () => {
  const insets = useSafeAreaInsets();
  const [collection, setCollection] = useState(avatarCollectionsList[11]);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const renderMenuTrigger = () => {
    return (
      <View style={{ flexDirection: 'row', columnGap: 6 }}>
        <View
          style={[
            styles.menuTrigger,
            isOpenMenu && styles.menuTriggerOpenedMenu,
          ]}>
          <Text style={styles.selectedCollectionTxt}>{collection.label}</Text>
          <Ionicons name={'caret-down'} size={18} color={ColorPalette.white} />
        </View>
      </View>
    );
  };

  const renderMenuOptions = () => {
    return (
      <ScrollView style={{ maxHeight: 310 }} showsVerticalScrollIndicator>
        {avatarCollectionsList.map(renderMenuOption)}
      </ScrollView>
    );
  };

  const renderMenuOption = (option: IAvatarCollection, index: number) => {
    return (
      <MenuOption key={index} value={option} style={styles.menuOption}>
        <Image
          source={option.assetName}
          style={{ height: 34, width: 34, marginRight: 16 }}
        />
        <Text style={{ fontSize: 15 }}>{option.label}</Text>
      </MenuOption>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons
            name={'arrow-undo'}
            size={44}
            color={ColorPalette.primary}
          />
        </TouchableOpacity>
        <Menu
          onSelect={selectedOption => setCollection(selectedOption)}
          onOpen={() => setIsOpenMenu(true)}
          onClose={() => setIsOpenMenu(false)}>
          <MenuTrigger
            children={renderMenuTrigger()}
            customStyles={{
              TriggerTouchableComponent: TouchableOpacity,
            }}
          />
          <MenuOptions
            optionsContainerStyle={styles.optionsContainer}
            children={renderMenuOptions()}
          />
        </Menu>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons
            name={'checkmark-done'}
            size={44}
            color={ColorPalette.primary}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: insets.bottom,
        }}>
        <View style={styles.gridAvatar}>
          {collection.avatarXml.map(index => {
            return (
              <TouchableOpacity
                onPress={() => {}}
                key={index}
                activeOpacity={0.6}>
                <SvgXml xml={index} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ColorPalette.secondary,
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 14,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    columnGap: 6,
    borderColor: ColorPalette.transparent,
    borderWidth: 2,
  },
  menuTriggerOpenedMenu: {
    borderColor: ColorPalette.primary,
    borderWidth: 2,
  },
  selectedCollectionTxt: {
    color: ColorPalette.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsContainer: {
    borderRadius: 4,
    marginTop: 50,
    width: WIDTH - 80,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  gridAvatar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 10,
  },
});
