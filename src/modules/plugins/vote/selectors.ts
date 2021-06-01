import { RootState } from '../../index';

export const selectVoteLoading = (state: RootState) => state.plugins.voteList.loading;
export const selectVoteListInfo = (state: RootState) => state.plugins.voteList.info;
