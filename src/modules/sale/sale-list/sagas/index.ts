import { takeLatest } from 'redux-saga/effects';
import {
	SALE_LIST_ACTIVE,
	SALE_LIST_ENDED,
	SALE_LIST_ONGOING,
	SALE_LIST_UPCOMING,
	//  sALE_FIND_BY_ID
} from '../constants';
import { activeSaleListSaga, endedSaleListSaga, onGoingSaleListSaga, upComingSaleListSaga } from './saleListSaga';

export function* rootSaleListSaga() {
	yield takeLatest(SALE_LIST_ACTIVE, activeSaleListSaga);
	yield takeLatest(SALE_LIST_UPCOMING, upComingSaleListSaga);
	yield takeLatest(SALE_LIST_ONGOING, onGoingSaleListSaga);
	yield takeLatest(SALE_LIST_ENDED, endedSaleListSaga);
}
