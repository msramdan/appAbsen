import { Dimensions, FlatList, Linking, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from "../../../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "../../../utils/Axios";
import { Redirect } from "../../../utils/Redirect";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import Modal from "react-native-modal";
import DatePicker from 'react-native-date-picker';
import { useToast } from "react-native-toast-notifications";

import moment from 'moment';
import 'moment/locale/id';

export default function RiwayatPengajuanCutiScreen() {

    /**
     * Main Utils
     * 
     */
    const toast = useToast();

    /**
     * Employees Riwayat Pengajuan Cuti Utils State
     * 
     */
    const [loadingHistoryPengajuanCuti, setLoadingHistoryPengajuanCuti] = useState(true)
    const [arrHistoryPengajuanCuti, setArrHistoryPengajuanCuti] = useState({})
    const [objDetailHistoryPengajuanCuti, setObjDetailHistoryPengajuanCuti] = useState({})
    const [showModalDetailHistoryPengajuanCuti, setShowModalDetailHistoryPengajuanCuti] = useState(false)

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
        loadArrHistoryPengajuanCuti()
    }, [])

    const loadArrHistoryPengajuanCuti = async (apiSourceUrl = null) => {
        setLoadingHistoryPengajuanCuti(true)

        const token = await AsyncStorage.getItem('apiToken')

        let formattedApiSourceUrl = ''

        if (apiSourceUrl && (filterTanggalStartDate && filterTanggalEndDate) && isFiltered) {
            formattedApiSourceUrl = apiSourceUrl
                + '&start_date=' + `${filterTanggalStartDate.getFullYear()}-${parseInt(filterTanggalStartDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalStartDate.getMonth() + 1)}` : parseInt(filterTanggalStartDate.getMonth() + 1)}-${parseInt(filterTanggalStartDate.getDate()) < 10 ? `0${parseInt(filterTanggalStartDate.getDate())}` : parseInt(filterTanggalStartDate.getDate())}`
                + '&end_date=' + `${filterTanggalEndDate.getFullYear()}-${parseInt(filterTanggalEndDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalEndDate.getMonth() + 1)}` : parseInt(filterTanggalEndDate.getMonth() + 1)}-${parseInt(filterTanggalEndDate.getDate()) < 10 ? `0${parseInt(filterTanggalEndDate.getDate())}` : parseInt(filterTanggalEndDate.getDate())}`
        } else if (apiSourceUrl && !isFiltered) {
            formattedApiSourceUrl = apiSourceUrl
        } else if (!apiSourceUrl && (filterTanggalStartDate && filterTanggalEndDate) && isFiltered) {
            formattedApiSourceUrl = '/attendances/current-employee-pengajuan-cuti'
                + '?start_date=' + `${filterTanggalStartDate.getFullYear()}-${parseInt(filterTanggalStartDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalStartDate.getMonth() + 1)}` : parseInt(filterTanggalStartDate.getMonth() + 1)}-${parseInt(filterTanggalStartDate.getDate()) < 10 ? `0${parseInt(filterTanggalStartDate.getDate())}` : parseInt(filterTanggalStartDate.getDate())}`
                + '&end_date=' + `${filterTanggalEndDate.getFullYear()}-${parseInt(filterTanggalEndDate.getMonth() + 1) < 10 ? `0${parseInt(filterTanggalEndDate.getMonth() + 1)}` : parseInt(filterTanggalEndDate.getMonth() + 1)}-${parseInt(filterTanggalEndDate.getDate()) < 10 ? `0${parseInt(filterTanggalEndDate.getDate())}` : parseInt(filterTanggalEndDate.getDate())}`
        } else {
            formattedApiSourceUrl = '/attendances/current-employee-pengajuan-cuti'
        }

        Axios.get(formattedApiSourceUrl, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                if (arrHistoryPengajuanCuti.data && apiSourceUrl) {
                    const dataHistoryPengajuanCuti = [...arrHistoryPengajuanCuti.data]

                    dataHistoryPengajuanCuti.push.apply(dataHistoryPengajuanCuti, res.data.data.data)
                    res.data.data.data = dataHistoryPengajuanCuti
                }

                setArrHistoryPengajuanCuti(res.data.data)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        }).finally(() => {
            setLoadingHistoryPengajuanCuti(false)
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
            loadArrHistoryPengajuanCuti()
        }
    }

    return (
        <ScrollView
            style={{ padding: 15 }}
        >
            {/* Modal Detail History Pengajuan Cuti */}
            <Modal isVisible={showModalDetailHistoryPengajuanCuti}>
                <View style={styles.modalOuter}>
                    <View>
                        <View
                            style={styles.modalCard}
                        >
                            <Text
                                style={styles.modalTitle}
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
                                            style={[styles.input, styles.disabledTextInput]}
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
                                            style={[styles.input, styles.disabledTextInput]}
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
                                            style={[styles.input, styles.disabledTextArea]}
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
                                            style={[styles.input, styles.disabledTextArea]}
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
                                    style={styles.modalHorizontalLine}
                                ></View>
                                <View
                                    style={styles.modalButtonActionWrapper}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowModalDetailHistoryPengajuanCuti(false)
                                        }}
                                        style={styles.buttonCloseModal}
                                    >
                                        <Text
                                            style={styles.buttonTextModal}
                                        >Tutup</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* End of Modal Detail History Pengajuan Cuti */}

            {/* List RIWAYAT PENGAJUAN CUTI */}
            <View >
                <View style={[styles.postContainer, { marginBottom: 10 }]}>
                    <MaterialCommunityIcons
                        name="history"
                        style={styles.postIcon}
                        size={20}
                    />

                    <Text style={styles.postText}>RIWAYAT PENGAJUAN CUTI</Text>
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
                                name="filter-outline"
                                style={[styles.postIcon, { color: 'white' }]}
                                size={22}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {
                    loadingHistoryPengajuanCuti ?
                        <Loading /> :
                        <>

                            <View
                                style={styles.cardListTable}
                            >
                                <View
                                    style={styles.listTableThead}
                                >
                                    <Text style={[{ flex: 4 }, styles.listTableTheadTD]}>Dibuat Pada</Text>
                                    <Text style={[{ flex: 5 }, styles.listTableTheadTD]}>Status</Text>
                                    <Text style={[{ flex: 3 }, styles.listTableTheadTD]}>Aksi</Text>
                                </View>
                                {
                                    <FlatList
                                        data={arrHistoryPengajuanCuti.data}
                                        renderItem={({ item, index, separators }) => (
                                            <View
                                                key={index}
                                                style={styles.listTableTbody}
                                            >
                                                <Text style={{ flex: 4 }}>{moment(item.created_at, 'DD/MM/YYYY HH:ii').format('Y-MM-DD')}</Text>
                                                <View style={{ flex: 5 }}>
                                                    <Text style={[styles.tableDataLabelStatus, { flex: 6, backgroundColor: `${item.status == 'Waiting' ? '#1e293b' : `${item.status == 'Rejected' ? '#ef4444' : '#22c55e'}`}` }]}>{
                                                        item.status
                                                    }</Text>
                                                </View>
                                                <Text style={{ flex: 3 }}>
                                                    <View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setObjDetailHistoryPengajuanCuti(item)
                                                                setShowModalDetailHistoryPengajuanCuti(true)
                                                            }}
                                                            style={styles.buttonTableDataDetail}
                                                        >
                                                            <View
                                                                style={styles.buttonTableDataDetailInner}
                                                            >
                                                                <MaterialCommunityIcons
                                                                    name="information-outline"
                                                                    style={{ color: 'white' }}
                                                                    size={20}
                                                                />
                                                                <Text
                                                                    style={styles.buttonTableDataDetailText}
                                                                >Detail</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    </View>
                                                </Text>
                                            </View>
                                        )}
                                        keyExtractor={item => item.id}
                                        scrollEnabled={false}
                                    />
                                }
                            </View>
                            {
                                arrHistoryPengajuanCuti.next_page_url ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const splittedUrl = arrHistoryPengajuanCuti.next_page_url.split('/api/mobile')

                                                loadArrHistoryPengajuanCuti(splittedUrl[splittedUrl.length - 1])
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
            {/* End of List RIWAYAT PENGAJUAN CUTI */}

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

    modalOuter: {
        flex: 1,
        justifyContent: 'center'
    },
    modalCard: {
        backgroundColor: 'white',
        height: 'auto',
        borderRadius: 7,
        paddingVertical: 25,
        position: 'relative'
    },
    modalTitle: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '500',
        marginBottom: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    disabledTextInput: {
        color: '#333',
        backgroundColor: '#d1d5db'
    },
    disabledTextArea: {
        color: '#333',
        height: 'unset',
        textAlignVertical: 'top',
        backgroundColor: '#d1d5db'
    },
    buttonCloseModal: {
        paddingVertical: 15,
        borderRadius: 5,
        flex: 1,
        backgroundColor: '#64748b'
    },
    modalButtonActionWrapper: {
        width: Dimensions.get('window').width - 100,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10
    },
    modalHorizontalLine: {
        marginVertical: 20,
        backgroundColor: '#cbd5e1',
        height: 2,
        width: Dimensions.get('window').width - 100
    },
    buttonTextModal: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        color: '#FFF'
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