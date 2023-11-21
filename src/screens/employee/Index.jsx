import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    RefreshControl
} from 'react-native';

import React, { useState, useEffect } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Loading from '../../components/Loading';
import ListEmployee from '../../components/ListEmployee';
import Axios from '../../utils/Axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from '../../utils/Redirect';

export default function EmployeeScreen({ navigation }) {

    const [employees, setEmployees] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    /**
     * Main Utils
     * 
     */
    const [refresh, setRefersh] = useState(false)

    /**
     * Filter State
     * 
     */
    const [filterName, setFilterName] = useState('')

    useEffect(() => {
        loadDataEmployee();
    }, []);

    useEffect(() => {
        const formattedApiSourceUrl = '/employees'
            + '?name=' + `${filterName}`

        loadDataEmployee(formattedApiSourceUrl)
    }, [filterName])

    const loadDataEmployee = async (apiSourceUrl = null) => {
        setLoadingPosts(true);

        const token = await AsyncStorage.getItem('apiToken')

        Axios.get(apiSourceUrl ? apiSourceUrl : '/employees', {
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
                    Redirect.toLoginScreen(navigation)
                }
            });
    };

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefersh(true)

                            setFilterName(null)
                            loadDataEmployee()

                            setRefersh(false)
                        }}
                    />}
                style={{ padding: 15 }}>
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons
                        name="account"
                        style={styles.labelIcon}
                        size={20}
                    />
                    <Text style={styles.labelText}>EMPLOYEES</Text>
                </View>

                <View style={styles.filterWrapper}>
                    <View style={{ flex: 5 }}>
                        <Text style={{
                            marginBottom: 5
                        }}>Name</Text>
                        <TextInput
                            style={[styles.input, { color: '#333' }]}
                            placeholder="Name"
                            value={filterName}
                            onChangeText={text => setFilterName(text)}
                        />
                    </View>
                </View>

                <View
                    style={styles.employeeListsContainer}
                >
                    {loadingPosts ? (
                        <Loading />
                    ) : (
                        <>
                            <FlatList
                                style={styles.container}
                                data={employees.data}
                                renderItem={({ item, index, separators }) => (
                                    <ListEmployee employee={item} index={index} />
                                )}
                                eyExtractor={item => item.id}
                                scrollEnabled={false}
                                onEndReachedThreshold={0.5}
                            />

                            {/* Pagination */}
                            <View
                                style={styles.wrapperPrevNextButton}
                            >
                                {
                                    employees.prev_page_url ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                const splittedUrl = employees.prev_page_url.split('/api/mobile')

                                                loadDataEmployee(splittedUrl[splittedUrl.length - 1] + `&name=${filterName}`)
                                            }}
                                            style={styles.prevNextButton}
                                        >
                                            <Text
                                                style={styles.prevNextButtonText}
                                            >Previous</Text>
                                        </TouchableOpacity> : <></>
                                }
                                {
                                    employees.next_page_url ?
                                        <TouchableOpacity
                                            onPress={() => {
                                                const splittedUrl = employees.next_page_url.split('/api/mobile')

                                                loadDataEmployee(splittedUrl[splittedUrl.length - 1])
                                            }}
                                            style={styles.prevNextButton}
                                        >
                                            <Text
                                                style={styles.prevNextButtonText}
                                            >Next</Text>
                                        </TouchableOpacity> : <></>
                                }
                            </View>
                            {/* End of Pagination */}
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
        marginBottom: 14
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
    employeeListsContainer: {
        paddingBottom: 150
    },
    wrapperPrevNextButton: {
        flexDirection: 'row',
        gap: 9,
        marginTop: -10
    },
    prevNextButton: {
        paddingVertical: 7,
        flex: 1,
        borderWidth: 1,
        borderColor: '#0ea5e9',
        borderRadius: 6,
        backgroundColor: 'white'
    },
    prevNextButtonText: {
        color: '#0ea5e9',
        fontWeight: '500',
        textAlign: 'center'
    },
    filterWrapper: {
        flexDirection: 'row',
        gap: 10
    },
    filterButtonWrapper: {
        justifyContent: 'flex-end'
    },
    filterButton: {
        marginBottom: 10,
        backgroundColor: '#1f2937',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});