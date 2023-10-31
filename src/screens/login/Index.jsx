// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Animated,Image } from 'react-native';
import axios from 'axios';
import { storeData } from '../../utils/Storedata';


const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      // Simulate API call for authentication
      const response = await axios.post('your_authentication_api', { employeeId, password });
      if (response.data.success) {
        // storeData('user', response.data.data);
        navigation.replace('Home');
      } else {
        // Authentication failed, show an error message
        alert('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo-jbg.png')}
        style={styles.logo}
      />

      <Animated.View style={[styles.card, { top: 20 }]}>
        <Text style={styles.cardLabel}>Please Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Employee ID"
          value={employeeId}
          onChangeText={(text) => setEmployeeId(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
