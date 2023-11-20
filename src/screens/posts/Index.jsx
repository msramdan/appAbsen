import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

import React, { useState, useEffect } from 'react';

//import material icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import component loading
import Loading from '../../components/Loading';

//import component list post
import ListPost from '../../components/ListPost';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from '../../utils/Redirect';
import Axios from '../../utils/Axios';

export default function PostsIndexScreen() {

    /**
     * Main Data
     * 
     */
    const [news, setNews] = useState([])

    /**
     * News Utils State
     * 
     */
    const [loadingNews, setLoadingNews] = useState(true)

    const [refresh, setRefersh] = useState(false)

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async (apiSourceUrl = null) => {
        setLoadingNews(true)
        const token = await AsyncStorage.getItem('apiToken')

        setLoadingNews(true)
        Axios.get(apiSourceUrl ? apiSourceUrl : '/news', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setNews(res.data.data)
                setLoadingNews(false)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        })
    }

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefersh(true)

                            loadNews()

                            setRefersh(false)
                        }}
                    />}
                style={{ padding: 15 }}>

                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons
                        name="newspaper-variant-multiple"
                        style={styles.labelIcon}
                        size={20}
                    />
                    <Text style={styles.labelText}>NEWS</Text>
                </View>

                <View
                    style={styles.newsContainer}
                >
                    <View>
                        <View>
                            {loadingNews ? (
                                <Loading />
                            ) : (
                                <>
                                    <FlatList
                                        style={styles.container}
                                        data={news.data}
                                        renderItem={({ item, index, separators }) => (
                                            <ListPost data={item} index={index} />
                                        )}
                                        eyExtractor={item => item.id}
                                        scrollEnabled={false}
                                    />

                                    {/* Pagination */}
                                    <View
                                        style={styles.wrapperPrevNextButton}
                                    >
                                        {
                                            news.prev_page_url ?
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const splittedUrl = news.prev_page_url.split('/api/mobile')

                                                        loadNews(splittedUrl[splittedUrl.length - 1])
                                                    }}
                                                    style={styles.prevNextButton}
                                                >
                                                    <Text
                                                        style={styles.prevNextButtonText}
                                                    >Previous</Text>
                                                </TouchableOpacity> : <></>
                                        }
                                        {
                                            news.next_page_url ?
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        const splittedUrl = news.next_page_url.split('/api/mobile')

                                                        loadNews(splittedUrl[splittedUrl.length - 1])
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
                    </View>
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
    newsContainer: {
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
    }
});