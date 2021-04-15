import { put } from 'redux-saga/effects';
import { SaleItem } from '..';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import {
    saleItemData,
    saleItemError,
    FindSaleById
} from '../actions';

export function* findSaleItemByIdSaga(action: FindSaleById) {
    try {
        const saleItem = yield axios.get<SaleItem[]>(`ieo/fetch/ieo_id=${action.payload.id}`);
        yield put(saleItemData(saleItem.data));
    } catch (error) {
        yield put(saleItemError(error));
    }
}
