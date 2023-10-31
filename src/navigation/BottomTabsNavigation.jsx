import {View, Text, Image, StyleSheet} from 'react-native';

//tabs navigation
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

//import screens Home
import Home from '../screens/home/Index';

//import screens Posts
import Posts from '../screens/posts/Index';

//import screens products
import Products from '../screens/products/Index';

//import screens Events
import Photos from '../screens/photos/Index';
import TopTabsNavigation from './TopTabNavigator';

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
          tabBarIcon: ({focused}) => (
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
        name="Products"
        component={Products}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconCenter}>
              <Image
                source={require('../assets/icons/shopping-basket.png')}
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

      {/* <Tab.Screen
        name="Info"
        component={TopTabsNavigation}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View
              style={
                focused
                  ? styles.tabBarIconInfoCenterActive
                  : styles.tabBarIconInfoCenter
              }>
              <Image
                source={require('../assets/icons/info.png')}
                resizeMode="contain"
                style={styles.tabBarIconInfo}
              />
            </View>
          ),
        }}
      /> */}

      <Tab.Screen
        name="Posts"
        component={Posts}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
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
                BERITA
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Photos"
        component={Photos}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconCenter}>
              <Image
                source={require('../assets/icons/images.png')}
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
    backgroundColor: 'green',
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
    tintColor: 'green',
  },

  tabBarText: {
    color: '#748c94',
    fontSize: 9,
    top: 3,
    fontWeight: 'bold',
  },

  tabBarTextActive: {
    color: 'green',
    fontSize: 9,
    top: 3,
    fontWeight: 'bold',
  },
});
