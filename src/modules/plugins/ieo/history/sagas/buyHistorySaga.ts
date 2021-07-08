import { FetchBuyHistory, FetchBuyersHistory, fetchBuyersHistoryData, fetchBuyHistoryData, fetchHistoryError } from '../actions';
import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { BuyHistory } from '../types';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'ieoAPIUrl', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* fetchBuyHistorySaga(action: FetchBuyHistory) {
	try {
		const { ieo_id, page, pageSize } = action.payload;
		const listHistory = yield call(
			API.get(createOptions()),
			`private/ieo/buy_history/ieo_id=${ieo_id}?page=${page}&pageSize=${pageSize}`,
		);

		yield put(
			fetchBuyHistoryData({
				payload: listHistory.payload as BuyHistory[],
				loading: true,
				total: Number(listHistory.total),
			}),
		);
	} catch (error) {
		yield put(fetchHistoryError(JSON.stringify(error.message)));
	}
}

export function* fetchBuyersHistorySaga(action: FetchBuyersHistory) {
	try {
		const { ieo_id, page, pageSize } = action.payload;
		const buyers = yield call(
			API.get(createOptions()),
			`private/ieo/buy_history/ieo_id=${ieo_id}?page=${page}&pageSize=${pageSize}`,
		);
		yield put(
			fetchBuyersHistoryData({
				payload: buyers.payload,
				total: buyers.total,
				loading: true,
			}),
		);
	} catch (error) {
		yield put(fetchHistoryError(JSON.stringify(error.message)));
	}
}
