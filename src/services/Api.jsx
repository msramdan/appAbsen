//import axios
import axios from 'axios';

const Api = axios.create({
  //set endpoint API
  baseURL: 'https://desa-api.appdev.my.id',

  //set header axios
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default Api;