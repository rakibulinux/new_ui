// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
import { walletsWithdrawCcyData, walletsWithdrawCcyError, WalletsWithdrawCcyFetch } from '../actions';

const walletsWithdrawCcyOptions = (csrfToken?: string): RequestOptions => {
	return {
		apiVersion: 'peatio',
		headers: { 'X-CSRF-Token': csrfToken },
	};
};

const createOptions = (csrfToken?: string): RequestOptions => {
	return { apiVersion: 'wallet', headers: { 'X-CSRF-Token': csrfToken } };
};

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
	try {
		yield put(alertPush({ message: ['waiting.withdraw.action'], type: 'success' }));
		yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/transfer', action.payload);
		const response = yield call(API.post(walletsWithdrawCcyOptions(getCsrfToken())), '/account/withdraws', action.payload);
		const { currency, amount } = action.payload;
		yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/eth/withdraw', {
			withdraw_id: response.id,
			currency: currency,
			amount: amount,
		});
		yield put(walletsWithdrawCcyData());
		yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
	} catch (error) {
		yield put(walletsWithdrawCcyError(error));
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
