import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Axios from "../../utils/Axios";
import { Redirect } from "../../utils/Redirect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-date-picker'
import Loading from "../../components/Loading";
import { useToast } from "react-native-toast-notifications";

export default function EditProfileScreen({ navigation }) {
    const [fullName, setFullname] = useState('')
    const [email, setEmail] = useState('')
    const [gender, setGender] = useState('')
    const [dob, setDob] = useState('')
    const [openModalDOB, setOpenModalDOB] = useState(false)
    const [loading, setLoading] = useState(true)
    const toast = useToast();

    useEffect(() => {
        loadEmployee()
    }, [])

    const loadEmployee = async () => {
        const token = await AsyncStorage.getItem('apiToken')

        Axios.get('/auth/employee', {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((res) => {

                setFullname(res.data.data.full_name)
                setEmail(res.data.data.email)
                setGender(res.data.data.gender)

                const dobExploded = res.data.data.date_of_birth;
                setDob(new Date(`${dobExploded.split('/')[2]}-${dobExploded.split('/')[1]}-${dobExploded.split('/')[0]}`))

                setLoading(false)
            }).catch((err) => {
                if (err.response.status == 401) {
                    Redirect.toLoginScreen(navigation)
                }
            })
    }

    const doUpdateProfile = async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem('apiToken')

        Axios.put('auth-employee/update', {
            "full_name": fullName,
            "email": email,
            "gender": gender,
            "date_of_birth": `${dob.getFullYear()}-${parseInt(dob.getMonth() + 1) < 10 ? `0${parseInt(dob.getMonth() + 1)}` : parseInt(dob.getMonth() + 1)}-${parseInt(dob.getDate()) < 10 ? `0${parseInt(dob.getDate())}` : parseInt(dob.getDate())}`
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setLoading(false)
                toast.show('Profile successfully updated', {
                    type: 'success',
                    placement: 'center'
                })
                setTimeout(() => {
                    navigation.navigate('Profile')
                }, 300);
            }
        }).catch((err) => {
            setLoading(false)
            if (err.response.status == 401) {
                Redirect.toLoginScreen(navigation)
            } else if (err.response.status == 422) {
                toast.show(err.response.data.error, {
                    type: 'danger',
                    placement: 'center'
                })
            }
        })
    }

    return (
        <View style={{ flex: 1 }}>
            {
                loading ?
                    <Loading style={styles.loading} />
                    : <></>
            }
            <View style={styles.page}>
                <View style={styles.imageHeadWrap}>
                    <Image source={require('../../assets/images/user.png')} style={styles.foto} />
                </View>
                <View style={styles.formWrapper}>
                    <View>
                        <Text
                            style={styles.labelInput}
                        >Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={text => setFullname(text)}
                        />
                    </View>

                    <View>
                        <Text
                            style={styles.labelInput}
                        >Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                    </View>
                    <View>
                        <Text
                            style={styles.labelInput}
                        >Gender</Text>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            style={{
                                inputAndroidContainer: [styles.input],
                                inputAndroid: {
                                    color: '#333'
                                }
                            }}
                            value={gender}
                            placeholder={{}}
                            onValueChange={(value) => setGender(value)}
                            items={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                            ]}
                        />
                    </View>
                    {
                        dob ?
                            <View>
                                <Text
                                    style={styles.labelInput}
                                >Date of Birth</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setOpenModalDOB(true)
                                    }}
                                >
                                    <TextInput
                                        style={[styles.input, { color: '#333' }]}
                                        placeholder="Date of Birth"
                                        editable={false}
                                        value={`${dob.getFullYear()}-${parseInt(dob.getMonth() + 1) < 10 ? `0${parseInt(dob.getMonth() + 1)}` : parseInt(dob.getMonth() + 1)}-${parseInt(dob.getDate()) < 10 ? `0${parseInt(dob.getDate())}` : parseInt(dob.getDate())}`}
                                    />
                                </TouchableOpacity>
                                <DatePicker
                                    modal
                                    mode="date"
                                    open={openModalDOB}
                                    date={dob}
                                    onConfirm={(date) => {
                                        setOpenModalDOB(false)
                                        setDob(date)
                                    }}
                                    onCancel={() => {
                                        setOpenModalDOB(false)
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => {
                                        doUpdateProfile()
                                    }}
                                    style={styles.button}>
                                    <Text style={styles.buttonText}>
                                        {'Update Profile'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            : <></>
                    }
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    imageHeadWrap: {
        backgroundColor: '#3498db',
        paddingVertical: 20
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    formWrapper: {
        marginTop: 15,
        paddingHorizontal: 30,
        paddingVertical: 15
    },
    foto: {
        width: 140,
        height: 140,
        borderRadius: 40,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 13,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    labelInput: {
        color: '#666',
        fontWeight: '500',
        marginBottom: 4
    },
    loading: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 999999999,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
});