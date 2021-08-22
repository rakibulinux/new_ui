import { NewCompetitionState } from './types';
import { COMPETITION_ITEM_DATA, COMPETITION_ITEM_ERROR, COMPETITION_ITEM_FETCH } from './constants';
import { CommonError } from 'modules/types';
export interface FetchCompetitionItem {
	type: typeof COMPETITION_ITEM_FETCH;
}

export interface CompetitionItemData {
	type: typeof COMPETITION_ITEM_DATA;
	payload: NewCompetitionState;
	loading: boolean;
}

export interface CompetitionItemError {
	type: typeof COMPETITION_ITEM_ERROR;
	error: CommonError;
}

export type CompetitionItemActions = FetchCompetitionItem | CompetitionItemData | CompetitionItemError;

export const fetchCompetitionItem = (payload: FetchCompetitionItem) => ({
	type: COMPETITION_ITEM_FETCH,
});

export const competitionItemData = (
	payload: CompetitionItemData['payload'],
	loading: CompetitionItemData['loading'],
): CompetitionItemData => ({
	payload,
	loading,
	type: COMPETITION_ITEM_DATA,
});

export const competitionItemError = (error: CompetitionItemError['error']): CompetitionItemError => ({
	type: COMPETITION_ITEM_ERROR,
	error,
});
