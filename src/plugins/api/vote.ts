import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://zozitech.herokuapp.com/api',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json',
	},
});

// tslint:disable-next-line: no-default-export
export default instance;
