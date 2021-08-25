import { CommonError } from 'modules/types';
import { RankingCompetition } from '.';
import { COMPETITION_RANKING_FETCH, COMPETITION_RANKING_DATA, COMPETITION_RANKING_ERROR } from './constants';

export interface FetchRankingCompetition {
	type: typeof COMPETITION_RANKING_FETCH;
	typeCompetition: 'stake' | 'trade';
	competition_id: number;
}

export interface GetDataRankingCompetition {
	type: typeof COMPETITION_RANKING_DATA;
	payload: RankingCompetition;
	loading: boolean;
}

export interface CatchErrorRankingCompetition {
	type: typeof COMPETITION_RANKING_ERROR;
	error: CommonError;
}

export type RankingCompetitionActions = FetchRankingCompetition | GetDataRankingCompetition | CatchErrorRankingCompetition;

export const fetchRankingCompetition = (
	typeCompetition: FetchRankingCompetition['typeCompetition'],
	competition_id: FetchRankingCompetition['competition_id'],
): FetchRankingCompetition => ({
	type: COMPETITION_RANKING_FETCH,
	typeCompetition,
	competition_id,
});
export const getDataRankingCompetition = (
	payload: GetDataRankingCompetition['payload'],
	loading: GetDataRankingCompetition['loading'],
) => ({
	type: COMPETITION_RANKING_DATA,
	payload,
	loading,
});

export const catchErrorRankingCompetition = (error: CatchErrorRankingCompetition['error']) => ({
	type: COMPETITION_RANKING_ERROR,
	error,
});
