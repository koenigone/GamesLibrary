import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.rawg.io/api',
    params: {
        key: 'ec220b8959e44c388d687b31ed55fd93'
    }
})