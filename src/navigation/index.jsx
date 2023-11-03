import { NavigationContainer } from '@react-navigation/native';

//stack navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

//import screen splash
import Splash from '../screens/splash/Index';

//import BottomTabsNavigation
import BottomTabsNavigation from './BottomTabsNavigation';

//import screen post show
import PostShow from '../screens/posts/Show';

//import screen product show
// import ProductShow from '../screens/products/Show';

//import screen page show
// import PageShow from '../screens/pages/Show';

//import screen login
import Login from '../screens/login/Index';

export default function Navigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Splash">
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HomeScreen"
                    component={BottomTabsNavigation}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PostShow"
                    component={PostShow}
                    options={{ title: '' }}
                />
                {/* <Stack.Screen
          name="ProductShow"
          component={ProductShow}
          options={{title: ''}}
        /> */}
                {/* <Stack.Screen
                    name="PageShow"
                    component={PageShow}
                    options={{ title: '' }}
                /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
