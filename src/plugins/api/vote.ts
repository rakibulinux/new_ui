import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://localhost:3333/api',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json',
	},
});

// tslint:disable-next-line: no-default-export
export default instance;
