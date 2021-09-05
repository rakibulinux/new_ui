import { takeLatest } from 'redux-saga/effects';
import { SALE_FIND_BY_ID } from '../constants';
import { findSaleItemByIdSaga } from './saleItemSaga';

export function* rootSaleItemSaga() {
	yield takeLatest(SALE_FIND_BY_ID, findSaleItemByIdSaga);
}
