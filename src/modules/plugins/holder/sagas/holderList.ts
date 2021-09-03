import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { FetchHolderList, holderListData } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'holder', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* getHolderListSaga(action: FetchHolderList) {
	try {
		const list = yield call(API.get(createOptions(getCsrfToken())), `/private/holder/list`);
		yield put(holderListData(list));
	} catch (error) {
		yield put(holderListData([]));
	}
}
