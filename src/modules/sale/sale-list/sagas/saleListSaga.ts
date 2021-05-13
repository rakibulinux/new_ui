import { put } from 'redux-saga/effects';
import { SaleItem } from '../../..';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import {
	ActiveSaleListFetch,
	EndedSaleListFetch,
	OngoingSaleListFetch,
	saleListData,
	saleListError,
	UpcomingSaleListFetch,
} from '../actions';

export function* activeSaleListSaga(action: ActiveSaleListFetch) {
	try {
		const saleList = yield axios.get<SaleItem[]>('ieo/fetch/active');
		yield put(saleListData(saleList.data));
	} catch (error) {
		yield put(saleListError(error));
	}
}

export function* upComingSaleListSaga(action: UpcomingSaleListFetch) {
	try {
		const saleList = yield axios.get<SaleItem[]>('ieo/fetch/upcoming');
		yield put(saleListData(saleList.data));
	} catch (error) {
		yield put(saleListError(error));
	}
}

export function* onGoingSaleListSaga(action: OngoingSaleListFetch) {
	try {
		const saleList = yield axios.get<SaleItem[]>('ieo/fetch/ongoing');
		yield put(saleListData(saleList.data));
	} catch (error) {
		yield put(saleListError(error));
	}
}

export function* endedSaleListSaga(action: EndedSaleListFetch) {
	try {
		const saleList = yield axios.get<SaleItem[]>('ieo/fetch/ended');
		yield put(saleListData(saleList.data));
	} catch (error) {
		yield put(saleListError(error));
	}
}
