import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://api-circleex.herokuapp.com/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    }
});

export default instance;
