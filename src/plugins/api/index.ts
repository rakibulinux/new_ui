import axios from 'axios';

const instance = axios.create({
	// baseURL: 'https://api-circleex.herokuapp.com/',
	// baseURL: 'https://lukutex-api-test.herokuapp.com/',
	baseURL: 'http://localhost:4000/api/',
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Content-Type': 'application/json',
	},
});

// tslint:disable-next-line: no-default-export
export default instance;
