import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  FlatList,
  StyleSheet,
} from 'react-native';

import React, {useState, useEffect} from 'react';

//import material icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import api services
import Api from '../../services/Api';

//import component loading
import Loading from '../../components/Loading';

//import component list post
import ListPost from '../../components/ListPost';

export default function PostsIndexScreen() {
  //init state
  const [posts, setPosts] = useState([]);
  const [nextPageURL, setNextPageURL] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);

  //method fetchDataPosts
  const fetchDataPosts = async () => {
    //set loading true
    setLoadingPosts(true);

    await Api.get('/api/public/posts').then(response => {
      //assign data to state
      setPosts(response.data.data.data);

      //assign nextPageURL to state
      setNextPageURL(response.data.data.next_page_url);

      //set loading false
      setLoadingPosts(false);
    });
  };

  //hook useEffect
  useEffect(() => {
    //call method "fetchDataPosts"
    fetchDataPosts();
  }, []);

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
      <ScrollView style={{padding: 15}}>
        {/* posts / berita */}
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons
            name="newspaper-variant-multiple"
            style={styles.labelIcon}
            size={20}
          />
          <Text style={styles.labelText}>BERITA DESA</Text>
        </View>
        <View>
          {loadingPosts ? (
            <Loading />
          ) : (
            <>
              <FlatList
                style={styles.container}
                data={posts}
                renderItem={({item, index, separators}) => (
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