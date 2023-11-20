import { FlatList, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from "../../../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "../../../utils/Axios";
import { Redirect } from "../../../utils/Redirect";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function TidakMasukHariIniScreen() {

    /**
     * Employees Today Not Present Utils State
     * 
     */
    const [loadingEmployeesTodayNotPresent, setLoadingEmployeesTodayNotPresent] = useState(true)
    const [employeesTodayNotPreset, setEmployeesTodayNotPreset] = useState({})
    const [refresh, setRefersh] = useState(false)

    useEffect(() => {
        loadEmployeesTodayNotPreset()
    }, [])

    const loadEmployeesTodayNotPreset = async (apiSourceUrl = null) => {
        setLoadingEmployeesTodayNotPresent(true)
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get(apiSourceUrl ? apiSourceUrl : '/attendances/all-employees-today-not-present', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                if (employeesTodayNotPreset.data && apiSourceUrl) {
                    const dataEmployeesTodayNotPresentAppended = [...employeesTodayNotPreset.data]

                    dataEmployeesTodayNotPresentAppended.push.apply(dataEmployeesTodayNotPresentAppended, res.data.data.data)
                    res.data.data.data = dataEmployeesTodayNotPresentAppended
                }

                setEmployeesTodayNotPreset(res.data.data)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        }).finally(() => {
            setLoadingEmployeesTodayNotPresent(false)
        })
    }

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefersh(true)

                        loadEmployeesTodayNotPreset()

                        setRefersh(false)
                    }}
                />}
            style={{ padding: 15 }}
        >
            {/* List Tidak Masuk Hari Ini */}
            <View >
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
                                style={styles.cardListTable}
                            >
                                <View
                                    style={styles.listTableThead}
                                >
                                    <Text style={[{ flex: 1 }, styles.listTableTheadTD]}>No</Text>
                                    <Text style={[{ flex: 5 }, styles.listTableTheadTD]}>Nama</Text>
                                    <Text style={[{ flex: 3 }, styles.listTableTheadTD]}>Deskripsi</Text>
                                </View>
                                {
                                    <FlatList
                                        data={employeesTodayNotPreset.data}
                                        renderItem={({ item, index, separators }) => (
                                            <View
                                                key={index}
                                                style={styles.listTableTbody}
                                            >
                                                <Text style={{ flex: 1 }}>{index + 1}</Text>
                                                <Text style={{ flex: 5 }}>{item.employee.full_name}</Text>
                                                <Text style={{ flex: 3 }}>{item.description}</Text>
                                            </View>
                                        )}
                                        keyExtractor={item => item.id}
                                        scrollEnabled={false}
                                    />
                                }
                            </View>
                            {
                                employeesTodayNotPreset.next_page_url ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const splittedUrl = employeesTodayNotPreset.next_page_url.split('/api/mobile')

                                                loadEmployeesTodayNotPreset(splittedUrl[splittedUrl.length - 1])
                                            }}
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
                                    </View> : <></>
                            }
                        </>
                }

            </View>
            {/* End of List Tidak Masuk Hari Ini */}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    postIcon: {
        marginRight: 5,
        color: '#333333',
    },
    cardListTable: {
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
    },
    listTableThead: {
        flexDirection: 'row',
        marginBottom: 6,
        gap: 6,
        alignItems: 'center'
    },
    listTableTheadTD: {
        fontWeight: '600', color: '#444'
    },
    listTableTbody: {
        flexDirection: 'row',
        marginBottom: 5,
        gap: 6,
        alignItems: 'center'
    },
    postText: {
        color: '#333333',
        fontWeight: 'bold',
    },
    tableDataLabelStatus: {
        alignSelf: 'flex-start',
        color: 'white',
        fontWeight: '500',
        paddingVertical: 2,
        paddingHorizontal: 5,
        fontSize: 12,
        borderRadius: 3
    }
})