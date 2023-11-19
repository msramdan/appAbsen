import { FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from "../../../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "../../../utils/Axios";
import { Redirect } from "../../../utils/Redirect";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import DatePicker from 'react-native-date-picker';
import { useToast } from "react-native-toast-notifications";

export default function RiwayatAbsensiScreen() {

    /**
     * Main Utils
     * 
     */
    const toast = useToast();

    /**
     * Employees Riwayat Absensi Utils State
     * 
     */
    const [loadingHistoryPresenceMonthly, setLoadingHistoryPresenceMonthly] = useState(true)
    const [arrHistoryPresenceMonthly, setArrHistoryPresenceMonthly] = useState({})

    /**
     * Filter Tanggal Awal
     * 
     */
    const [showDatePickerStartDate, setShowDatePickerStartDate] = useState(false)
    const [filterTanggalStartDate, setFilterTanggalStartDate] = useState(null)

    /**
     * Filter Tanggal Akhir
     * 
     */
    const [showDatePickerEndDate, setShowDatePickerEndDate] = useState(false)
    const [filterTanggalEndDate, setFilterTanggalEndDate] = useState(null)

    /**
     * Filter Button
     * 
     */
    const [isFiltered, setIsFiltered] = useState(false)

    useEffect(() => {
        loadArrHistoryPresenceMonthly()
    }, [])

    const loadArrHistoryPresenceMonthly = async (apiSourceUrl = null) => {
        setLoadingHistoryPresenceMonthly(true)

        const token = await AsyncStorage.getItem('apiToken')

        let formattedApiSourceUrl = ''

        if (apiSourceUrl && (filterTanggalStartDate && filterTanggalEndDate) && isFiltered) {
            formattedApiSourceUrl = apiSourceUrl
                + '&start_date=' + `${filterTanggalStartDate.getFullYear()}-${parseInt(filterTanggalStartDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalStartDate.getMonth() + 1)}` : parseInt(filterTanggalStartDate.getMonth() + 1)}-${parseInt(filterTanggalStartDate.getDate()) < 10 ? `0${parseInt(filterTanggalStartDate.getDate())}` : parseInt(filterTanggalStartDate.getDate())}`
                + '&end_date=' + `${filterTanggalEndDate.getFullYear()}-${parseInt(filterTanggalEndDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalEndDate.getMonth() + 1)}` : parseInt(filterTanggalEndDate.getMonth() + 1)}-${parseInt(filterTanggalEndDate.getDate()) < 10 ? `0${parseInt(filterTanggalEndDate.getDate())}` : parseInt(filterTanggalEndDate.getDate())}`
        } else if (apiSourceUrl && !isFiltered) {
            formattedApiSourceUrl = apiSourceUrl
        } else if (!apiSourceUrl && (filterTanggalStartDate && filterTanggalEndDate) && isFiltered) {
            formattedApiSourceUrl = '/attendances/history-presence'
                + '?start_date=' + `${filterTanggalStartDate.getFullYear()}-${parseInt(filterTanggalStartDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalStartDate.getMonth() + 1)}` : parseInt(filterTanggalStartDate.getMonth() + 1)}-${parseInt(filterTanggalStartDate.getDate()) < 10 ? `0${parseInt(filterTanggalStartDate.getDate())}` : parseInt(filterTanggalStartDate.getDate())}`
                + '&end_date=' + `${filterTanggalEndDate.getFullYear()}-${parseInt(filterTanggalEndDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalEndDate.getMonth() + 1)}` : parseInt(filterTanggalEndDate.getMonth() + 1)}-${parseInt(filterTanggalEndDate.getDate()) < 10 ? `0${parseInt(filterTanggalEndDate.getDate())}` : parseInt(filterTanggalEndDate.getDate())}`
        } else {
            formattedApiSourceUrl = '/attendances/history-presence'
        }

        Axios.get(formattedApiSourceUrl, {
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

    const doFilterDate = () => {
        if (!filterTanggalStartDate || !filterTanggalEndDate) {
            toast.show('Untuk filter, Tanggal Awal dan Tanggal Akhir wajib diisi!', {
                type: 'danger',
                placement: 'center'
            })
        } else {
            setIsFiltered(true)
            loadArrHistoryPresenceMonthly()
        }
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

                <View style={styles.filterWrapper}>
                    <View style={{ flex: 3 }}>
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
                                value={
                                    filterTanggalStartDate ?
                                        `${filterTanggalStartDate.getFullYear()}-${parseInt(filterTanggalStartDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalStartDate.getMonth() + 1)}` : parseInt(filterTanggalStartDate.getMonth() + 1)}-${parseInt(filterTanggalStartDate.getDate()) < 10 ? `0${parseInt(filterTanggalStartDate.getDate())}` : parseInt(filterTanggalStartDate.getDate())}`
                                        : null
                                }
                            />
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            mode="date"
                            open={showDatePickerStartDate}
                            date={filterTanggalStartDate ? filterTanggalStartDate : new Date()}
                            onConfirm={(date) => {
                                setShowDatePickerStartDate(false)
                                setFilterTanggalStartDate(date)
                            }}
                            onCancel={() => {
                                setShowDatePickerStartDate(false)
                            }}
                        />
                    </View>
                    <View style={{ flex: 3 }}>
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
                                value={
                                    filterTanggalEndDate ?
                                        `${filterTanggalEndDate.getFullYear()}-${parseInt(filterTanggalEndDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalEndDate.getMonth() + 1)}` : parseInt(filterTanggalEndDate.getMonth() + 1)}-${parseInt(filterTanggalEndDate.getDate()) < 10 ? `0${parseInt(filterTanggalEndDate.getDate())}` : parseInt(filterTanggalEndDate.getDate())}`
                                        : null
                                }
                            />
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            mode="date"
                            open={showDatePickerEndDate}
                            date={filterTanggalEndDate ? filterTanggalEndDate : new Date()}
                            onConfirm={(date) => {
                                setShowDatePickerEndDate(false)
                                setFilterTanggalEndDate(date)
                            }}
                            onCancel={() => {
                                setShowDatePickerEndDate(false)
                            }}
                        />
                    </View>
                    <View style={[styles.filterButtonWrapper, { flex: 1 }]}>
                        <TouchableOpacity
                            onPress={doFilterDate}
                            style={styles.filterButton}
                        >
                            <MaterialCommunityIcons
                                name="filter-variant"
                                style={[styles.postIcon, { color: 'white' }]}
                                size={22}
                            />
                        </TouchableOpacity>
                    </View>
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
    },
    buttonPreviewFileModal: {
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
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
    }
})