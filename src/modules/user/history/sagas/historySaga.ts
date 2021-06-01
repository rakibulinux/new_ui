// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, defaultStorageLimit, RequestOptions } from '../../../../api';
import { sliceArray } from '../../../../helpers';
import { alertPush } from '../../../public/alert';
import { failHistory, HistoryFetch, successHistory } from '../actions';

const config: RequestOptions = {
	apiVersion: 'peatio',
};

export function* historySaga(action: HistoryFetch) {
	try {
		const { type, limit, page } = action.payload;
		const coreEndpoint = {
			deposits: '/account/deposits',
			withdraws: '/account/withdraws',
			trades: '/market/trades',
		};

		const params = `page=${page}&limit=${limit}`;
		const data = yield call(API.get(config), `${coreEndpoint[type]}?${params}`);

		const nextPageExists = false;

		let updatedData = data;

		if (type === 'trades') {
			updatedData = sliceArray(data, defaultStorageLimit());
		}

		yield put(successHistory({ list: updatedData, page, nextPageExists }));
	} catch (error) {
		yield put(failHistory([]));
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
