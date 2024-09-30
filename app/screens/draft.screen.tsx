import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ParamList, refNavigation } from '../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { ColorPalette } from '../base/constants/color-palette';

export interface DraftScreenProps {
  text: string;
}

export const DraftScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'Draft'>>();
  const { text } = route.params;

  return (
    <View style={styles.container}>
      <Text
        onPress={() => {
          refNavigation.current?.canGoBack && refNavigation.goBack();
        }}>
        {text}
      </Text>
      <View style={styles.row}>
        <FontAwesome name="rocket" size={30} color="#090" />
        <FontAwesome5
          name="rocket"
          size={30}
          color="#009"
          style={{
            marginHorizontal: 14,
            padding: 6,
            borderColor: ColorPalette.primary,
            borderWidth: 2,
            borderRadius: 6,
          }}
        />
        <FontAwesome6 name="rocket" size={30} color="#090" />
      </View>
      <Ionicons
        name="logo-octocat"
        size={30}
        color="#900"
        onPress={() => {
          refNavigation.current?.canGoBack && refNavigation.goBack();
        }}
      />
      <View style={styles.row}>
        <FontAwesome5 name={'comments'} size={30} />
        <FontAwesome5
          name={'comments'}
          size={30}
          brand
          style={{ margin: 14 }}
        />
        <FontAwesome5 name={'comments'} size={30} solid />
      </View>
      {/* <Button
        onPress={}
        title="go back"
      /> */}
      <Ionicons.Button
        name="arrow-back"
        backgroundColor="#3b5998"
        onPress={() => {
          refNavigation.current?.canGoBack && refNavigation.goBack();
        }}>
        Go Back
      </Ionicons.Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
