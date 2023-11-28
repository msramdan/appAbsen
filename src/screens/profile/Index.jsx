
import { Text, StyleSheet, View, Image, TouchableOpacity, Dimensions, ScrollView, RefreshControl } from 'react-native';

import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from '../../utils/Axios';
import Loading from '../../components/Loading';
import { useIsFocused } from '@react-navigation/native';
import { Redirect } from '../../utils/Redirect';

export default function Photoscreen({ navigation }) {
    const [fullName, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [photo, setPhoto] = useState('')
    const [workLocation, setWorkLocation] = useState('')
    const [loading, setLoading] = useState(true)
    const focused = useIsFocused()
    const [refresh, setRefersh] = useState(false)

    useEffect(() => {
        loadEmployee()
    }, [focused])

    const loadEmployee = async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/auth/employee', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((res) => {

                setFullname(res.data.data.full_name)
                setEmail(res.data.data.email)
                setWorkLocation(res.data.data.work_location)
                setPhoto(res.data.data.photo)

                setLoading(false)
            }).catch((err) => {
                if (err.response.status == 401) {
                    Redirect.toLoginScreen(navigation)
                }
            })
    }

    const doLogout = () => {
        AsyncStorage.removeItem('apiToken')
        navigation.navigate('Login', {
            is_logout: true
        })
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefersh(true)

                        loadEmployee()

                        setRefersh(false)
                    }}
                />}
            style={{ flex: 1 }}
        >
            <View style={styles.page}>
                {
                    loading ?
                        <Loading style={styles.loading} />
                        : <></>
                }
                <View style={styles.container}>
                    <Image source={photo ? { uri: photo } : require('../../assets/images/user.png')} style={styles.foto} />
                    <View style={styles.profile}>
                        <Text style={styles.nama}>{fullName}</Text>
                        <Text style={styles.desc}>{email}</Text>
                        <Text style={[styles.desc, { marginTop: 5 }]}>{workLocation}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.containerMenu}
                        onPress={() => {
                            navigation.navigate('EditProfileScreen')
                        }}>
                        <View style={styles.menu}>
                            <Icon name="edit" size={30} color="#3498db" />
                            <Text style={styles.text}>Edit profile</Text>
                        </View>
                        <Icon name="arrow-right" size={30} color="grey" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.containerMenu}
                        onPress={() => {
                            navigation.navigate('ChangePasswordScreen')
                        }}>
                        <View style={styles.menu}>
                            <Icon name="lock" size={30} color="#3498db" />
                            <Text style={styles.text}>Change Password</Text>
                        </View>
                        <Icon name="arrow-right" size={30} color="grey" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.containerMenu}
                        onPress={() => doLogout()}>
                        <View style={styles.menu}>
                            <Icon name="sign-out" size={30} color="#3498db" />
                            <Text style={styles.text}>Sign Out</Text>
                        </View>
                        <Icon name="arrow-right" size={30} color="grey" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#3498db',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height - 50,
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
        borderRadius: 75,
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
    },
    loading: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 999999999,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});