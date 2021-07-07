import { alertPush } from 'modules';
import { put } from 'redux-saga/effects';
import { BuyIEO } from '..';
import axios from '../../../../../plugins/api/index';

import { buyIEOResponse, BuyIEOItem, GetIEOTotalBuyers, totalIEOBuyersData, totalIEOBuyersError } from '../actions';
import { TotalIEOBuyers } from '../types';
import { fetchBuyHistory, fetchBuyersHistory } from './../../history';

export function* buyIEOItemSaga(action: BuyIEOItem) {
	try {
		yield axios.post<BuyIEO>(`private/ieo/buy`, action.payload);
		yield put(
			fetchBuyHistory({
				ieo_id: Number(action.payload.ieo_id),
				uid: action.payload.uid,
				page: 0,
				pageSize: 5,
			}),
		);
		yield put(
			fetchBuyersHistory({
				ieo_id: Number(action.payload.ieo_id),
				page: 0,
				pageSize: 5,
			}),
		);
		yield put(alertPush({ message: ['page.ieo.buy.success'], type: 'success' }));
	} catch (error) {
		yield put(alertPush({ message: ['page.ieo.buy.error'], type: 'error' }));
	}
}

export function* resetBuyResponseSaga() {
	yield put(
		buyIEOResponse({
			payload: {
				ieo_id: '',
				uid: '',
				quantity: 0,
				quote_currency: '',
				total_purchase: 0,
				success: false,
			},
			loading: false,
		}),
	);
}

export function* getTotalBuyersSaga(action: GetIEOTotalBuyers) {
	try {
		const totalBuyers = yield axios.get<TotalIEOBuyers>(`public/ieo/total-buyers/${action.payload.ieo_id}`);
		yield put(
			totalIEOBuyersData({
				payload: totalBuyers.data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(totalIEOBuyersError(error));
	}
}
