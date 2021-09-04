import { HolderInfoState } from '.';
import { RootState } from '../../index';
import { HolderListState } from './types';

export const selectHolderListData = (state: RootState): HolderListState['payload'] => state.plugins.holder.list.payload;
export const selectHolderListLoading = (state: RootState): boolean => state.plugins.holder.list.loading;
export const selectHolderInfoData = (state: RootState): HolderInfoState['payload'] => state.plugins.holder.info.payload;
export const selectHolderInfoLoading = (state: RootState): boolean => state.plugins.holder.info.loading;
