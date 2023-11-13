import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Image,
    FlatList,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    PermissionsAndroid,
    Linking,
} from 'react-native';

import React, { useState, useEffect } from 'react';

//import carousel
import Carousel from 'react-native-snap-carousel';

//import material icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import dimensions
import { windowWidth } from '../../utils/Dimensions';

//import api services
import Api from '../../services/Api';

//import component Loading
import Loading from '../../components/Loading';

//import component slider
import Slider from '../../components/Slider';

//import component list post
import ListPost from '../../components/ListPost';
import { useIsFocused } from '@react-navigation/native';

import { launchCamera } from 'react-native-image-picker';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { useToast } from 'react-native-toast-notifications';
import NetInfo from "@react-native-community/netinfo";
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, checkMultiple } from "react-native-permissions";
import Axios from '../../utils/Axios';

export default function HomeScreen() {
    //init state sliders
    const [loadingSliders, setLoadingSliders] = useState(true);
    const [sliders, setSliders] = useState([]);

    //init state posts
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [posts, setPosts] = useState([]);
    const isFocused = useIsFocused()
    const toast = useToast()
    const [dialogAskLocation, setDialogAskLocation] = useState(false)
    const [dialogOpenSetting, setDialogOpenSetting] = useState(false)

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

    /**
     * Prevent Back Button
     * 
     */
    useEffect(() => {
        if (isFocused) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
                return () => { };
            })

            return () => backHandler.remove()
        } else {
            return () => { }
        }
    }, [])

    const requestLocationPermission = async (cb) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Izinkan akses lokasi?',
                    message: 'Akses lokasi wajib diizinkan, guna diperlukan untuk proses absensi berdasarkan cabang kantor',
                    buttonNeutral: 'Tanya lagi nanti',
                    buttonNegative: 'Tolak',
                    buttonPositive: 'Oke',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                cb(true, granted)
            } else {
                cb(false, granted)
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const checkPermissionStatus = (cb) => {
        checkMultiple([PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION]).then(async (res) => {
            cb(res[PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] == 'granted' && res[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] == 'granted')
        })
    }

    const permissionHandler = (cb) => {
        checkPermissionStatus((status) => {
            if (!status) {
                setDialogAskLocation(true)
            } else {
                cb()
            }
        })
    }

    const doClockIn = () => {
        permissionHandler(() => {
            doClockInFunc()
        })
    }

    const doClockInFunc = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                toast.show('Periksa koneksi internet anda untuk melakukan absensi', {
                    type: 'danger',
                    placement: 'center'
                })
            } else {
                Geolocation.getCurrentPosition(
                    async (position) => {

                        const photoResult = await launchCamera({
                            mediaType: 'photo',
                            cameraType: 'front'
                        })

                        const formData = new FormData();

                        const photo = photoResult.assets[0]
                        formData.append('photo', {
                            uri: photo.uri,
                            type: photo.type,
                            name: photo.fileName,
                        })
                        formData.append('latitude', position.coords.latitude)
                        formData.append('longitude', position.coords.longitude)

                        Axios.post('/attendances/clock-in', formData, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
                        }).then((res) => {
                            toast.show('Clock In successfully', {
                                type: 'success',
                                placement: 'center'
                            })
                        }).catch((err) => {
                            toast.show(err.response.data.error, {
                                type: 'danger',
                                placement: 'center'
                            })
                        })
                    })
            }
        });
    }

    return (
        <SafeAreaView>

            {/* Confirm Dialog */}
            <ConfirmDialog
                title="Akses Lokasi Diperlukan"
                message="Izinkan aplikasi untuk mengakses lokasi?. Izin ini diperlukan untuk kebutuhan lokasi absensi"
                visible={dialogOpenSetting}
                onTouchOutside={() => setDialogOpenSetting(false)}
                positiveButton={{
                    title: "YES",
                    onPress: () => {
                        setDialogOpenSetting(false)
                        Linking.openSettings()
                    }
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => {
                        setDialogOpenSetting(false)
                    }
                }}
            />
            {/* End of Confirm Dialog */}

            {/* Confirm Dialog */}
            <ConfirmDialog
                title="Akses Lokasi Diperlukan"
                message="Izinkan aplikasi untuk mengakses lokasi?. Izin ini diperlukan untuk kebutuhan lokasi absensi"
                visible={dialogAskLocation}
                onTouchOutside={() => setDialogAskLocation(false)}
                positiveButton={{
                    title: "YES",
                    onPress: () => {
                        setDialogAskLocation(false)

                        requestLocationPermission((statusPermissions, statusName) => {
                            if (!statusPermissions) {
                                if (statusName == 'never_ask_again') {
                                    setDialogOpenSetting(true)
                                } else {
                                    toast.show('Tidak bisa melakukan absensi, Harap berikan izin aplikasi untuk mengakses lokasi', {
                                        type: 'danger',
                                        placement: 'center'
                                    })
                                }
                            } else {
                                doClockInFunc()
                            }
                        })
                    }
                }}
                negativeButton={{
                    title: "NO",
                    onPress: () => {
                        setDialogAskLocation(false)
                    }
                }}
            />
            {/* End of Confirm Dialog */}
            {/* header */}
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTextColor}>Selamat Datang</Text>
                        <Text style={styles.headerTextTwoColor}>
                            Muhammad Saeful Ramdan
                        </Text>
                    </View>
                    <View style={styles.headerImageContainer}>
                        <Image
                            source={require('../../assets/images/icon.png')}
                            style={styles.headerLogo}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.headerBorderBottom}></View>
            <ScrollView style={{ padding: 15 }}>
                {/* carousel */}
                <View style={styles.sliderContainer}>
                    {loadingSliders ? (
                        <Loading />
                    ) : (
                        <Carousel
                            data={sliders}
                            renderItem={({ item, index, separators }) => (
                                <Slider data={item} index={index} />
                            )}
                            sliderWidth={windowWidth - 30}
                            itemWidth={300}
                            loop={true}
                        />
                    )}
                </View>
                {/* Menu */}
                <View style={styles.productContainer}>
                    <Text style={[styles.productText, { marginBottom: 10 }]}>MAIN MENU</Text>
                    <View style={{ gap: 15, flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={doClockIn}
                            style={{
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                flex: 1,
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 5
                            }}>
                            <MaterialCommunityIcons
                                name="location-enter"
                                style={styles.postIcon}
                                size={25}
                            />
                            <Text style={{ marginTop: 5 }}>Absen Masuk</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text>Absen Masuk</Text>

                        </View>
                        <View style={{ flex: 1 }}>
                            <Text>Absen Masuk</Text>
                        </View>
                    </View>
                </View>
                {/* End of Menu */}
                {/* posts / berita */}
                <View style={styles.postContainer}>
                    <MaterialCommunityIcons
                        name="newspaper-variant-multiple"
                        style={styles.postIcon}
                        size={20}
                    />
                    <Text style={styles.postText}>BERITA TERBARU</Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    {loadingPosts ? (
                        <Loading />
                    ) : (
                        <>
                            <FlatList
                                style={{ flex: 1, marginTop: 10, marginBottom: 260 }}
                                data={posts}
                                renderItem={({ item, index, separators }) => (
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
        backgroundColor: '#3498db',
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
        backgroundColor: '#104994',
        padding: 3,
    },

    sliderContainer: {
        marginTop: 15,
    },

    productContainer: {
        marginTop: 30,
        flexDirection: 'column',
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
