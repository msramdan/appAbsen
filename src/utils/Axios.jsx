import axios from "axios";

const Axios = axios.create({
    baseURL: 'https://5b35-140-213-160-234.ngrok-free.app/api/mobile',
})

export default Axios