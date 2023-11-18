import { FlatList, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from "../../../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "../../../utils/Axios";
import { Redirect } from "../../../utils/Redirect";
import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function RiwayatAbsensiScreen() {

    /**
     * Employees Riwayat Absensi Utils State
     * 
     */
    const [loadingHistoryPresenceMonthly, setLoadingHistoryPresenceMonthly] = useState(true)
    const [arrHistoryPresenceMonthly, setArrHistoryPresenceMonthly] = useState({})

    useEffect(() => {
        loadArrHistoryPresenceMonthly()
    }, [])

    const loadArrHistoryPresenceMonthly = async (apiSourceUrl = null) => {
        setLoadingHistoryPresenceMonthly(true)

        const token = await AsyncStorage.getItem('apiToken')

        Axios.get(apiSourceUrl ? apiSourceUrl : '/attendances/history-presence-monthly', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                if (arrHistoryPresenceMonthly.data && apiSourceUrl) {
                    const dataHistoryPresenceMonthlyAppended = [...arrHistoryPresenceMonthly.data]

                    dataHistoryPresenceMonthlyAppended.push.apply(dataHistoryPresenceMonthlyAppended, res.data.data.data)
                    res.data.data.data = dataHistoryPresenceMonthlyAppended
                }

                setArrHistoryPresenceMonthly(res.data.data)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        }).finally(() => {
            setLoadingHistoryPresenceMonthly(false)
        })
    }

    return (
        <ScrollView
            style={{ padding: 15 }}
        >
            {/* List RIWAYAT ABSENSI */}
            <View >
                <View style={[styles.postContainer, { marginBottom: 10 }]}>
                    <MaterialCommunityIcons
                        name="history"
                        style={styles.postIcon}
                        size={20}
                    />

                    <Text style={styles.postText}>RIWAYAT ABSENSI</Text>
                </View>
                {
                    loadingHistoryPresenceMonthly ?
                        <Loading /> :
                        <>

                            <View
                                style={styles.cardListTable}
                            >
                                <View
                                    style={styles.listTableThead}
                                >
                                    <Text style={[{ flex: 3 }, styles.listTableTheadTD]}>Tanggal</Text>
                                    <Text style={[{ flex: 5 }, styles.listTableTheadTD]}>Status</Text>
                                    <Text style={[{ flex: 4 }, styles.listTableTheadTD]}>Deskripsi</Text>
                                </View>
                                {
                                    <FlatList
                                        data={arrHistoryPresenceMonthly.data}
                                        renderItem={({ item, index, separators }) => (
                                            <View
                                                key={index}
                                                style={styles.listTableTbody}
                                            >
                                                <Text style={{ flex: 3 }}>{item.date}</Text>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={[styles.tableDataLabelStatus, { flex: 6, backgroundColor: `${item.is_present == 'Yes' ? '#22c55e' : '#ef4444'}` }]}>{
                                                        item.is_present == 'Yes' ? 'Berangkat' : 'Tidak Berangkat'
                                                    }</Text>
                                                </View>
                                                <Text style={{ flex: 4 }}>{item.description}</Text>
                                            </View>
                                        )}
                                        keyExtractor={item => item.id}
                                        scrollEnabled={false}
                                    />
                                }
                            </View>
                            {
                                arrHistoryPresenceMonthly.next_page_url ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const splittedUrl = arrHistoryPresenceMonthly.next_page_url.split('/api/mobile')

                                                loadArrHistoryPresenceMonthly(splittedUrl[splittedUrl.length - 1])
                                            }}
                                            style={styles.buttonListTableViewMore}
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
            {/* End of List RIWAYAT ABSENSI */}
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
    }, buttonPreviewFileModal: {
        backgroundColor: '#0ea5e9',
        width: 100,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4
    },
    buttonListTableViewMore: {
        backgroundColor: '#3498db',
        alignSelf: 'center',
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 7,
        marginTop: 15
    },
    buttonTextPreviewFileModal: {
        textAlign: 'center',
        fontWeight: '500',
        color: '#FFF'
    },
    buttonTableDataDetailText: {
        color: 'white',
        fontWeight: '500',
        fontSize: 12,
        paddingRight: 3
    },
    buttonTableDataDetailInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
    },
    buttonTableDataDetail: {
        backgroundColor: '#3b82f6',
        paddingVertical: 2,
        paddingHorizontal: 5,
        alignSelf: 'flex-start',
        borderRadius: 3
    },

})