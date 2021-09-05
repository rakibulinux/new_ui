import { takeEvery, takeLatest, takeLeading } from 'redux-saga/effects';
import {
	ALL_CHILD_CURRENCIES_FETCH,
	WALLETS_ADDRESS_FETCH,
	WALLETS_CHILD_CURRENCIES_FETCH,
	WALLETS_FETCH,
	WALLETS_WITHDRAW_CCY_FETCH,
} from '../constants';
import { allChildCurrenciesSaga, childCurrenciesSaga } from './childCurrenciesSaga';
import { walletsAddressSaga } from './walletsAddressSaga';
import { walletsSaga } from './walletsSaga';
import { walletsWithdrawCcySaga } from './walletsWithdrawSaga';

export function* rootWalletsSaga() {
	yield takeLeading(WALLETS_FETCH, walletsSaga);
	yield takeLatest(WALLETS_ADDRESS_FETCH, walletsAddressSaga);
	yield takeEvery(WALLETS_WITHDRAW_CCY_FETCH, walletsWithdrawCcySaga);
	yield takeLatest(WALLETS_CHILD_CURRENCIES_FETCH, childCurrenciesSaga);
	yield takeLatest(ALL_CHILD_CURRENCIES_FETCH, allChildCurrenciesSaga);
}
