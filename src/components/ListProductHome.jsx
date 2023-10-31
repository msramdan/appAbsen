import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';

import React from 'react';

//import useNavigation
import {useNavigation} from '@react-navigation/native';

//import money format
import MoneyFormat from '../utils/MoneyFormat';

export default function ListProductHome({data}) {
  //ini navigation
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ProductShow', {
          slug: data.slug,
        })
      }
      style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: data.image,
        }}
      />
      <Text style={styles.title}>{data.title}</Text>
      <View style={styles.divider}></View>
      <View>
        <Text style={styles.price}>{MoneyFormat(data.price)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: 240,
    marginRight: 12,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    borderRadius: 10,
    padding: 10,
  },

  image: {
    width: '100%',
    height: 130,
    borderRadius: 5,
  },

  title: {
    marginTop: 7,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#696969',
  },

  divider: {
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    marginTop: 10,
  },

  price: {
    marginTop: 7,
    fontSize: 13,
    color: '#696969',
  },
});