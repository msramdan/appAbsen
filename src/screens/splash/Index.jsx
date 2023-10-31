// SplashScreen.js
import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo-jbg.png')}
        style={styles.logo}
      />
      <Text style={styles.appName}>Attendance Hexamatics</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  appName: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
