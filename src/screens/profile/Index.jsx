
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';

import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Photoscreen() {
  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <Image source={require('../../assets/images/user.png')} style={styles.foto} />
        <View style={styles.profile}>
          <Text style={styles.nama}>Muhammad Saeful Ramdan</Text>
          <Text style={styles.desc}>No. HP : 083874731480</Text>
          <Text style={styles.desc}>Bogor</Text>
        </View>
        <TouchableOpacity
          style={styles.containerMenu}
          onPress={() => onSubmit()}>
          <View style={styles.menu}>
            <Icon name="edit" size={30} color="#3498db" />
            <Text style={styles.text}>Edit profile</Text>
          </View>
          <Icon name="arrow-right" size={30} color="grey" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.containerMenu}
          onPress={() => onSubmit()}>
          <View style={styles.menu}>
            <Icon name="lock" size={30} color="#3498db" />
            <Text style={styles.text}>Change Password</Text>
          </View>
          <Icon name="arrow-right" size={30} color="grey" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.containerMenu}
          onPress={() => onSubmit()}>
          <View style={styles.menu}>
            <Icon name="sign-out" size={30} color="#3498db" />
            <Text style={styles.text}>Sign Out</Text>
          </View>
          <Icon name="arrow-right" size={30} color="grey" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor:'#3498db',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    height: 680,
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 55,
  },
  profile: {
    marginTop: 10,
    alignItems: 'center',
  },

  containerMenu: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginHorizontal: 30,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    // fontFamily: fonts.primary.bold,
    marginLeft: 20
  },
  menu: {
      flexDirection: 'row',
      alignItems: 'center'
  }
});