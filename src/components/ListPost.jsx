import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

import React, { useEffect } from 'react';

//import useNavigation
import { useNavigation } from '@react-navigation/native';

//import material icons
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//import momen js
import moment from 'moment';
import 'moment/locale/id';

export default function ListPost({ data }) {
    //ini navigation
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() =>
                navigation.navigate('PostShow', {
                    id: data.id,
                    navigation: navigation,
                })
            }>
            <Image source={{ uri: data.thumbnail }} style={styles.image} />
            <View style={styles.block}>
                <View style={styles.containerCategory}>
                    <MaterialIcons name="folder" style={styles.iconCategory} size={15} />
                    <Text style={styles.textCategory}>{data.categorynews.category_name}</Text>
                </View>
                <Text style={styles.titlePost}>{data.title}</Text>

                <View style={styles.containerUserAndDate}>

                    <View style={styles.containerUser}>
                        <MaterialIcons name="person" style={styles.iconUser} size={15} />
                        <Text style={styles.textUser}>{data.user.name}</Text>
                    </View>

                    <View style={styles.containerDate}>
                        <MaterialIcons name="today" style={styles.iconDate} size={15} />
                        <Text style={styles.textDate}>
                            {moment(data.date, 'DD-MM-YYYY').format('LL')}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 7,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
        elevation: 1,
    },

    image: {
        width: '35%',
        aspectRatio: 18 / 16,
        borderRadius: 5,
        marginRight: 8,
    },

    block: {
        padding: 0,
        width: '65%',
    },

    containerCategory: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
        paddingRight: 13,
    },

    iconCategory: {
        marginRight: 5,
        color: '#696969',
    },

    textCategory: {
        fontSize: 10,
        color: '#696969',
    },

    titlePost: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#696969',
        paddingRight: 4,
    },

    containerUserAndDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },

    containerUser: {
        flexDirection: 'row',
        marginTop: 10,
    },

    iconUser: {
        marginRight: 5,
        color: '#696969',
    },

    textUser: {
        fontSize: 10,
        color: '#696969',
    },

    containerDate: {
        flexDirection: 'row',
        marginTop: 10,
        paddingRight: 13,
    },

    iconDate: {
        marginRight: 5,
        color: '#333333',
    },

    textDate: {
        fontSize: 10,
        color: '#333333',
    },
});