import { put } from 'redux-saga/effects';
import { IEOItem } from '..';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../../plugins/api/index';

import { findIEOById, IEOItemData, IEOItemError } from '../actions';

export function* findIEOItemByIdSaga(action: findIEOById) {
	try {
		const IEOItem = yield axios.get<IEOItem[]>(`public/ieo/${action.payload.id}`);
		yield put(IEOItemData(IEOItem.data));
	} catch (error) {
		yield put(IEOItemError(error));
	}
}
