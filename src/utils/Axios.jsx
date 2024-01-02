import axios from "axios";

const Axios = axios.create({
    baseURL: 'https://rms.mitrateraakurasi.com/api/mobile',
})

export default Axios