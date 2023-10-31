import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';

import React, {useState, useEffect} from 'react';

//import carousel
import Carousel from 'react-native-snap-carousel';

//import dimensions
import {windowWidth} from '../../utils/Dimensions';

//import api services
import Api from '../../services/Api';

//import component Loading
import Loading from '../../components/Loading';

//import component slider
import Slider from '../../components/Slider';

//import component list post
import ListPost from '../../components/ListPost';

export default function HomeScreen() {
  //init state sliders
  const [loadingSliders, setLoadingSliders] = useState(true);
  const [sliders, setSliders] = useState([]);

  //init state posts
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [posts, setPosts] = useState([]);

  //method fetchDataSliders
  const fetchDataSliders = async () => {
    //set loading true
    setLoadingSliders(true);

    await Api.get('/api/public/sliders').then(response => {
      //assign data to state
      setSliders(response.data.data);

      //set loading false
      setLoadingSliders(false);
    });
  };

  //method fetchDataPosts
  const fetchDataPosts = async () => {
    //set loading true
    setLoadingPosts(true);

    await Api.get('/api/public/posts_home').then(response => {
      //assign data to state
      setPosts(response.data.data);

      //set loading false
      setLoadingPosts(false);
    });
  };

  //hook useEffect
  useEffect(() => {
    //call method "fetchDataSliders"
    fetchDataSliders();

    //call method "fetchDataPosts"
    fetchDataPosts();
  }, []);

  return (
    <SafeAreaView>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.headerContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTextColor}>Selamat Datang</Text>
            <Text style={styles.headerTextTwoColor}>
              Desa Santri, Kab. Jombang
            </Text>
          </View>
          <View style={styles.headerImageContainer}>
            <Image
              source={require('../../assets/images/logo-jbg.png')}
              style={styles.headerLogo}
            />
          </View>
        </View>
      </View>
      <View style={styles.headerBorderBottom}></View>
      <ScrollView style={{padding: 15}}>
        {/* carousel */}
        <View style={styles.sliderContainer}>
          {loadingSliders ? (
            <Loading />
          ) : (
            <Carousel
              data={sliders}
              renderItem={({item, index, separators}) => (
                <Slider data={item} index={index} />
              )}
              sliderWidth={windowWidth - 30}
              itemWidth={300}
              loop={true}
            />
          )}
        </View>

        {/* products */}
        <View style={styles.productContainer}>
          <Text style={styles.productText}>MAIN MENU</Text>
        </View>

        {/* Menu */}

        {/* posts / berita */}
        <View style={styles.postContainer}>
          <Text style={styles.postText}>BERITA TERBARU</Text>
        </View>
        <View>
          {loadingPosts ? (
            <Loading />
          ) : (
            <>
              <FlatList
                style={{flex: 1, marginTop: 10, marginBottom: 260}}
                data={posts}
                renderItem={({item, index, separators}) => (
                  <ListPost data={item} index={index} />
                )}
                eyExtractor={item => item.id}
                scrollEnabled={false}
              />
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'green',
    padding: 20,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerTextContainer: {
    marginTop: 5,
  },

  headerTextColor: {
    color: 'white',
  },

  headerTextTwoColor: {
    color: 'white',
    fontSize: 18,
  },

  headerImageContainer: {
    alignContent: 'center',
    alignItems: 'center',
  },

  headerLogo: {
    width: 60,
    height: 60,
  },

  headerBorderBottom: {
    backgroundColor: 'orange',
    padding: 3,
  },

  sliderContainer: {
    marginTop: 15,
  },

  productContainer: {
    marginTop: 30,
    flexDirection: 'row',
  },

  productIcon: {
    marginRight: 5,
    color: '#333333',
  },

  productText: {
    color: '#333333',
    fontWeight: 'bold',
  },

  postContainer: {
    marginTop: 30,
    flexDirection: 'row',
  },

  postIcon: {
    marginRight: 5,
    color: '#333333',
  },

  postText: {
    color: '#333333',
    fontWeight: 'bold',
  },
});
