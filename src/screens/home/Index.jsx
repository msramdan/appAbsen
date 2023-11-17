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
    Dimensions,
    TextInput,
} from 'react-native';
import Modal from "react-native-modal";
import RNPickerSelect from 'react-native-picker-select';
import React, { useState, useEffect } from 'react';
import DocumentPicker from 'react-native-document-picker'

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
import { Redirect } from '../../utils/Redirect';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';

export default function HomeScreen({ navigation }) {

    /**
     * Main Data
     * 
     */
    const [stateTodayPresence, setStateTodayPresence] = useState(false)
    const [stateTodayIzinOrSakit, setStateTodayIzinOrSakit] = useState(false)
    const [currentAuthEmployee, setCurrentAuthEmployee] = useState(null)
    const [banners, setBanners] = useState([])
    const [news, setNews] = useState([])
    const [employeesTodayNotPreset, setEmployeesTodayNotPreset] = useState([])
    const [arrHistoryPresenceMonthly, setArrHistoryPresenceMonthly] = useState([])
    const [arrHistoryPengajuanCuti, setArrHistoryPengajuanCuti] = useState([])
    const [arrHistoryPengajuanIzinSakit, setArrHistoryPengajuanIzinSakit] = useState([])

    /**
     * History Pengajuan Izin / Sakit Utils State
     * 
     */
    const [loadingHistoryPengajuanIzinSakit, setLoadingHistoryPengajuanIzinSakit] = useState(true)
    const [objDetailHistoryPengajuanIzinSakit, setObjDetailHistoryPengajuanIzinSakit] = useState({})
    const [showModalDetailHistoryPengajuanIzinSakit, setShowModalDetailHistoryPengajuanIzinSakit] = useState(false)

    /**
     * History Pengajuan Cuti Utils State
     * 
     */
    const [loadingHistoryPengajuanCuti, setLoadingHistoryPengajuanCuti] = useState(true)
    const [objDetailHistoryPengajuanCuti, setObjDetailHistoryPengajuanCuti] = useState({})
    const [showModalDetailHistoryPengajuanCuti, setShowModalDetailHistoryPengajuanCuti] = useState(false)

    /**
     * History Presence Monthly Utils State
     * 
     */
    const [loadingHistoryPresenceMonthly, setLoadingHistoryPresenceMonthly] = useState(true)

    /**
     * Employees Today Not Present Utils State
     * 
     */
    const [loadingEmployeesTodayNotPresent, setLoadingEmployeesTodayNotPresent] = useState(true)

    /**
     * News Utils State
     * 
     */
    const [loadingNews, setLoadingNews] = useState(true)

    /**
     * Banners Utils State
     * 
     */
    const [loadingBanners, setLoadingBanners] = useState(true)

    /**
     * Pengajuan Revisi Absen Utils State
     * 
     */
    const [buttonPengajuanRevisiAbsenEnabled, setButtonPengajuanRevisiAbsenEnabled] = useState(true)
    const [showModalPengajuanRevisiAbsen, setShowModalPengajuanRevisiAbsen] = useState(false)
    const [loadingDoPengajuanRevisiAbsen, setLoadingDoPengajuanRevisiAbsen] = useState(false)
    const [errorMessageDoPengajuanRevisiAbsen, setErrorMessageDoPengajuanRevisiAbsen] = useState('')
    const [pengajuanRevisiAbsenDate, setPengajuanRevisiAbsenDate] = useState(new Date())
    const [pengajuanRevisiAbsenClockIn, setPengajuanRevisiAbsenClockIn] = useState(new Date())
    const [pengajuanRevisiAbsenClockOut, setPengajuanRevisiAbsenClockOut] = useState(new Date())
    const [showDatePickerPengajuanRevisiAbsenDate, setShowDatePickerPengajuanRevisiAbsenDate] = useState(false)
    const [showDatePickerPengajuanRevisiAbsenClockIn, setShowDatePickerPengajuanRevisiAbsenClockIn] = useState(false)
    const [showDatePickerPengajuanRevisiAbsenClockOut, setShowDatePickerPengajuanRevisiAbsenClockOut] = useState(false)
    const [pengajuanRevisiAbsenReason, setPengajuanRevisiAbsenReason] = useState('')

    /**
     * Pengajuan Cuti Utils State
     * 
     */
    const [buttonPengajuanCutiEnabled, setButtonPengajuanCutiEnabled] = useState(true)
    const [showModalPengajuanCuti, setShowModalPengajuanCuti] = useState(false)
    const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false)
    const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false)
    const [pengajuanCutiStartDate, setPengajuanCutiStartDate] = useState(new Date())
    const [pengajuanCutiEndDate, setPengajuanCutiEndDate] = useState(new Date())
    const [pengajuanCutiReason, setPengajuanCutiReason] = useState('')
    const [fileAttachmentPengajuanCuti, setfileAttachmentPengajuanCuti] = useState(null)
    const [errorMessageDoPengajuanCuti, setErrorMessageDoPengajuanCuti] = useState('')
    const [loadingDoPengajuanCuti, setLoadingDoPengajuanCuti] = useState(false)

    /**
     * Clock In Utils State
     * 
     */
    const [showModalClockIn, setShowModalClockIn] = useState(false)
    const [photoClockIn, setPhotoClockIn] = useState(null)
    const [errorMessageDoClockIn, setErrorMessageDoClockIn] = useState(null)
    const [loadingDoClockIn, setLoadingDoClockIn] = useState(false)
    const [buttonClockInEnabled, setButtonClockInEnabled] = useState(false)

    /**
     * Clock Out Utils State
     * 
     */
    const [buttonClockOutEnabled, setButtonClockOutEnabled] = useState(false)
    const [showModalClockOut, setShowModalClockOut] = useState(false)
    const [photoClockOut, setPhotoClockOut] = useState(null)
    const [errorMessageDoClockOut, setErrorMessageDoClockOut] = useState(null)
    const [loadingDoClockOut, setLoadingDoClockOut] = useState(false)
    const [fileAttachmentIzinOrSakit, setfileAttachmentIzinOrSakit] = useState(null)

    /**
     * Izin atau Sakit Utils State
     * 
     */
    const [buttonIzinOrSakitEnabled, setButtonIzinOrSakitEnabled] = useState(false)
    const [showModalIzinAtauSakit, setShowModalIzinAtauSakit] = useState(false)
    const [loadingDoIzinAtauSakit, setLoadingDoIzinAtauSakit] = useState(false)
    const [errorMessageDoIzinAtauSakit, setErrorMessageDoIzinAtauSakit] = useState(null)
    const [selectedEnumIzinSakit, setSelectedEnumIzinSakit] = useState('Izin')
    const [detailedDescription, setDetailedDescription] = useState('')

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

    useEffect(() => {
        loadStateTodayPresence()
        loadStateCurrentAuthEmployee()
        loadStateTodayIzinOrSakit()
        loadBanners()
        loadNews()
        loadEmployeesTodayNotPreset()
        loadArrHistoryPresenceMonthly()
        loadArrHistoryPengajuanCuti()
        loadArrHistoryPengajuanIzinSakit()
    }, [])

    useEffect(() => {
        if (!stateTodayPresence && !stateTodayIzinOrSakit) {
            setButtonClockInEnabled(true)
        }
    }, [stateTodayPresence, stateTodayIzinOrSakit])

    useEffect(() => {
        if (stateTodayIzinOrSakit) {
            if (stateTodayIzinOrSakit.status == 'Rejected') {
                setButtonIzinOrSakitEnabled(true)
            }
        } else {
            if (stateTodayPresence) {
                setButtonIzinOrSakitEnabled(false)
            } else {
                setButtonIzinOrSakitEnabled(true)
            }
        }
    }, [stateTodayPresence, stateTodayIzinOrSakit])

    useEffect(() => {
        if (stateTodayPresence) {
            setButtonClockOutEnabled(stateTodayPresence.is_present == 'Yes' && !stateTodayPresence.clock_out)
        }
    }, [stateTodayPresence])

    const loadArrHistoryPresenceMonthly = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/attendances/history-presence-monthly', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setArrHistoryPresenceMonthly(res.data.data)

                setLoadingHistoryPresenceMonthly(false)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        })
    }

    const loadArrHistoryPengajuanCuti = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/attendances/current-employee-pengajuan-cuti', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setArrHistoryPengajuanCuti(res.data.data)

                setLoadingHistoryPengajuanCuti(false)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        })
    }

    const loadArrHistoryPengajuanIzinSakit = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/attendances/current-employee-pengajuan-izin-sakit', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setArrHistoryPengajuanIzinSakit(res.data.data)

                setLoadingHistoryPengajuanIzinSakit(false)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        })
    }

    const loadEmployeesTodayNotPreset = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/attendances/all-employees-today-not-present', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setEmployeesTodayNotPreset(res.data.data)

                setLoadingEmployeesTodayNotPresent(false)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        })
    }

    const loadBanners = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/banners', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setBanners(res.data.data)
                setLoadingBanners(false)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        })
    }

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

    const loadStateTodayPresence = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/attendances/today-presence', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
            .then((res) => {
                if (res) {
                    setStateTodayPresence(res.data.data)
                }
            }).catch((err) => {
                if (err.response.status == 401) {
                    Redirect.toLoginScreen(navigation)
                }
            })
    }

    const loadStateTodayIzinOrSakit = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/attendances/today-izin-sakit', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
            .then((res) => {
                if (res) {
                    setStateTodayIzinOrSakit(res.data.data)
                }
            }).catch((err) => {
                if (err.response.status == 401) {
                    Redirect.toLoginScreen(navigation)
                }
            })
    }

    const loadStateCurrentAuthEmployee = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/auth/employee', {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        })
            .then((res) => {
                if (res) {
                    setCurrentAuthEmployee(res.data.data)
                }
            }).catch((err) => {
                if (err.response.status == 401) {
                    Redirect.toLoginScreen(navigation)
                }
            })
    }

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

    const doTakeAPhotoClockIn = async () => {
        const photoResult = await launchCamera({
            mediaType: 'photo',
            cameraType: 'front'
        })

        if (photoResult.assets.length > 0) {
            setPhotoClockIn(photoResult.assets[0])
        }
    }

    const doTakeAPhotoClockOut = async () => {
        const photoResult = await launchCamera({
            mediaType: 'photo',
            cameraType: 'front'
        })

        if (photoResult.assets.length > 0) {
            setPhotoClockOut(photoResult.assets[0])
        }
    }

    const doClockIn = () => {
        setErrorMessageDoClockIn(null)
        setLoadingDoClockIn(true)

        if (photoClockIn) {
            permissionHandler(() => {
                if (currentAuthEmployee.use_gps_location == 'Yes') {
                    doClockInUsingGPSFunc()
                } else {
                    doClockInWithoutGPSFunc()
                }
            })
        } else {
            setErrorMessageDoClockIn('Please, take your photo first')
            setLoadingDoClockIn(false)
        }
    }

    const doClockOut = () => {
        setErrorMessageDoClockOut(null)
        setLoadingDoClockOut(true)

        if (photoClockOut) {
            permissionHandler(() => {
                if (currentAuthEmployee.use_gps_location == 'Yes') {
                    doClockOutUsingGPSFunc()
                } else {
                    doClockOutWithoutGPSFunc()
                }
            })
        } else {
            setErrorMessageDoClockOut('Please, take your photo first')
            setLoadingDoClockOut(false)
        }
    }

    const doClockInWithoutGPSFunc = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        const formData = new FormData();

        formData.append('photo', {
            uri: photoClockIn.uri,
            type: photoClockIn.type,
            name: photoClockIn.fileName,
        })

        Axios.post('/attendances/clock-in', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => {
            setShowModalClockIn(false)
            loadStateTodayPresence()
            loadStateTodayIzinOrSakit()
            setPhotoClockIn(null)
            setErrorMessageDoClockIn(null)

            setTimeout(() => {
                toast.show('Clock In successfully', {
                    type: 'success',
                    placement: 'center'
                })
            }, 500);
        }).catch((err) => {
            setErrorMessageDoClockIn(err.response.data.error)
        }).finally(() => {
            setLoadingDoClockIn(false)
        })
    }

    const doClockInUsingGPSFunc = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setErrorMessageDoClockIn('Periksa koneksi internet anda untuk melakukan absensi')
            } else {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        const formData = new FormData();

                        formData.append('photo', {
                            uri: photoClockIn.uri,
                            type: photoClockIn.type,
                            name: photoClockIn.fileName,
                        })

                        formData.append('latitude', position.coords.latitude)
                        formData.append('longitude', position.coords.longitude)

                        Axios.post('/attendances/clock-in', formData, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
                        }).then((res) => {
                            setShowModalClockIn(false)
                            loadStateTodayPresence()
                            loadStateTodayIzinOrSakit()
                            setPhotoClockIn(null)
                            setErrorMessageDoClockIn(null)

                            setTimeout(() => {
                                toast.show('Clock In successfully', {
                                    type: 'success',
                                    placement: 'center'
                                })
                            }, 500);
                        }).catch((err) => {
                            setErrorMessageDoClockIn(err.response.data.error)
                        }).finally(() => {
                            setLoadingDoClockIn(false)
                        })
                    })
            }
        });
    }

    const doClockOutWithoutGPSFunc = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        const formData = new FormData();

        formData.append('photo', {
            uri: photoClockOut.uri,
            type: photoClockOut.type,
            name: photoClockOut.fileName,
        })

        Axios.post('/attendances/clock-out', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => {
            setShowModalClockOut(false)
            loadStateTodayPresence()
            loadStateTodayIzinOrSakit()
            setPhotoClockOut(null)
            setErrorMessageDoClockOut(null)

            setTimeout(() => {
                toast.show('Clock Out successfully', {
                    type: 'success',
                    placement: 'center'
                })
            }, 500);
        }).catch((err) => {
            setErrorMessageDoClockOut(err.response.data.error)
        }).finally(() => {
            setLoadingDoClockOut(false)
        })
    }

    const doClockOutUsingGPSFunc = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        NetInfo.fetch().then(state => {
            if (!state.isConnected) {
                setErrorMessageDoClockOut('Periksa koneksi internet anda untuk melakukan absensi')
            } else {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        const formData = new FormData();

                        formData.append('photo', {
                            uri: photoClockOut.uri,
                            type: photoClockOut.type,
                            name: photoClockOut.fileName,
                        })

                        formData.append('latitude', position.coords.latitude)
                        formData.append('longitude', position.coords.longitude)

                        Axios.post('/attendances/clock-out', formData, {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                            }
                        }).then((res) => {
                            setShowModalClockOut(false)
                            loadStateTodayPresence()
                            loadStateTodayIzinOrSakit()
                            setPhotoClockOut(null)
                            setErrorMessageDoClockOut(null)

                            setTimeout(() => {
                                toast.show('Clock Out successfully', {
                                    type: 'success',
                                    placement: 'center'
                                })
                            }, 500);
                        }).catch((err) => {
                            setErrorMessageDoClockOut(err.response.data.error)
                        }).finally(() => {
                            setLoadingDoClockOut(false)
                        })
                    })
            }
        });
    }

    const doOpenDocumentPicker = async () => {
        const response = await DocumentPicker.pick({
            presentationStyle: 'fullScreen',
        });

        if (response.length > 0) {
            setfileAttachmentIzinOrSakit(response[0])
        }
    }

    const doOpenDocumentPickerPengajuanCuti = async () => {
        const response = await DocumentPicker.pick({
            presentationStyle: 'fullScreen',
        });

        if (response.length > 0) {
            setfileAttachmentPengajuanCuti(response[0])
        }
    }

    const doIzinOrSakit = async () => {

        setErrorMessageDoIzinAtauSakit(null)
        const formData = new FormData();
        const token = await AsyncStorage.getItem('apiToken')

        formData.append('description', selectedEnumIzinSakit)
        formData.append('detailed_description', detailedDescription)

        if (fileAttachmentIzinOrSakit) {
            formData.append('file_attachment', {
                uri: fileAttachmentIzinOrSakit.uri,
                type: fileAttachmentIzinOrSakit.type,
                name: fileAttachmentIzinOrSakit.name,
            })
        }

        setLoadingDoIzinAtauSakit(true)

        Axios.post('/attendances/izin-or-sakit', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => {
            if (res) {
                setShowModalIzinAtauSakit(false)
                loadStateTodayPresence()
                loadStateTodayIzinOrSakit()
                setfileAttachmentIzinOrSakit(null)
                setErrorMessageDoIzinAtauSakit(null)

                setTimeout(() => {
                    toast.show(res.data.msg, {
                        type: 'success',
                        placement: 'center'
                    })
                }, 500);
            }
        }).catch((err) => {
            setErrorMessageDoIzinAtauSakit(err.response.data.error)
        }).finally(() => {
            setLoadingDoIzinAtauSakit(false)
        })
    }

    const doPengajuanCuti = async () => {
        setErrorMessageDoPengajuanCuti(null)

        if (!fileAttachmentPengajuanCuti) {
            setErrorMessageDoPengajuanCuti('File Dokumen Wajib Diisi')
            return
        }

        const formData = new FormData();
        const token = await AsyncStorage.getItem('apiToken')

        formData.append('start_date', `${pengajuanCutiStartDate.getFullYear()}-${parseInt(pengajuanCutiStartDate.getMonth() + 1) < 10 ? `0${parseInt(pengajuanCutiStartDate.getMonth() + 1)}` : parseInt(pengajuanCutiStartDate.getMonth() + 1)}-${parseInt(pengajuanCutiStartDate.getDate()) < 10 ? `0${parseInt(pengajuanCutiStartDate.getDate())}` : parseInt(pengajuanCutiStartDate.getDate())}`)
        formData.append('end_date', `${pengajuanCutiEndDate.getFullYear()}-${parseInt(pengajuanCutiEndDate.getMonth() + 1) < 10 ? `0${parseInt(pengajuanCutiEndDate.getMonth() + 1)}` : parseInt(pengajuanCutiEndDate.getMonth() + 1)}-${parseInt(pengajuanCutiEndDate.getDate()) < 10 ? `0${parseInt(pengajuanCutiEndDate.getDate())}` : parseInt(pengajuanCutiEndDate.getDate())}`)
        formData.append('reason', pengajuanCutiReason)

        formData.append('file_attachment', {
            uri: fileAttachmentPengajuanCuti.uri,
            type: fileAttachmentPengajuanCuti.type,
            name: fileAttachmentPengajuanCuti.name,
        })

        setLoadingDoPengajuanCuti(true)

        Axios.post('/attendances/pengajuan-cuti', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => {
            if (res) {
                setShowModalPengajuanCuti(false)
                loadStateTodayPresence()
                loadStateTodayIzinOrSakit()
                setfileAttachmentPengajuanCuti(null)
                setErrorMessageDoPengajuanCuti(null)

                setTimeout(() => {
                    toast.show(res.data.msg, {
                        type: 'success',
                        placement: 'center'
                    })
                }, 500);
            }
        }).catch((err) => {
            setErrorMessageDoPengajuanCuti(err.response.data.error)
        }).finally(() => {
            setLoadingDoPengajuanCuti(false)
        })
    }

    const doPengajuanRevisiAbsen = async () => {
        setErrorMessageDoPengajuanRevisiAbsen(null)

        const formData = new FormData();
        const token = await AsyncStorage.getItem('apiToken')

        formData.append('date', `${pengajuanRevisiAbsenDate.getFullYear()}-${parseInt(pengajuanRevisiAbsenDate.getMonth() + 1) < 10 ? `0${parseInt(pengajuanRevisiAbsenDate.getMonth() + 1)}` : parseInt(pengajuanRevisiAbsenDate.getMonth() + 1)}-${parseInt(pengajuanRevisiAbsenDate.getDate()) < 10 ? `0${parseInt(pengajuanRevisiAbsenDate.getDate())}` : parseInt(pengajuanRevisiAbsenDate.getDate())}`)
        formData.append('clock_in', `${pengajuanRevisiAbsenClockIn.getHours() > 9 ? pengajuanRevisiAbsenClockIn.getHours() : `0${pengajuanRevisiAbsenClockIn.getHours()}`}:${pengajuanRevisiAbsenClockIn.getMinutes() > 9 ? pengajuanRevisiAbsenClockIn.getMinutes() : `0${pengajuanRevisiAbsenClockIn.getMinutes()}`}`)
        formData.append('clock_out', `${pengajuanRevisiAbsenClockOut.getHours() > 9 ? pengajuanRevisiAbsenClockOut.getHours() : `0${pengajuanRevisiAbsenClockOut.getHours()}`}:${pengajuanRevisiAbsenClockOut.getMinutes() > 9 ? pengajuanRevisiAbsenClockOut.getMinutes() : `0${pengajuanRevisiAbsenClockOut.getMinutes()}`}`)
        formData.append('reason', pengajuanRevisiAbsenReason)

        setLoadingDoPengajuanRevisiAbsen(true)

        Axios.post('/attendances/pengajuan-revisi-absen', formData, {
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        }).then((res) => {
            if (res) {
                setShowModalPengajuanRevisiAbsen(false)
                loadStateTodayPresence()
                loadStateTodayIzinOrSakit()
                setErrorMessageDoPengajuanRevisiAbsen(null)

                setTimeout(() => {
                    toast.show(res.data.msg, {
                        type: 'success',
                        placement: 'center'
                    })
                }, 500);
            }
        }).catch((err) => {
            setErrorMessageDoPengajuanRevisiAbsen(err.response.data.error)
        }).finally(() => {
            setLoadingDoPengajuanRevisiAbsen(false)
        })
    }

    return (
        <SafeAreaView>

            {/* Modal Clock In */}
            <Modal isVisible={showModalClockIn}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            {
                                loadingDoClockIn ?
                                    <Loading style={styles.loading} /> : <></>
                            }

                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Clock In</Text>

                            {
                                errorMessageDoClockIn ?
                                    <View
                                        style={{ alignItems: 'center' }}
                                    >
                                        <Text
                                            style={{
                                                width: Dimensions.get('window').width - 100,
                                                backgroundColor: '#ef4444',
                                                color: '#FFF',
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                marginBottom: 10,
                                                marginTop: -7
                                            }}
                                        >
                                            {errorMessageDoClockIn}
                                        </Text>
                                    </View> : <></>
                            }


                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                            >
                                <Image
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        height: Dimensions.get('window').width - 100,
                                        borderRadius: 4
                                    }}
                                    source={photoClockIn ? { uri: photoClockIn.uri } : require('./../../assets/images/no-photo.png')}
                                />
                            </View>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        doTakeAPhotoClockIn()
                                    }}
                                    style={{
                                        borderRadius: 8,
                                        paddingVertical: 15,
                                        marginTop: 12,
                                        width: Dimensions.get('window').width - 100,
                                        backgroundColor: '#3498db',
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name="camera"
                                            style={[styles.postIcon, { color: 'white' }]}
                                            size={22}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >
                                            Ambil Foto
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                ></View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalClockIn(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            doClockIn()
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#22c55e'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Clock In</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Clock In */}

            {/* Modal Clock Out */}
            <Modal isVisible={showModalClockOut}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            {
                                loadingDoClockOut ?
                                    <Loading style={styles.loading} /> : <></>
                            }

                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Clock Out</Text>

                            {
                                errorMessageDoClockOut ?
                                    <View
                                        style={{ alignItems: 'center' }}
                                    >
                                        <Text
                                            style={{
                                                width: Dimensions.get('window').width - 100,
                                                backgroundColor: '#ef4444',
                                                color: '#FFF',
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                marginBottom: 10,
                                                marginTop: -7
                                            }}
                                        >
                                            {errorMessageDoClockOut}
                                        </Text>
                                    </View> : <></>
                            }

                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                            >
                                <Image
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        height: Dimensions.get('window').width - 100,
                                        borderRadius: 4
                                    }}
                                    source={photoClockOut ? { uri: photoClockOut.uri } : require('./../../assets/images/no-photo.png')}
                                />
                            </View>
                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                            >
                                <TouchableOpacity
                                    onPress={() => {
                                        doTakeAPhotoClockOut()
                                    }}
                                    style={{
                                        borderRadius: 8,
                                        paddingVertical: 15,
                                        marginTop: 12,
                                        width: Dimensions.get('window').width - 100,
                                        backgroundColor: '#3498db',
                                    }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <MaterialCommunityIcons
                                            name="camera"
                                            style={[styles.postIcon, { color: 'white' }]}
                                            size={22}
                                        />
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >
                                            Ambil Foto
                                        </Text>
                                    </View>

                                </TouchableOpacity>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                >
                                </View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalClockOut(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            doClockOut()
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#22c55e'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Clock Out</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Clock Out */}

            {/* Modal Izin atau Sakit */}
            <Modal isVisible={showModalIzinAtauSakit}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            {
                                loadingDoIzinAtauSakit ?
                                    <Loading style={styles.loading} /> : <></>
                            }

                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Izin atau Sakit</Text>

                            {
                                errorMessageDoIzinAtauSakit ?
                                    <View
                                        style={{ alignItems: 'center' }}
                                    >
                                        <Text
                                            style={{
                                                width: Dimensions.get('window').width - 100,
                                                backgroundColor: '#ef4444',
                                                color: '#FFF',
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                marginBottom: 10,
                                                marginTop: -7
                                            }}
                                        >
                                            {errorMessageDoIzinAtauSakit}
                                        </Text>
                                    </View> : <></>
                            }

                            <View
                                style={{ flexDirection: 'row', justifyContent: 'center' }}
                            >

                            </View>
                            <View
                                style={{ alignItems: 'center' }}
                            >

                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <Text style={{
                                        marginBottom: 5
                                    }}>Description</Text>
                                    <RNPickerSelect
                                        useNativeAndroidPickerStyle={false}
                                        style={{
                                            inputAndroidContainer: [styles.input],
                                            inputAndroid: {
                                                color: '#333'
                                            }
                                        }}
                                        value={selectedEnumIzinSakit}
                                        placeholder={{}}
                                        onValueChange={(value) => setSelectedEnumIzinSakit(value)}
                                        items={[
                                            { label: 'Izin', value: 'Izin' },
                                            { label: 'Sakit', value: 'Sakit' },
                                        ]}
                                    />
                                </View>

                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <Text style={{
                                        marginBottom: 5
                                    }}>Detailed Description</Text>
                                    <TextInput
                                        style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top' }]}
                                        placeholder="Detailed Description"
                                        multiline={true}
                                        numberOfLines={3}
                                        value={detailedDescription}
                                        onChangeText={text => setDetailedDescription(text)}
                                    />
                                </View>

                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <Text style={{
                                        marginBottom: 5
                                    }}>File Attachment</Text>

                                    {
                                        fileAttachmentIzinOrSakit ?
                                            <Text style={{
                                                marginTop: -2,
                                                marginBottom: 8,
                                                color: '#000'
                                            }}>{fileAttachmentIzinOrSakit.name}</Text> : <></>
                                    }

                                    <TouchableOpacity
                                        onPress={() => {
                                            doOpenDocumentPicker()
                                        }}
                                        style={{
                                            borderWidth: 1,
                                            borderColor: 'gray',
                                            width: 100,
                                            paddingVertical: 6,
                                            paddingHorizontal: 10,
                                            borderRadius: 4
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center'
                                            }}
                                        >Choose File</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                >
                                </View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalIzinAtauSakit(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            doIzinOrSakit()
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#22c55e'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Kirim Pengajuan</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Izin atau Sakit */}

            {/* Modal Pengajuan Cuti */}
            <Modal isVisible={showModalPengajuanCuti}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            {
                                loadingDoPengajuanCuti ?
                                    <Loading style={styles.loading} /> : <></>
                            }

                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Pengajuan Cuti</Text>

                            {
                                errorMessageDoPengajuanCuti ?
                                    <View
                                        style={{ alignItems: 'center' }}
                                    >
                                        <Text
                                            style={{
                                                width: Dimensions.get('window').width - 100,
                                                backgroundColor: '#ef4444',
                                                color: '#FFF',
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                marginBottom: 10,
                                                marginTop: -7
                                            }}
                                        >
                                            {errorMessageDoPengajuanCuti}
                                        </Text>
                                    </View> : <></>
                            }


                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Tanggal Awal</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDatePickerStartDate(true)
                                            }}
                                        >
                                            <TextInput
                                                style={[styles.input, { color: '#333' }]}
                                                placeholder="Tanggal Awal"
                                                editable={false}
                                                value={`${pengajuanCutiStartDate.getFullYear()}-${parseInt(pengajuanCutiStartDate.getMonth() + 1) < 10 ? `0${parseInt(pengajuanCutiStartDate.getMonth() + 1)}` : parseInt(pengajuanCutiStartDate.getMonth() + 1)}-${parseInt(pengajuanCutiStartDate.getDate()) < 10 ? `0${parseInt(pengajuanCutiStartDate.getDate())}` : parseInt(pengajuanCutiStartDate.getDate())}`}
                                            />
                                        </TouchableOpacity>
                                        <DatePicker
                                            modal
                                            mode="date"
                                            open={showDatePickerStartDate}
                                            date={pengajuanCutiStartDate}
                                            onConfirm={(date) => {
                                                setShowDatePickerStartDate(false)
                                                setPengajuanCutiStartDate(date)
                                            }}
                                            onCancel={() => {
                                                setShowDatePickerStartDate(false)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Tanggal Akhir</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDatePickerEndDate(true)
                                            }}
                                        >
                                            <TextInput
                                                style={[styles.input, { color: '#333' }]}
                                                placeholder="Tanggal Akhir"
                                                editable={false}
                                                value={`${pengajuanCutiEndDate.getFullYear()}-${parseInt(pengajuanCutiEndDate.getMonth() + 1) < 10 ? `0${parseInt(pengajuanCutiEndDate.getMonth() + 1)}` : parseInt(pengajuanCutiEndDate.getMonth() + 1)}-${parseInt(pengajuanCutiEndDate.getDate()) < 10 ? `0${parseInt(pengajuanCutiEndDate.getDate())}` : parseInt(pengajuanCutiEndDate.getDate())}`}
                                            />
                                        </TouchableOpacity>
                                        <DatePicker
                                            modal
                                            mode="date"
                                            open={showDatePickerEndDate}
                                            date={pengajuanCutiEndDate}
                                            onConfirm={(date) => {
                                                setShowDatePickerEndDate(false)
                                                setPengajuanCutiEndDate(date)
                                            }}
                                            onCancel={() => {
                                                setShowDatePickerEndDate(false)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Alasan</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top' }]}
                                            placeholder="Alasan"
                                            multiline={true}
                                            numberOfLines={3}
                                            value={pengajuanCutiReason}
                                            onChangeText={text => {
                                                setPengajuanCutiReason(text)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>File Dokumen</Text>

                                        {
                                            fileAttachmentPengajuanCuti ?
                                                <Text style={{
                                                    marginTop: -2,
                                                    marginBottom: 8,
                                                    color: '#000'
                                                }}>{fileAttachmentPengajuanCuti.name}</Text> : <></>
                                        }

                                        <TouchableOpacity
                                            onPress={() => {
                                                doOpenDocumentPickerPengajuanCuti()
                                            }}
                                            style={{
                                                borderWidth: 1,
                                                borderColor: 'gray',
                                                width: 100,
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center'
                                                }}
                                            >Choose File</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                ></View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalPengajuanCuti(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            doPengajuanCuti()
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#22c55e'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Pengajuan Cuti</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Pengajuan Cuti */}

            {/* Modal Pengajuan Revisi Absen */}
            <Modal isVisible={showModalPengajuanRevisiAbsen}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Pengajuan Revisi Absen</Text>

                            {
                                errorMessageDoPengajuanRevisiAbsen ?
                                    <View
                                        style={{ alignItems: 'center' }}
                                    >
                                        <Text
                                            style={{
                                                width: Dimensions.get('window').width - 100,
                                                backgroundColor: '#ef4444',
                                                color: '#FFF',
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4,
                                                marginBottom: 10,
                                                marginTop: -7
                                            }}
                                        >
                                            {errorMessageDoPengajuanRevisiAbsen}
                                        </Text>
                                    </View> : <></>
                            }


                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Tanggal</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDatePickerPengajuanRevisiAbsenDate(true)
                                            }}
                                        >
                                            <TextInput
                                                style={[styles.input, { color: '#333' }]}
                                                placeholder="Tanggal"
                                                editable={false}
                                                value={`${pengajuanRevisiAbsenDate.getFullYear()}-${parseInt(pengajuanRevisiAbsenDate.getMonth() + 1) < 10 ? `0${parseInt(pengajuanRevisiAbsenDate.getMonth() + 1)}` : parseInt(pengajuanRevisiAbsenDate.getMonth() + 1)}-${parseInt(pengajuanRevisiAbsenDate.getDate()) < 10 ? `0${parseInt(pengajuanRevisiAbsenDate.getDate())}` : parseInt(pengajuanRevisiAbsenDate.getDate())}`}
                                            />
                                        </TouchableOpacity>
                                        <DatePicker
                                            modal
                                            mode="date"
                                            open={showDatePickerPengajuanRevisiAbsenDate}
                                            date={pengajuanRevisiAbsenDate}
                                            onConfirm={(date) => {
                                                setShowDatePickerPengajuanRevisiAbsenDate(false)
                                                setPengajuanRevisiAbsenDate(date)
                                            }}
                                            onCancel={() => {
                                                setShowDatePickerPengajuanRevisiAbsenDate(false)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Clock In</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDatePickerPengajuanRevisiAbsenClockIn(true)
                                            }}
                                        >
                                            <TextInput
                                                style={[styles.input, { color: '#333' }]}
                                                placeholder="Clock In"
                                                editable={false}
                                                value={`${pengajuanRevisiAbsenClockIn.getHours() > 9 ? pengajuanRevisiAbsenClockIn.getHours() : `0${pengajuanRevisiAbsenClockIn.getHours()}`}:${pengajuanRevisiAbsenClockIn.getMinutes() > 9 ? pengajuanRevisiAbsenClockIn.getMinutes() : `0${pengajuanRevisiAbsenClockIn.getMinutes()}`}`}
                                            />
                                        </TouchableOpacity>
                                        <DatePicker
                                            modal
                                            mode="time"
                                            open={showDatePickerPengajuanRevisiAbsenClockIn}
                                            date={pengajuanRevisiAbsenClockIn}
                                            onConfirm={(date) => {
                                                setShowDatePickerPengajuanRevisiAbsenClockIn(false)
                                                setPengajuanRevisiAbsenClockIn(date)
                                            }}
                                            locale='id_ID'
                                            onCancel={() => {
                                                setShowDatePickerPengajuanRevisiAbsenClockIn(false)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Clock Out</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setShowDatePickerPengajuanRevisiAbsenClockOut(true)
                                            }}
                                        >
                                            <TextInput
                                                style={[styles.input, { color: '#333' }]}
                                                placeholder="Clock Out"
                                                editable={false}
                                                value={`${pengajuanRevisiAbsenClockOut.getHours() > 9 ? pengajuanRevisiAbsenClockOut.getHours() : `0${pengajuanRevisiAbsenClockOut.getHours()}`}:${pengajuanRevisiAbsenClockOut.getMinutes() > 9 ? pengajuanRevisiAbsenClockOut.getMinutes() : `0${pengajuanRevisiAbsenClockOut.getMinutes()}`}`}
                                            />
                                        </TouchableOpacity>
                                        <DatePicker
                                            modal
                                            mode="time"
                                            open={showDatePickerPengajuanRevisiAbsenClockOut}
                                            date={pengajuanRevisiAbsenClockOut}
                                            onConfirm={(date) => {
                                                setShowDatePickerPengajuanRevisiAbsenClockOut(false)
                                                setPengajuanRevisiAbsenClockOut(date)
                                            }}
                                            locale='id_ID'
                                            onCancel={() => {
                                                setShowDatePickerPengajuanRevisiAbsenClockOut(false)
                                            }}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Alasan</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top' }]}
                                            placeholder="Alasan"
                                            multiline={true}
                                            numberOfLines={3}
                                            value={pengajuanRevisiAbsenReason}
                                            onChangeText={text => {
                                                setPengajuanRevisiAbsenReason(text)
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                ></View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalPengajuanRevisiAbsen(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            doPengajuanRevisiAbsen()
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#22c55e'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Pengajuan Revisi Absen</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Pengajuan Revisi Absen */}

            {/* Modal Detail History Pengajuan Izin / Sakit */}
            <Modal isVisible={showModalDetailHistoryPengajuanIzinSakit}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Detail History Pengajuan Izin / Sakit</Text>

                            <View
                                style={{ alignItems: 'center' }}
                            >

                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Tanggal</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', backgroundColor: '#d1d5db' }]}
                                            placeholder="Tanggal"
                                            editable={false}
                                            value={objDetailHistoryPengajuanIzinSakit.date}
                                        />
                                    </View>

                                    <Text style={{
                                        marginBottom: 5
                                    }}>Description</Text>
                                    <TextInput
                                        style={[styles.input, { color: '#333', backgroundColor: '#d1d5db' }]}
                                        placeholder="Tanggal Awal"
                                        editable={false}
                                        value={objDetailHistoryPengajuanIzinSakit.description}
                                    />
                                </View>

                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <Text style={{
                                        marginBottom: 5
                                    }}>Detailed Description</Text>
                                    <TextInput
                                        style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top', backgroundColor: '#d1d5db' }]}
                                        placeholder="Detailed Description"
                                        multiline={true}
                                        numberOfLines={3}
                                        editable={false}
                                        value={objDetailHistoryPengajuanIzinSakit.detailed_description}
                                    />
                                </View>


                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <Text style={{
                                        marginBottom: 5
                                    }}>File Dokumen</Text>
                                    {
                                        objDetailHistoryPengajuanIzinSakit.file_attachment ?
                                            <View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        Linking.openURL(objDetailHistoryPengajuanIzinSakit.file_attachment)
                                                    }}
                                                    style={{
                                                        backgroundColor: '#0ea5e9',
                                                        width: 100,
                                                        paddingVertical: 6,
                                                        paddingHorizontal: 10,
                                                        borderRadius: 4
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            fontWeight: '500',
                                                            color: '#FFF'
                                                        }}
                                                    >Lihat File</Text>
                                                </TouchableOpacity>
                                            </View> : <Text style={{ color: '#333', fontWeight: '500' }}>Tidak ada file dokumen</Text>
                                    }

                                    <View>
                                        <Text style={{
                                            marginTop: 8,
                                            marginBottom: 5
                                        }}>Status</Text>
                                        <Text style={{ backgroundColor: `${objDetailHistoryPengajuanIzinSakit.status == 'Waiting' ? '#1e293b' : `${objDetailHistoryPengajuanIzinSakit.status == 'Rejected' ? '#ef4444' : '#22c55e'}`}`, alignSelf: 'flex-start', color: 'white', fontWeight: '500', paddingVertical: 2, paddingHorizontal: 5, borderRadius: 3 }}>{
                                            objDetailHistoryPengajuanIzinSakit.status
                                        }</Text>
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginTop: 8,
                                            marginBottom: 5
                                        }}>Note Review</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top', backgroundColor: '#d1d5db' }]}
                                            placeholder="Note Review"
                                            editable={false}
                                            multiline={true}
                                            numberOfLines={3}
                                            value={objDetailHistoryPengajuanIzinSakit.note_review}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                ></View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalDetailHistoryPengajuanIzinSakit(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Detail History Pengajuan Izin / Sakit */}

            {/* Modal Detail History Pengajuan Cuti */}
            <Modal isVisible={showModalDetailHistoryPengajuanCuti}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <View
                            style={{ backgroundColor: 'white', height: 'auto', borderRadius: 7, paddingVertical: 25, position: 'relative' }}
                        >
                            {
                                loadingDoPengajuanRevisiAbsen ?
                                    <Loading style={styles.loading} /> : <></>
                            }

                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 20,
                                    fontWeight: '500',
                                    marginBottom: 20
                                }}
                            >Detail History Pengajuan Cuti</Text>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Tanggal Awal</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', backgroundColor: '#d1d5db' }]}
                                            placeholder="Tanggal Awal"
                                            editable={false}
                                            value={objDetailHistoryPengajuanCuti.start_date}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Tanggal Akhir</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', backgroundColor: '#d1d5db' }]}
                                            placeholder="Tanggal Akhir"
                                            editable={false}
                                            value={objDetailHistoryPengajuanCuti.end_date}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Alasan</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top', backgroundColor: '#d1d5db' }]}
                                            placeholder="Alasan"
                                            editable={false}
                                            multiline={true}
                                            numberOfLines={3}
                                            value={objDetailHistoryPengajuanCuti.reason}
                                        />
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>File Dokumen</Text>

                                        <TouchableOpacity
                                            onPress={() => {
                                                Linking.openURL(objDetailHistoryPengajuanCuti.file_attachment)
                                            }}
                                            style={{
                                                backgroundColor: '#0ea5e9',
                                                width: 100,
                                                paddingVertical: 6,
                                                paddingHorizontal: 10,
                                                borderRadius: 4
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    fontWeight: '500',
                                                    color: '#FFF'
                                                }}
                                            >Lihat File</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginTop: 8,
                                            marginBottom: 5
                                        }}>Status</Text>
                                        <Text style={{ backgroundColor: `${objDetailHistoryPengajuanCuti.status == 'Waiting' ? '#1e293b' : `${objDetailHistoryPengajuanCuti.status == 'Rejected' ? '#ef4444' : '#22c55e'}`}`, alignSelf: 'flex-start', color: 'white', fontWeight: '500', paddingVertical: 2, paddingHorizontal: 5, borderRadius: 3 }}>{
                                            objDetailHistoryPengajuanCuti.status
                                        }</Text>
                                    </View>
                                    <View>
                                        <Text style={{
                                            marginTop: 8,
                                            marginBottom: 5
                                        }}>Note Review</Text>
                                        <TextInput
                                            style={[styles.input, { color: '#333', height: 'unset', textAlignVertical: 'top', backgroundColor: '#d1d5db' }]}
                                            placeholder="Note Review"
                                            editable={false}
                                            multiline={true}
                                            numberOfLines={3}
                                            value={objDetailHistoryPengajuanCuti.note_review}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View
                                style={{ alignItems: 'center' }}
                            >
                                <View
                                    style={{
                                        marginVertical: 20,
                                        backgroundColor: '#cbd5e1',
                                        height: 2,
                                        width: Dimensions.get('window').width - 100
                                    }}
                                ></View>
                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                        gap: 10
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalDetailHistoryPengajuanCuti(false)
                                        }}
                                        style={{
                                            paddingVertical: 15,
                                            borderRadius: 5,
                                            flex: 1,
                                            backgroundColor: '#64748b'
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: '500',
                                                textAlign: 'center',
                                                color: '#FFF'
                                            }}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Detail History Pengajuan Cuti */}

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
                    {loadingBanners ? (
                        <Loading />
                    ) : (
                        <Carousel
                            data={banners}
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
                            disabled={!buttonClockInEnabled}
                            onPress={() => {
                                if (buttonClockInEnabled) {
                                    setShowModalClockIn(true)
                                }
                            }}
                            style={{
                                opacity: buttonClockInEnabled ? 1 : 0.55,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                flex: 1,
                                backgroundColor: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 5
                            }}>
                            <MaterialCommunityIcons
                                name="location-enter"
                                style={[styles.postIcon, { color: 'white' }]}
                                size={40}
                            />
                            <Text style={{ marginTop: 5, color: 'white', fontWeight: '500' }}>Clock In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!buttonIzinOrSakitEnabled}
                            onPress={() => {
                                if (buttonIzinOrSakitEnabled) {
                                    setShowModalIzinAtauSakit(true)
                                }
                            }}
                            style={{
                                opacity: buttonIzinOrSakitEnabled ? 1 : 0.55,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                flex: 1,
                                backgroundColor: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 5
                            }}
                        >
                            <MaterialCommunityIcons
                                name="file-document"
                                style={[styles.postIcon, { color: 'white' }]}
                                size={40}
                            />
                            <Text style={{ marginTop: 5, color: 'white', fontWeight: '500' }}>Izin atau Sakit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!buttonClockOutEnabled}
                            onPress={() => {
                                if (buttonClockOutEnabled) {
                                    setShowModalClockOut(true)
                                }
                            }}
                            style={{
                                opacity: buttonClockOutEnabled ? 1 : 0.55,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                flex: 1,
                                backgroundColor: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 5
                            }}
                        >
                            <MaterialCommunityIcons
                                name="location-exit"
                                style={[styles.postIcon, { color: 'white' }]}
                                size={40}
                            />
                            <Text style={{ marginTop: 5, color: 'white', fontWeight: '500' }}>Clock Out</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ gap: 15, marginTop: 15, flexDirection: 'row' }}>
                        <TouchableOpacity
                            disabled={!buttonPengajuanCutiEnabled}
                            onPress={() => {
                                if (buttonPengajuanCutiEnabled) {
                                    setShowModalPengajuanCuti(true)
                                }
                            }}
                            style={{
                                opacity: buttonPengajuanCutiEnabled ? 1 : 0.55,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                flex: 1,
                                backgroundColor: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 5
                            }}>
                            <MaterialCommunityIcons
                                name="calendar"
                                style={[styles.postIcon, { color: 'white', transform: [{ translateY: -7 }] }]}
                                size={40}
                            />
                            <Text style={{ marginTop: 5, color: 'white', fontWeight: '500' }}>Pengajuan Cuti</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!buttonPengajuanRevisiAbsenEnabled}
                            onPress={() => {
                                if (buttonPengajuanRevisiAbsenEnabled) {
                                    setShowModalPengajuanRevisiAbsen(true)
                                }
                            }}
                            style={{
                                opacity: buttonPengajuanRevisiAbsenEnabled ? 1 : 0.55,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 1,
                                },
                                shadowOpacity: 0.18,
                                shadowRadius: 1.0,
                                flex: 1,
                                backgroundColor: '#3498db',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 12,
                                borderRadius: 5
                            }}>
                            <MaterialCommunityIcons
                                name="calendar-edit"
                                style={[styles.postIcon, { color: 'white' }]}
                                size={40}
                            />
                            <Text style={{ marginTop: 5, color: 'white', textAlign: 'center', fontWeight: '500' }}>Pengajuan Revisi Absen</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}></View>
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
                    {loadingNews ? (
                        <Loading />
                    ) : (
                        <>
                            <FlatList
                                style={{ flex: 1, marginTop: 10 }}
                                data={news}
                                renderItem={({ item, index, separators }) => (
                                    <ListPost data={item} index={index} />
                                )}
                                eyExtractor={item => item.id}
                                scrollEnabled={false}
                            />
                        </>
                    )}
                </View>

                {/* List Tidak Masuk Hari Ini */}
                <View style={{ marginTop: -10 }}>
                    <View style={[styles.postContainer, { marginBottom: 10 }]}>
                        <MaterialCommunityIcons
                            name="label-off"
                            style={styles.postIcon}
                            size={20}
                        />

                        <Text style={styles.postText}>TIDAK MASUK HARI INI</Text>
                    </View>
                    {
                        loadingEmployeesTodayNotPresent ?
                            <Loading /> :
                            <>

                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 10,
                                        borderRadius: 10,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.18,
                                        shadowRadius: 1.0,
                                        elevation: 1
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: 'row', marginBottom: 6, gap: 6, alignItems: 'center' }}
                                    >
                                        <Text style={{ flex: 1, fontWeight: '600', color: '#444' }}>No</Text>
                                        <Text style={{ flex: 5, fontWeight: '600', color: '#444' }}>Nama</Text>
                                        <Text style={{ flex: 3, fontWeight: '600', color: '#444' }}>Deskripsi</Text>
                                    </View>
                                    {
                                        employeesTodayNotPreset.map((employeeTodayNotPreset, index) => (
                                            <View
                                                key={index}
                                                style={{ flexDirection: 'row', marginBottom: 5, gap: 6, alignItems: 'center' }}
                                            >
                                                <Text style={{ flex: 1 }}>{index + 1}</Text>
                                                <Text style={{ flex: 5 }}>{employeeTodayNotPreset.employee.full_name}</Text>
                                                <Text style={{ flex: 3 }}>{employeeTodayNotPreset.description}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                {/* <View>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#3498db',
                                            alignSelf: 'center',
                                            paddingVertical: 7,
                                            paddingHorizontal: 20,
                                            borderRadius: 7,
                                            marginTop: 15
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white'
                                            }}
                                        >Tampilkan Lebih Banyak</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </>
                    }

                </View>
                {/* End of List Tidak Masuk Hari Ini */}

                {/* List History Absen Bulanan */}
                <View style={{ marginTop: -10 }}>
                    <View style={[styles.postContainer, { marginBottom: 10 }]}>
                        <MaterialCommunityIcons
                            name="history"
                            style={styles.postIcon}
                            size={20}
                        />

                        <Text style={styles.postText}>HISTORY ABSEN</Text>
                    </View>
                    {
                        loadingHistoryPresenceMonthly ?
                            <Loading /> :
                            <>

                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 10,
                                        borderRadius: 10,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.18,
                                        shadowRadius: 1.0,
                                        elevation: 1
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: 'row', marginBottom: 6, gap: 6, alignItems: 'center' }}
                                    >
                                        <Text style={{ flex: 3, fontWeight: '600', color: '#444' }}>Tanggal</Text>
                                        <Text style={{ flex: 5, fontWeight: '600', color: '#444' }}>Status</Text>
                                        <Text style={{ flex: 4, fontWeight: '600', color: '#444' }}>Deskripsi</Text>
                                    </View>
                                    {
                                        arrHistoryPresenceMonthly.map((historyPresenceMonthly, index) => (
                                            <View
                                                key={index}
                                                style={{ flexDirection: 'row', marginBottom: 5, gap: 6, alignItems: 'center' }}
                                            >
                                                <Text style={{ flex: 3 }}>{historyPresenceMonthly.date}</Text>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={{ flex: 6, backgroundColor: `${historyPresenceMonthly.is_present == 'Yes' ? '#22c55e' : '#ef4444'}`, alignSelf: 'flex-start', color: 'white', fontWeight: '500', paddingVertical: 2, paddingHorizontal: 5, fontSize: 12, borderRadius: 3 }}>{
                                                        historyPresenceMonthly.is_present == 'Yes' ? 'Berangkat' : 'Tidak Berangkat'
                                                    }</Text>
                                                </View>
                                                <Text style={{ flex: 4 }}>{historyPresenceMonthly.description}</Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                {/* <View>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#3498db',
                                            alignSelf: 'center',
                                            paddingVertical: 7,
                                            paddingHorizontal: 20,
                                            borderRadius: 7,
                                            marginTop: 15
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white'
                                            }}
                                        >Tampilkan Lebih Banyak</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </>
                    }

                </View>
                {/* End of List History Absen Diri Sendiri */}

                {/* List History PENGAJUAN IZIN / SAKIT */}
                <View style={{ marginTop: -10 }}>
                    <View style={[styles.postContainer, { marginBottom: 10 }]}>
                        <MaterialCommunityIcons
                            name="history"
                            style={styles.postIcon}
                            size={20}
                        />

                        <Text style={styles.postText}>HISTORY PENGAJUAN IZIN / SAKIT</Text>
                    </View>
                    {
                        loadingHistoryPengajuanIzinSakit ?
                            <Loading /> :
                            <>

                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 10,
                                        borderRadius: 10,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.18,
                                        shadowRadius: 1.0,
                                        elevation: 1
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: 'row', marginBottom: 6, gap: 6, alignItems: 'center' }}
                                    >
                                        <Text style={{ flex: 4, fontWeight: '600', color: '#444' }}>Tanggal</Text>
                                        <Text style={{ flex: 3, fontWeight: '600', color: '#444' }}>Desc</Text>
                                        <Text style={{ flex: 5, fontWeight: '600', color: '#444' }}>Status</Text>
                                        <Text style={{ flex: 4, fontWeight: '600', color: '#444' }}>Aksi</Text>
                                    </View>
                                    {
                                        arrHistoryPengajuanIzinSakit.map((historyPengajuanIzinSakit, index) => (
                                            <View
                                                key={index}
                                                style={{ flexDirection: 'row', marginBottom: 5, gap: 6, alignItems: 'center' }}
                                            >
                                                <Text style={{ flex: 4 }}>{moment(historyPengajuanIzinSakit.created_at, 'DD/MM/YYYY HH:ii').format('Y-MM-DD')}</Text>
                                                <Text style={{ flex: 3 }}>{historyPengajuanIzinSakit.description}</Text>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={{ flex: 6, backgroundColor: `${historyPengajuanIzinSakit.status == 'Waiting' ? '#1e293b' : `${historyPengajuanIzinSakit.status == 'Rejected' ? '#ef4444' : '#22c55e'}`}`, alignSelf: 'flex-start', color: 'white', fontWeight: '500', paddingVertical: 2, paddingHorizontal: 5, fontSize: 12, borderRadius: 3 }}>{
                                                        historyPengajuanIzinSakit.status
                                                    }</Text>
                                                </View>
                                                <Text style={{ flex: 4 }}>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setObjDetailHistoryPengajuanIzinSakit(historyPengajuanIzinSakit)
                                                                setShowModalDetailHistoryPengajuanIzinSakit(true)
                                                            }}
                                                            style={{ backgroundColor: '#3b82f6', paddingVertical: 2, paddingHorizontal: 5, alignSelf: 'flex-start', borderRadius: 3 }}
                                                        >
                                                            <View
                                                                style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                                                            >
                                                                <MaterialCommunityIcons
                                                                    name="information-outline"
                                                                    style={{ color: 'white' }}
                                                                    size={20}
                                                                />
                                                                <Text
                                                                    style={{ color: 'white', fontWeight: '500', fontSize: 12, paddingRight: 3 }}
                                                                >Detail</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                {/* <View>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#3498db',
                                            alignSelf: 'center',
                                            paddingVertical: 7,
                                            paddingHorizontal: 20,
                                            borderRadius: 7,
                                            marginTop: 15
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white'
                                            }}
                                        >Tampilkan Lebih Banyak</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </>
                    }

                </View>
                {/* End of List History PENGAJUAN IZIN / SAKIT */}

                {/* List History Pengajuan Cuti */}
                <View style={{ marginBottom: 560, marginTop: -10 }}>
                    <View style={[styles.postContainer, { marginBottom: 10 }]}>
                        <MaterialCommunityIcons
                            name="history"
                            style={styles.postIcon}
                            size={20}
                        />

                        <Text style={styles.postText}>HISTORY PENGAJUAN CUTI</Text>
                    </View>
                    {
                        loadingHistoryPengajuanCuti ?
                            <Loading /> :
                            <>

                                <View
                                    style={{
                                        backgroundColor: 'white',
                                        padding: 10,
                                        borderRadius: 10,
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 1,
                                        },
                                        shadowOpacity: 0.18,
                                        shadowRadius: 1.0,
                                        elevation: 1
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: 'row', marginBottom: 6, gap: 6, alignItems: 'center' }}
                                    >
                                        <Text style={{ flex: 4, fontWeight: '600', color: '#444' }}>Tanggal</Text>
                                        <Text style={{ flex: 5, fontWeight: '600', color: '#444' }}>Status</Text>
                                        <Text style={{ flex: 3, fontWeight: '600', color: '#444' }}>Aksi</Text>
                                    </View>
                                    {
                                        arrHistoryPengajuanCuti.map((historyPengajuanCuti, index) => (
                                            <View
                                                key={index}
                                                style={{ flexDirection: 'row', marginBottom: 5, gap: 6, alignItems: 'center' }}
                                            >
                                                <Text style={{ flex: 4 }}>{moment(historyPengajuanCuti.created_at, 'DD/MM/YYYY HH:ii').format('Y-MM-DD')}</Text>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={{ flex: 6, backgroundColor: `${historyPengajuanCuti.status == 'Waiting' ? '#1e293b' : `${historyPengajuanCuti.status == 'Rejected' ? '#ef4444' : '#22c55e'}`}`, alignSelf: 'flex-start', color: 'white', fontWeight: '500', paddingVertical: 2, paddingHorizontal: 5, fontSize: 12, borderRadius: 3 }}>{
                                                        historyPengajuanCuti.status
                                                    }</Text>
                                                </View>
                                                <Text style={{ flex: 3 }}>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setObjDetailHistoryPengajuanCuti(historyPengajuanCuti)
                                                                setShowModalDetailHistoryPengajuanCuti(true)
                                                            }}
                                                            style={{ backgroundColor: '#3b82f6', paddingVertical: 2, paddingHorizontal: 5, alignSelf: 'flex-start', borderRadius: 3 }}
                                                        >
                                                            <View
                                                                style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
                                                            >
                                                                <MaterialCommunityIcons
                                                                    name="information-outline"
                                                                    style={{ color: 'white' }}
                                                                    size={20}
                                                                />
                                                                <Text
                                                                    style={{ color: 'white', fontWeight: '500', fontSize: 12, paddingRight: 3 }}
                                                                >Detail</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Text>
                                            </View>
                                        ))
                                    }
                                </View>
                                {/* <View>
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: '#3498db',
                                            alignSelf: 'center',
                                            paddingVertical: 7,
                                            paddingHorizontal: 20,
                                            borderRadius: 7,
                                            marginTop: 15
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: 'white'
                                            }}
                                        >Tampilkan Lebih Banyak</Text>
                                    </TouchableOpacity>
                                </View> */}
                            </>
                    }

                </View>
                {/* End of List History Pengajuan Cuti */}
            </ScrollView>
        </SafeAreaView >
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
    loading: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
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
