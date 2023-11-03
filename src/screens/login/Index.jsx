// LoginScreen.js
import React, { useState } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    Image,
    Alert,
} from 'react-native';
import Axios from '../../utils/Axios';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
    const [employeeId, setEmployeeId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleLogin = async () => {
        if (!employeeId || !password) {
            alert('Employee ID and password are required');
            return;
        }
        setLoading(true);

        Axios.post('/auth/login', {
            employee_id: employeeId,
            password
        }).then(async (res) => {
            if (res) {
                await AsyncStorage.setItem('apiToken', res.data.data.token);
                navigation.navigate('HomeScreen')
            }
        }).catch((err) => {
            toast.show(err.response.data.error, {
                type: 'danger',
                placement: 'center'
            })
        })
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/login.png')}
                style={styles.logo}
            />
            <Animated.View style={[styles.card]}>
                <Text style={styles.cardLabel}>Please Sign In</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Employee ID"
                    value={employeeId}
                    onChangeText={text => setEmployeeId(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading}>
                    <Text style={styles.buttonText}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Text>
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
        textAlign: 'center',
    },
    logo: {
        marginTop: -50,
        width: 300,
        height: 300,
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
