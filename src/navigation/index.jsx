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
import EditProfileScreen from '../screens/edit-profile';
import ChangePasswordScreen from '../screens/change-password';
import TidakMasukHariIniScreen from '../screens/riwayat-menu/tidak-masuk-hari-ini';
import RiwayatAbsensiScreen from '../screens/riwayat-menu/riwayat-absensi';
import RiwayatPengajuanIzinSakitScreen from '../screens/riwayat-menu/riwayat-pengajuan-izin-sakit';
import RiwayatPengajuanCutiScreen from '../screens/riwayat-menu/riwayat-pengajuan-cuti';
import RiwayatPengajuanRevisiAbsensiScreen from '../screens/riwayat-menu/riwayat-pengajuan-revisi-absensi';

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
                <Stack.Screen
                    name="EditProfileScreen"
                    component={EditProfileScreen}
                    options={{ title: 'Edit Profile' }}
                />
                <Stack.Screen
                    name="ChangePasswordScreen"
                    component={ChangePasswordScreen}
                    options={{ title: 'Change Password' }}
                />
                <Stack.Screen
                    name="TidakMasukHariIniScreen"
                    component={TidakMasukHariIniScreen}
                    options={{ title: 'Tidak Masuk Hari Ini' }}
                />
                <Stack.Screen
                    name="RiwayatAbsensiScreen"
                    component={RiwayatAbsensiScreen}
                    options={{ title: 'Riwayat Absensi' }}
                />
                <Stack.Screen
                    name="RiwayatPengajuanIzinSakitScreen"
                    component={RiwayatPengajuanIzinSakitScreen}
                    options={{ title: 'Riwayat Pengajuan Izin Sakit' }}
                />
                <Stack.Screen
                    name="RiwayatPengajuanCutiScreen"
                    component={RiwayatPengajuanCutiScreen}
                    options={{ title: 'Riwayat Pengajuan Cuti' }}
                />
                <Stack.Screen
                    name="RiwayatPengajuanRevisiAbsensiScreen"
                    component={RiwayatPengajuanRevisiAbsensiScreen}
                    options={{ title: 'Riwayat Pengajuan Revisi Absensi' }}
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
