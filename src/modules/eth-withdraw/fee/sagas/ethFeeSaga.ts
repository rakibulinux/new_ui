import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import axios from '../../../../plugins/api/index';

import { ethFeeData, ethFeeError, ETHFeeFetch } from '../actions';
import { ETHFeeState } from '../types';

export function* ethFeeSaga(action: ETHFeeFetch) {
	try {
		const ethFee = yield axios.get<ETHFeeState>('eth-withdraw/get/eth_fee');
		yield put(ethFeeData(ethFee.data.payload));
	} catch (error) {
		yield put(ethFeeError(error));
	}
}
