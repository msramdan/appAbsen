import {Text, StyleSheet} from 'react-native';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

//import material icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//import screens Pages
import Pages from '../screens/pages/Index';

//import screens Aparaturs
import Aparaturs from '../screens/aparaturs/Index';

export default function TopTabsNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Pages"
        component={Pages}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={
                focused ? styles.tabBarLabelTextActive : styles.tabBarLabelText
              }>
              TENTANG DESA
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="information"
              color={focused ? 'green' : '#748c94'}
              size={25}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Aparaturs"
        component={Aparaturs}
        options={{
          tabBarLabel: ({focused}) => (
            <Text
              style={
                focused ? styles.tabBarLabelTextActive : styles.tabBarLabelText
              }>
              PEMERINTAH DESA
            </Text>
          ),
          tabBarIcon: ({focused}) => (
            <MaterialCommunityIcons
              name="account-supervisor"
              color={focused ? 'green' : '#748c94'}
              size={25}
            />
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarLabelText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#748c94',
  },

  tabBarLabelTextActive: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'green',
  },
});