import { put } from 'redux-saga/effects';
import { IEOItem } from '../..';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../../plugins/api/index';

import { IEOListData, IEOListError, IEOListDataFetch } from '../actions';

export function* IEOListSaga(action: IEOListDataFetch) {
	try {
		const IEOList = yield axios.get<IEOItem[]>('public/ieo/list');
		yield put(IEOListData(IEOList.data));
	} catch (error) {
		yield put(IEOListError(error));
	}
}
