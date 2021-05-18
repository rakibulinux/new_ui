// tslint:disable-next-line
import { put } from 'redux-saga/effects';
import pluginAPI from '../../../../plugins/api';
import {
	allChildCurrenciesData,
	allChildCurrenciesError,
	WalletsAddressFetch,
	walletsChildCurrenciesData,
	walletsChildCurrenciesError,
} from '../actions';

export function* childCurrenciesSaga(action: WalletsAddressFetch) {
	try {
		const child_currencies = yield pluginAPI.get(`wallet/child-currencies/fetch/parent-currency=${action.payload.currency}`);
		yield put(
			walletsChildCurrenciesData({
				payload: child_currencies.data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(walletsChildCurrenciesError(error));
	}
}

export function* allChildCurrenciesSaga(action: WalletsAddressFetch) {
	try {
		const child_currencies = yield pluginAPI.get(`wallet/child-currencies/fetch/all`);
		yield put(
			allChildCurrenciesData({
				payload: child_currencies.data,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(allChildCurrenciesError(error));
	}
}
