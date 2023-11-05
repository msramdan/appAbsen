import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Axios from "../../utils/Axios";
import { Redirect } from "../../utils/Redirect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loading from "../../components/Loading";
import { useToast } from "react-native-toast-notifications";

export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
    const [loading, setLoading] = useState(false)
    const toast = useToast();

    const doUpdatePassword = async () => {
        setLoading(true)
        const token = await AsyncStorage.getItem('apiToken')

        Axios.put('auth-employee/change-password', {
            "old_password": oldPassword,
            "new_password": newPassword,
            "new_password_confirmation": newPasswordConfirmation,
        }, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then((res) => {
            if (res) {
                setLoading(false)
                toast.show('Password successfully updated', {
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
                    <Image source={require('../../assets/images/key.png')} style={styles.foto} />
                    <Text style={styles.changePasswordText}>Change Password</Text>
                </View>
                <View style={styles.formWrapper}>
                    <View>
                        <Text
                            style={styles.labelInput}
                        >Old Password</Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            placeholder="Old Password"
                            value={oldPassword}
                            onChangeText={value => setOldPassword(value)}
                        />
                    </View>
                    <View>
                        <Text
                            style={styles.labelInput}
                        >New Password</Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            placeholder="New Password"
                            value={newPassword}
                            onChangeText={value => setNewPassword(value)}
                        />
                    </View>
                    <View>
                        <Text
                            style={styles.labelInput}
                        >New Password Confirmation</Text>
                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            placeholder="New Password Confirmation"
                            value={newPasswordConfirmation}
                            onChangeText={value => setNewPasswordConfirmation(value)}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            doUpdatePassword()
                        }}
                        style={styles.button}>
                        <Text style={styles.buttonText}>
                            {'Update Password'}
                        </Text>
                    </TouchableOpacity>
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
        width: 100,
        height: 100,
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
    },
    changePasswordText: {
        color: '#FFF',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 20,
        marginTop: 13
    }
});