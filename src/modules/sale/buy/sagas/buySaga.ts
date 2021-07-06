import { put } from 'redux-saga/effects';
import { Buy } from '..';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import { buyError, buyResponse, BuySaleItem, GetTotalBuyers, totalBuyersData, totalBuyersError } from '../actions';
import { TotalBuyers } from '../types';

export function* buySaleItemSaga(action: BuySaleItem) {
	try {
		const response = yield axios.post<Buy>(`ieo/buy`, action.payload);
		console.log(response.data);
		yield put(
			buyResponse({
				payload: response.data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			buyError({
				code: error.response.code,
				message: error.response.data.msg,
			}),
		);
	}
}

export function* resetBuyResponseSaga() {
	yield put(
		buyResponse({
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

export function* getTotalBuyersSaga(action: GetTotalBuyers) {
	try {
		const totalBuyers = yield axios.get<TotalBuyers>(`public/ieo/total-buyers/${action.payload.ieo_id}`);
		yield put(
			totalBuyersData({
				payload: totalBuyers.data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(totalBuyersError(error));
	}
}
