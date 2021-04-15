import { takeLatest } from 'redux-saga/effects';
import {
     BUY_SALE_ITEM,
     RESET_BUY_RESPONSE,
     GET_TOTAL_BUYERS
} from '../constants';
import { buySaleItemSaga, resetBuyResponseSaga, getTotalBuyersSaga } from './buySaga';

export function* rootBuySaga() {
    yield takeLatest(BUY_SALE_ITEM, buySaleItemSaga);
    yield takeLatest(RESET_BUY_RESPONSE, resetBuyResponseSaga);
    yield takeLatest(GET_TOTAL_BUYERS, getTotalBuyersSaga);
}
