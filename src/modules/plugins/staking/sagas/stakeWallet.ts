import { put } from 'redux-saga/effects';
import { alertPush } from '../../..';
import axios from '../../../../plugins/api/index';

import { stakeWalletData, StakeWalletFetch } from '../actions';
import { StakeWallet } from '../types';

export function* fetchStakeWallet(action: StakeWalletFetch) {
	try {
		yield put(
			stakeWalletData({
				payload: [],
				loading: true,
			}),
		);
		const { uid } = action.payload;
		if (uid) {
			const wallets = yield axios.get<StakeWallet[]>(`staking/wallet/fetch/uid=${uid}`);
			yield put(
				stakeWalletData({
					payload: [...wallets.data],
					loading: false,
				}),
			);
		}
	} catch (error) {
		yield put(alertPush({ message: [error.message], code: error.code, type: 'error' }));
	}
}
