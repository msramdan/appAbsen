import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    FlatList,
    StyleSheet,
} from 'react-native';

import React, { useState, useEffect } from 'react';

//import material icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import api services
import Api from '../../services/Api';

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

    //init state
    const [posts, setPosts] = useState([]);
    const [nextPageURL, setNextPageURL] = useState(null);
    const [loadingLoadMore, setLoadingLoadMore] = useState(false);

    //hook useEffect
    useEffect(() => {
        //call method "fetchDataPosts"
        loadNews();
    }, []);


    const loadNews = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/news', {
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

    //method getNextData
    const getNextData = async () => {
        //set loading true
        setLoadingLoadMore(true);

        if (nextPageURL != null) {
            await Api.get(nextPageURL).then(response => {
                //assign data to state
                setPosts([...posts, ...response.data.data.data]);

                //assign nextPageURL to state
                setNextPageURL(response.data.data.next_page_url);

                //set loading false
                setLoadingLoadMore(false);
            });
        } else {
            // no data next page
            setLoadingLoadMore(false);
        }
    };

    return (
        <SafeAreaView>
            <ScrollView style={{ padding: 15 }}>
                {/* posts / berita */}
                <View style={styles.labelContainer}>
                    <MaterialCommunityIcons
                        name="newspaper-variant-multiple"
                        style={styles.labelIcon}
                        size={20}
                    />
                    <Text style={styles.labelText}>BERITA</Text>
                </View>
                <View>
                    {loadingNews ? (
                        <Loading />
                    ) : (
                        <>
                            <FlatList
                                style={styles.container}
                                data={news}
                                renderItem={({ item, index, separators }) => (
                                    <ListPost data={item} index={index} />
                                )}
                                eyExtractor={item => item.id}
                                scrollEnabled={false}
                                onEndReached={getNextData}
                                onEndReachedThreshold={0.5}
                            />
                            {loadingLoadMore ? <Loading /> : null}
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