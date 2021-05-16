import { takeLatest } from 'redux-saga/effects';
import { CREATE_STAKE, STAKE_HISTORY_FETCH, STAKE_WALLET_FETCH, STAKING_LIST_FETCH } from '../constants';
import { createStakeSaga } from './createStake';
import { fetchStakeHistory } from './stakeHistory';
import { fetchStakeWallet } from './stakeWallet';
import { fetchStakingListSaga } from './stakingList';
export function* rootStakingSaga() {
	yield takeLatest(STAKING_LIST_FETCH, fetchStakingListSaga);
	yield takeLatest(CREATE_STAKE, createStakeSaga);
	yield takeLatest(STAKE_WALLET_FETCH, fetchStakeWallet);
	yield takeLatest(STAKE_HISTORY_FETCH, fetchStakeHistory);
}
