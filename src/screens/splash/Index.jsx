import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle } from 'react-native-svg';

const SplashScreen = () => {
  const navigation = useNavigation();
  const spinValue = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      // Navigasi ke halaman berikutnya setelah animasi selesai
      navigation.replace('HomeScreen');
    });
  }, [navigation, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Svg height="200" width="200" style={styles.spinner}>
        <Circle
          cx="100"
          cy="100"
          r="90"
          stroke="#3498db"
          strokeWidth="10"
          fill="transparent"
          strokeDasharray="565"
          strokeDashoffset="565"
          strokeLinecap="round"
          transform={[{ rotate: spin }]}
        />
      </Svg>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    transform: [{ rotate: '-90deg' }],
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
