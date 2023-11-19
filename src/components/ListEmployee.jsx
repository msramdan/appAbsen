import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ListEmployee({ employee }) {
    return (
        <TouchableOpacity
            disabled={true}
        >
            <View style={styles.card}>
                <Image source={require('./../assets/images/user.png')} style={styles.image} />
                <View style={styles.employeeDetailWrapper}>
                    <View>
                        <Text style={styles.employeeFullName}>{employee.full_name}</Text>
                        <Text style={styles.employeejobPosition}>{employee.job_position}</Text>
                        <Text style={styles.employeeEmail}>{employee.email}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                            <Text style={styles.employeeDepartment}>{employee.department.department_name}</Text>
                            <Text style={[styles.employeeDepartmentType, { backgroundColor: employee.employee_type == 'Expatriate' ? '#0ea5e9' : '#6366f1' }]}>{employee.employee_type}</Text>
                        </View>
                    </View>
                    <Text style={[styles.employeeStatus, { backgroundColor: employee.work_status == 'Active' ? '#22c55e' : '#ef4444' }]}>{employee.work_status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        flexDirection: 'row',
        marginBottom: 10,
        padding: 6,
        borderRadius: 5,
    },
    image: {
        aspectRatio: 18 / 18,
        borderRadius: 5,
        marginRight: 8,
        flex: 0.8,
    },
    employeeDetailWrapper: {
        padding: 2,
        flex: 2,
        justifyContent: 'space-between'
    },
    employeejobPosition: {
        fontSize: 13,
        marginTop: 2
    },
    employeeEmail: {
        fontSize: 13,
    },
    employeeDepartment: {
        fontWeight: '700'
    },
    employeeDepartmentType: {
        marginLeft: 6,
        color: 'blue',
        fontWeight: '700',
        fontSize: 10,
        backgroundColor: 'blue',
        alignSelf: 'flex-start',
        color: 'white',
        padding: 2,
        paddingHorizontal: 6,
        fontWeight: '600',
        borderRadius: 3,
        transform: [{ translateY: 2 }]
    },
    employeeFullName: {
        fontWeight: '700',
        color: 'black',
        fontSize: 16
    },
    employeeStatus: {
        alignSelf: 'flex-start',
        color: 'white',
        padding: 3,
        paddingHorizontal: 8,
        fontSize: 11,
        borderRadius: 5,
        fontWeight: '600',
        marginTop: 8
    }
})