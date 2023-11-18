import axios from "axios";

const Axios = axios.create({
    baseURL: 'https://rms-hexamatics.id/api/mobile',
})

export default Axios