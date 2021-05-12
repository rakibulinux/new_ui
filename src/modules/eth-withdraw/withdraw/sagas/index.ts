import { takeLatest } from 'redux-saga/effects';
import { ETH_FEE_WITHDRAW } from '../constants';
import { withdrawByEthFee } from './withdrawEthFee';

export function* rootETHFeeWithdrawSaga() {
	yield takeLatest(ETH_FEE_WITHDRAW, withdrawByEthFee);
}
