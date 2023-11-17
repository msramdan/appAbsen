import axios from "axios";

const Axios = axios.create({
    baseURL: 'https://3043-140-213-166-221.ngrok-free.app/api/mobile',
})

export default Axios