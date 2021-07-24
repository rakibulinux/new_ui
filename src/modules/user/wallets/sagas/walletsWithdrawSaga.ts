// tslint:disable-next-line
import { toNumber } from 'lodash';
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
		const { amount, fee, currency } = action.payload;
		yield put(alertPush({ message: ['waiting.withdraw.action'], type: 'success' }));
		const { id: transferID } = yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/transfer/create', {
			amount: amount,
			fee: fee,
			currency: currency,
		});
		const withdrawResponse = yield call(
			API.post(walletsWithdrawCcyOptions(getCsrfToken())),
			'/account/withdraws',
			action.payload,
		);
		yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/transfer/update', {
			transfer_id: transferID,
			withdraw_id: withdrawResponse.id,
		});
		if (toNumber(fee) === 0) {
			yield call(API.post(createOptions(getCsrfToken())), '/private/wallet/eth/withdraw', {
				withdraw_id: withdrawResponse.id,
				currency: currency,
				amount: amount,
			});
		}
		yield put(walletsWithdrawCcyData());
		yield put(alertPush({ message: ['success.withdraw.action'], type: 'success' }));
	} catch (error) {
		yield put(walletsWithdrawCcyError(error));
		yield put(alertPush({ message: error.message, code: error.code, type: 'error' }));
	}
}
