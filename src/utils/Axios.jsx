import axios from "axios";

const Axios = axios.create({
    headers: {
        'Access-Control-Allow-Origin': true,
    },
    baseURL: 'https://ccc4-140-213-176-122.ngrok-free.app/api/mobile',
})

export default Axios