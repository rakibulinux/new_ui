import { RootState } from '../../index';
import { StakingListState, StakeWalletState, StakeHistoryState } from './types';

export const selectCreateStakeLoading = (state: RootState): boolean => state.plugins.create_stake.loading;

export const selectStakingList = (state: RootState): StakingListState['payload'] => state.plugins.staking_list.payload;
export const selectStakingListLoading = (state: RootState): boolean => state.plugins.staking_list.loading;

export const selectStakeWallet = (state: RootState): StakeWalletState['payload'] => state.plugins.stake_wallet.payload;
export const selectStakeWalletLoading = (state: RootState): boolean => state.plugins.stake_wallet.loading;

export const selectStakeHistories = (state: RootState): StakeHistoryState['payload'] => state.plugins.stake_history.payload;
export const selectStakeHistoriesLoading = (state: RootState): boolean => state.plugins.stake_history.loading;
