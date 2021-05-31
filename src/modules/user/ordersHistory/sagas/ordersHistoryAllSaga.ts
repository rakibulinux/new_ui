import { call, put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import { API, RequestOptions } from '../../../../api';
import { userOrdersHistoryAlldata, UserOrdersHistoryAllFetch, userOrdersHistoryError } from '../actions';

const ordersOptions: RequestOptions = {
	apiVersion: 'peatio',
};

export function* ordersHistoryAllSaga(action: UserOrdersHistoryAllFetch) {
	try {
		const { pageIndex, limit, type } = action.payload;
		const params = `${type === 'all' ? '' : '&state=wait'}`;
		// get data with pageIndex=1 and limit ==limit
		let data = yield call(API.get(ordersOptions), `/market/orders?page=${pageIndex + 1}&limit=${limit}${params}`);
		console.log(data);
		if (data.length === limit) {
			// trả về 20 thằng đâu tiên cho ui chứ ko để loop xong het data moi trả về
			yield put(userOrdersHistoryAlldata({ list: data }));
			// loop get all data
			let index = 1;
			const max = 100;
			let checkData = yield call(API.get(ordersOptions), `/market/orders?page=${index}&limit=${max}${params}`);
			if (checkData.length === max) {
				data = checkData;
				while (1) {
					checkData = yield call(API.get(ordersOptions), `/market/orders?page=${++index}&limit=${max}${params}`);
					if (checkData.length === max) {
						data = data.concat(checkData);
					} else {
						data = data.concat(checkData);
						break;
					}
				}
			} else {
				data = checkData;
			}
		}

		yield put(userOrdersHistoryAlldata({ list: data }));
	} catch (error) {
		yield put(userOrdersHistoryError());
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
