import { View, Text, Image, StyleSheet } from 'react-native';

//tabs navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

//import screens Home
import Home from '../screens/home/Index';

//import screens Posts
import Posts from '../screens/posts/Index';

//import screens employee
import Employee from '../screens/employee/Index';

//import screens profile
import Profile from '../screens/profile/Index';

//import TopTabsNavigation
export default function BottomTabsNavigation() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={styles.screenOptionsTab}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIconCenter}>
                            <Image
                                source={require('../assets/icons/home.png')}
                                resizeMode="contain"
                                style={
                                    focused
                                        ? styles.tabBarIconImageActive
                                        : styles.tabBarIconImage
                                }
                            />
                            <Text
                                style={focused ? styles.tabBarTextActive : styles.tabBarText}>
                                HOME
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Employee"
                component={Employee}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIconCenter}>
                            <Image
                                source={require('../assets/icons/users.png')}
                                resizeMode="contain"
                                style={
                                    focused
                                        ? styles.tabBarIconImageActive
                                        : styles.tabBarIconImage
                                }
                            />
                            <Text
                                style={focused ? styles.tabBarTextActive : styles.tabBarText}>
                                EMPLOYEES
                            </Text>
                        </View>
                    ),
                }}
            />

            <Tab.Screen
                name="Posts"
                component={Posts}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIconCenter}>
                            <Image
                                source={require('../assets/icons/newspaper.png')}
                                resizeMode="contain"
                                style={
                                    focused
                                        ? styles.tabBarIconImageActive
                                        : styles.tabBarIconImage
                                }
                            />
                            <Text
                                style={focused ? styles.tabBarTextActive : styles.tabBarText}>
                                NEWS
                            </Text>
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <View style={styles.tabBarIconCenter}>
                            <Image
                                source={require('../assets/icons/user.png')}
                                resizeMode="contain"
                                style={
                                    focused
                                        ? styles.tabBarIconImageActive
                                        : styles.tabBarIconImage
                                }
                            />
                            <Text
                                style={focused ? styles.tabBarTextActive : styles.tabBarText}>
                                PROFILE
                            </Text>
                        </View>
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    screenOptionsTab: {
        tabBarActiveTintColor: '#e91e63',
        headerShown: false,
        tabBarStyle: {
            position: 'absolute',
            bottom: 25,
            left: 20,
            right: 20,
            elevation: 0,
            backgroundColor: '#fff',
            borderRadius: 15,
            height: 70,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.0,
            elevation: 1,
        },
    },

    tabBarIconInfoCenter: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#748c94',
    },

    tabBarIconInfoCenterActive: {
        top: -20,
        justifyContent: 'center',
        alignItems: 'center',
        width: 65,
        height: 65,
        borderRadius: 35,
        backgroundColor: '#3498db',
    },

    tabBarIconInfo: {
        width: 27,
        height: 27,
        tintColor: '#ffffff',
    },

    tabBarIconCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        top: 2,
    },

    tabBarIconImage: {
        width: 23,
        height: 23,
        tintColor: '#748c94',
    },

    tabBarIconImageActive: {
        width: 23,
        height: 23,
        tintColor: '#3498db',
    },

    tabBarText: {
        color: '#748c94',
        fontSize: 9,
        top: 3,
        fontWeight: 'bold',
    },

    tabBarTextActive: {
        color: '#3498db',
        fontSize: 9,
        top: 3,
        fontWeight: 'bold',
    },
});
