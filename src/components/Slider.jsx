import {View, Image, StyleSheet} from 'react-native';

import React from 'react';

export default function Slider({data}) {
  return (
    <View>
      <Image source={{uri: data.image}} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 150,
    borderRadius: 10,
  },
});