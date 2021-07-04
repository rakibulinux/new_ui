import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { docTradeUserApiData, docTradeUserApiError, DocTradeUserApiFetch } from '../actions';

const docTradeUserApiFetchOptions: RequestOptions = {
	apiVersion: 'peatio',
	withHeaders: false,
};

export function* docTradeUserApiFetchSaga(action: DocTradeUserApiFetch) {
	try {
		const payload = yield call(API.get(docTradeUserApiFetchOptions), '/swagger');
		yield put(docTradeUserApiData(payload));
	} catch (error) {
		yield put(docTradeUserApiError(error));
	}
}
