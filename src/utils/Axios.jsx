import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Axios = axios.create({
    baseURL: 'https://karyawan-be.matursoft.com/api/mobile',
})

export default Axios