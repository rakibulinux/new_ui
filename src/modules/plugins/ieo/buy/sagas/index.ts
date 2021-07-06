import { takeLatest } from 'redux-saga/effects';
import { BUY_IEO_ITEM, GET_TOTAL_BUYERS, RESET_BUY_RESPONSE } from '../constants';
import { buyIEOItemSaga, getTotalBuyersSaga, resetBuyResponseSaga } from './buySaga';

export function* rootBuySaga() {
	yield takeLatest(BUY_IEO_ITEM, buyIEOItemSaga);
	yield takeLatest(RESET_BUY_RESPONSE, resetBuyResponseSaga);
	yield takeLatest(GET_TOTAL_BUYERS, getTotalBuyersSaga);
}
