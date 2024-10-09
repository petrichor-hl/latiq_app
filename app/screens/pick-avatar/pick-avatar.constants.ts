import {
  adventurer,
  adventurerNeutral,
  avataaars,
  avataaarsNeutral,
  bigSmile,
  botttsNeutral,
  croodles,
  croodlesNeutral,
  dylan,
  funEmoji,
  initials,
  lorelei,
  loreleiNeutral,
  micah,
  notionists,
  notionistsNeutral,
  thumbs,
} from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { range } from 'lodash';
import { ImageSourcePropType } from 'react-native';

export interface IAvatarCollection {
  label: string;
  assetName: ImageSourcePropType;
  avatarXml: (size: number) => string[];
}

export const avatarCollectionsList: IAvatarCollection[] = [
  {
    label: 'Adventurer',
    assetName: require('../../assets/images/png/adventurer-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(adventurer, {
          seed: `${index}`,
          size: size,
          radius: 6,
          backgroundColor: ['eab308', 'ca8a04'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Adventurer Neutral',
    assetName: require('../../assets/images/png/adventurerNeutral-0.png'),

    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(adventurerNeutral, {
          seed: `${index}`,
          size: size,
          radius: 6,
          backgroundColor: ['eab308', 'ca8a04'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Avataaars',
    assetName: require('../../assets/images/png/avataaars-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(avataaars, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['eab308', 'ca8a04'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Avataaars Neutral',
    assetName: require('../../assets/images/png/avataaarsNeutral-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(avataaarsNeutral, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: [
            '94a3b8',
            'a8a29e',
            'ef4444',
            'ea580c',
            'ffffff',
            'fbbf24',
            '22d3ee',
            'f43f5e',
          ],
          backgroundType: ['solid'],
        }).toString();
      }),
  },
  {
    label: 'Big Smile',
    assetName: require('../../assets/images/png/bigSmile-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(bigSmile, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: [
            '94a3b8',
            'a8a29e',
            'ef4444',
            'ea580c',
            'ffffff',
            'fbbf24',
            '22d3ee',
            'f43f5e',
          ],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Bottts Neutral',
    assetName: require('../../assets/images/png/botttsNeutral-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(botttsNeutral, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['b6e3f4', 'eab308', 'ffd5dc'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Croodles',
    assetName: require('../../assets/images/png/croodles-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(croodles, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['b6e3f4', 'ffd5dc'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Croodles Neutral',
    assetName: require('../../assets/images/png/croodlesNeutral-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(croodlesNeutral, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['ffffff'],
        }).toString();
      }),
  },
  {
    label: 'Dylan',
    assetName: require('../../assets/images/png/dylan-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(dylan, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['ffa6e6', '29e051', 'ffd5dc'],
          backgroundType: ['solid'],
        }).toString();
      }),
  },
  {
    label: 'Fun Emoji',
    assetName: require('../../assets/images/png/funEmoji-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(funEmoji, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['d1d4f9', 'd84be5', 'b6e3f4', 'f6d594', 'fcbc34'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Initials',
    assetName: require('../../assets/images/png/initials-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(initials, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: [
            'd1d4f9',
            'd84be5',
            'b6e3f4',
            'd9915b',
            'f6d594',
            'fcbc34',
          ],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Lorelei',
    assetName: require('../../assets/images/png/lorelei-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(lorelei, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['d1d4f9', 'ffd5dc'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Lorelei Neutral',
    assetName: require('../../assets/images/png/loreleiNeutral-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(loreleiNeutral, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['d1d4f9', 'ffffff', 'ffd5dc'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
  {
    label: 'Micah',
    assetName: require('../../assets/images/png/micah-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(micah, {
          seed: `${index}`,
          size,
          radius: 6,
        }).toString();
      }),
  },
  {
    label: 'Notionists',
    assetName: require('../../assets/images/png/notionists-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(notionists, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['ffffff'],
        }).toString();
      }),
  },
  {
    label: 'Notionists Neutral',
    assetName: require('../../assets/images/png/notionistsNeutral-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(notionistsNeutral, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['ffffff'],
        }).toString();
      }),
  },
  {
    label: 'Thumbs',
    assetName: require('../../assets/images/png/thumbs-0.png'),
    avatarXml: size =>
      range(1, 13).map(index => {
        return createAvatar(thumbs, {
          seed: `${index}`,
          size,
          radius: 6,
          backgroundColor: ['d1d4f9', 'ffd5dc'],
          backgroundType: ['gradientLinear'],
        }).toString();
      }),
  },
];
