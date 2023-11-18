import { Dimensions, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Loading from "../../../components/Loading";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from "../../../utils/Axios";
import { Redirect } from "../../../utils/Redirect";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import Modal from "react-native-modal";

import moment from 'moment';
import 'moment/locale/id';

export default function RiwayatPengajuanRevisiAbsensiScreen() {

    /**
     * Employees Riwayat Pengajuan REVISI ABSENSI Utils State
     * 
     */
    const [loadingHistoryPengajuanRevisiAbsen, setLoadingHistoryPengajuanRevisiAbsen] = useState(true)
    const [arrHistoryPengajuanRevisiAbsen, setArrHistoryPengajuanRevisiAbsen] = useState({})
    const [objDetailHistoryPengajuanRevisiAbsen, setObjDetailHistoryPengajuanRevisiAbsen] = useState({})
    const [showModalDetailHistoryPengajuanRevisiAbsen, setShowModalDetailHistoryPengajuanRevisiAbsen] = useState(false)

    useEffect(() => {
        loadArrHistoryPengajuanRevisiAbsen()
    }, [])

    const loadArrHistoryPengajuanRevisiAbsen = async (apiSourceUrl = null) => {
        setLoadingHistoryPengajuanRevisiAbsen(true)

        const token = await AsyncStorage.getItem('apiToken')

        Axios.get(apiSourceUrl ? apiSourceUrl : '/attendances/current-employee-pengajuan-revisi-absen', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                if (arrHistoryPengajuanRevisiAbsen.data && apiSourceUrl) {
                    const dataHistoryPengajuanRevisiAbsenAppended = [...arrHistoryPengajuanRevisiAbsen.data]

                    dataHistoryPengajuanRevisiAbsenAppended.push.apply(dataHistoryPengajuanRevisiAbsenAppended, res.data.data.data)
                    res.data.data.data = dataHistoryPengajuanRevisiAbsenAppended
                }

                setArrHistoryPengajuanRevisiAbsen(res.data.data)
            }
        }).catch((err) => {
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            }
        }).finally(() => {
            setLoadingHistoryPengajuanRevisiAbsen(false)
        })
    }

    return (
        <ScrollView
            style={{ padding: 15 }}
        >
            {/* Modal Detail History Pengajuan Revisi Absen */}
            <Modal isVisible={showModalDetailHistoryPengajuanRevisiAbsen}>
                <View style={styles.modalOuter}>
                    <View>
                        <View
                            style={styles.modalCard}
                        >
                            <Text
                                style={styles.modalTitle}
                            >Detail History Pengajuan Revisi Absen</Text>

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
                                            style={[styles.input, styles.disabledTextInput]}
                                            placeholder="Tanggal"
                                            editable={false}
                                            value={objDetailHistoryPengajuanRevisiAbsen.date}
                                        />
                                    </View>

                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Clock In</Text>
                                        <TextInput
                                            style={[styles.input, styles.disabledTextInput]}
                                            placeholder="Clock In"
                                            editable={false}
                                            value={objDetailHistoryPengajuanRevisiAbsen.clock_in}
                                        />
                                    </View>

                                    <View>
                                        <Text style={{
                                            marginBottom: 5
                                        }}>Clock Out</Text>
                                        <TextInput
                                            style={[styles.input, styles.disabledTextInput]}
                                            placeholder="Clock Out"
                                            editable={false}
                                            value={objDetailHistoryPengajuanRevisiAbsen.clock_out}
                                        />
                                    </View>
                                </View>

                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <Text style={{
                                        marginBottom: 5
                                    }}>Reason</Text>
                                    <TextInput
                                        style={[styles.input, styles.disabledTextArea]}
                                        placeholder="Reason"
                                        multiline={true}
                                        numberOfLines={3}
                                        editable={false}
                                        value={objDetailHistoryPengajuanRevisiAbsen.reason}
                                    />
                                </View>


                                <View
                                    style={{
                                        width: Dimensions.get('window').width - 100,
                                    }}
                                >
                                    <View>
                                        <Text style={{
                                            marginTop: 8,
                                            marginBottom: 5
                                        }}>Status</Text>
                                        <Text style={{ backgroundColor: `${objDetailHistoryPengajuanRevisiAbsen.status == 'Waiting' ? '#1e293b' : `${objDetailHistoryPengajuanRevisiAbsen.status == 'Rejected' ? '#ef4444' : '#22c55e'}`}`, alignSelf: 'flex-start', color: 'white', fontWeight: '500', paddingVertical: 2, paddingHorizontal: 5, borderRadius: 3 }}>{
                                            objDetailHistoryPengajuanRevisiAbsen.status
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
                                            value={objDetailHistoryPengajuanRevisiAbsen.note_review}
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
                                            setShowModalDetailHistoryPengajuanRevisiAbsen(false)
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
            {/* End of Modal Detail History Pengajuan Revisi Absen */}

            {/* List RIWAYAT PENGAJUAN REVISI ABSENSI */}
            <View >
                <View style={[styles.postContainer, { marginBottom: 10 }]}>
                    <MaterialCommunityIcons
                        name="history"
                        style={styles.postIcon}
                        size={20}
                    />

                    <Text style={styles.postText}>RIWAYAT PENGAJUAN REVISI ABSENSI</Text>
                </View>
                {
                    loadingHistoryPengajuanRevisiAbsen ?
                        <Loading /> :
                        <>

                            <View
                                style={styles.cardListTable}
                            >
                                <View
                                    style={styles.listTableThead}
                                >
                                    <Text style={[{ flex: 4 }, styles.listTableTheadTD]}>Dikirim Pada</Text>
                                    <Text style={[{ flex: 5 }, styles.listTableTheadTD]}>Status</Text>
                                    <Text style={[{ flex: 3 }, styles.listTableTheadTD]}>Aksi</Text>
                                </View>
                                {
                                    <FlatList
                                        data={arrHistoryPengajuanRevisiAbsen.data}
                                        renderItem={({ item, index, separators }) => (
                                            <View
                                                key={index}
                                                style={styles.listTableTbody}
                                            >
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
                                                                    setObjDetailHistoryPengajuanRevisiAbsen(item)
                                                                    setShowModalDetailHistoryPengajuanRevisiAbsen(true)
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
                                            </View>
                                        )}
                                        keyExtractor={item => item.id}
                                        scrollEnabled={false}
                                    />
                                }
                            </View>
                            {
                                arrHistoryPengajuanRevisiAbsen.next_page_url ?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                const splittedUrl = arrHistoryPengajuanRevisiAbsen.next_page_url.split('/api/mobile')

                                                loadArrHistoryPengajuanRevisiAbsen(splittedUrl[splittedUrl.length - 1])
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
            {/* End of List RIWAYAT PENGAJUAN REVISI ABSENSI */}

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
})