import { takeLatest } from 'redux-saga/effects';
import { BUY_SALE_ITEM, GET_TOTAL_BUYERS, RESET_BUY_RESPONSE } from '../constants';
import { buySaleItemSaga, getTotalBuyersSaga, resetBuyResponseSaga } from './buySaga';

export function* rootBuySaga() {
	yield takeLatest(BUY_SALE_ITEM, buySaleItemSaga);
	yield takeLatest(RESET_BUY_RESPONSE, resetBuyResponseSaga);
	yield takeLatest(GET_TOTAL_BUYERS, getTotalBuyersSaga);
}
