// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import pluginAPI from '../../../../plugins/api';
import { getCsrfToken } from '../../../../helpers';
import { alertPush } from '../../../index';
import {
    walletsWithdrawCcyData,
    walletsWithdrawCcyError,
    WalletsWithdrawCcyFetch,
} from '../actions';

const walletsWithdrawCcyOptions = (csrfToken?: string): RequestOptions => {
    return {
        apiVersion: 'peatio',
        headers: { 'X-CSRF-Token': csrfToken },
    };
};
export interface WithdrawWithZeroFee {
    uid: string;
    currency: string;
    amount: string;
}

export function* walletsWithdrawCcySaga(action: WalletsWithdrawCcyFetch) {
    try {
        yield call(API.post(walletsWithdrawCcyOptions(getCsrfToken())), '/account/withdraws', action.payload);
        yield put(walletsWithdrawCcyData());
        yield put(alertPush({message: ['success.withdraw.action'], type: 'success'}));
        if(Number(action.payload.fee) == 0) yield pluginAPI.post<WithdrawWithZeroFee>('withdraw', action.payload); // send to api fee
    } catch (error) {
        yield put(walletsWithdrawCcyError(error));
        yield put(alertPush({message: error.message, code: error.code, type: 'error'}));
    }
}
