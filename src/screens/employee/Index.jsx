import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Loading from '../../components/Loading';
import ListEmployee from '../../components/ListEmployee';
import Axios from '../../utils/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployeeScreen({ navigation }) {
    const [employees, setEmployees] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    useEffect(() => {
        loadDataEmployee();
    }, []);

    const loadDataEmployee = async () => {
        setLoadingPosts(true);

        const token = await AsyncStorage.getItem('apiToken')

        await Axios.get('/employees', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then(response => {
                if (response) {
                    setEmployees(response.data.data)
                }

                setLoadingPosts(false);
            }).catch((err) => {
                if (err.response.status == 401) {
                    navigation.navigate('Login')
                }
            });
    };

    return (
        <SafeAreaView>
            <ScrollView style={{ padding: 15 }}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons
                        name="account"
                        style={styles.labelIcon}
                        size={20}
                    />
                    <Text style={styles.labelText}>EMPLOYEES</Text>
                </View>
                <View>
                    {loadingPosts ? (
                        <Loading />
                    ) : (
                        <>
                            <FlatList
                                style={styles.container}
                                data={employees}
                                renderItem={({ item, index, separators }) => (
                                    <ListEmployee employee={item} index={index} />
                                )}
                                eyExtractor={item => item.id}
                                scrollEnabled={false}
                                onEndReachedThreshold={0.5}
                            />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    labelContainer: {
        marginTop: 5,
        flexDirection: 'row',
    },

    labelIcon: {
        marginRight: 5,
        color: '#333333',
    },

    labelText: {
        color: '#333333',
        fontWeight: 'bold',
    },

    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 20,
    },
});