import { put } from 'redux-saga/effects';
import axios from '../../../../../plugins/api/index';

import { FetchBuyHistory, FetchBuyersHistory, fetchBuyersHistoryData, fetchBuyHistoryData } from '../actions';
import { BuyHistory, BuyersHistory } from '../types';

export function* fetchBuyHistorySaga(action: FetchBuyHistory) {
	try {
		const { ieo_id, uid, page, pageSize } = action.payload;
		const listHistory = yield axios.get<BuyHistory[]>(
			`private/ieo/buy_history/uid=${uid}/ieo_id=${ieo_id}&page=${page}&pageSize=${pageSize}`,
		);
		yield put(
			fetchBuyHistoryData({
				payload: listHistory.data.payload,
				loading: true,
				total: listHistory.data.total,
			}),
		);
	} catch (error) {
		// yield put(alertPush({ message: ['page.ieo.buy.error'], type: 'error' }));
	}
}

export function* fetchBuyersHistorySaga(action: FetchBuyersHistory) {
	try {
		const { ieo_id, page, pageSize } = action.payload;
		const buyers = yield axios.get<BuyersHistory>(`public/ieo/buyers/ieo_id=${ieo_id}&page=${page}&pageSize=${pageSize}`);
		yield put(
			fetchBuyersHistoryData({
				payload: buyers.data.payload,
				total: buyers.data.total,
				loading: true,
			}),
		);
	} catch (error) {
		// yield put(totalIEOBuyersError(error));
	}
}
