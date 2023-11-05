import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import React from 'react';

export default function Loading(props) {
    return (
        <View style={[styles.container, props.style]}>
            <ActivityIndicator size="large" color="#e91e63" />
            <Text style={styles.text}>Loading...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        marginTop: 5,
        color: '#333333',
    },
});