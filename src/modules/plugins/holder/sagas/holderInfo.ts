import { put, call } from 'redux-saga/effects';
import { API, RequestOptions } from 'api';
import { getCsrfToken } from 'helpers';
import { GetHolderInfo, holderInfoData } from '../actions';

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'holder', headers: { 'X-CSRF-Token': csrfToken } };
};
export function* getHolderInfoSaga(action: GetHolderInfo) {
	try {
		const holder = yield call(API.get(createOptions(getCsrfToken())), `/private/holder/get`);
		yield put(
			holderInfoData({
				payload: holder,
				loading: false,
			}),
		);
	} catch (error) {
		yield put(
			holderInfoData({
				payload: null,
				loading: false,
			}),
		);
	}
}
