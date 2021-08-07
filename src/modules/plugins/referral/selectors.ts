import { RootState } from '../../index';

export const selectFriendsList = (state: RootState) => state.plugins.referral.friends.payload;
export const selectFriendsLoading = (state: RootState) => state.plugins.referral.friends.loading;

export const selectCommisionHistories = (state: RootState) => state.plugins.referral.history.payload;
export const selectCommisionHistoryLoading = (state: RootState) => state.plugins.referral.history.loading;

export const selectReferalRanksList = (state: RootState) => state.plugins.referral.ranks.payload;
export const selectReferalRanksLoading = (state: RootState) => state.plugins.referral.ranks.loading;
