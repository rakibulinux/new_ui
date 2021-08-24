import { NewCompetition } from './types';
import { COMPETITION_ITEM_DATA, COMPETITION_ITEM_ERROR, COMPETITION_ITEM_FETCH } from './constants';
import { CommonError } from 'modules/types';
export interface FetchCompetitionItem {
	type: typeof COMPETITION_ITEM_FETCH;
	id: number;
}

export interface DataCompetitionItem {
	type: typeof COMPETITION_ITEM_DATA;
	payload: NewCompetition;
	loading: boolean;
}

export interface ErrorCompetitionItem {
	type: typeof COMPETITION_ITEM_ERROR;
	error: CommonError;
}

export type ItemCompetitionActions = FetchCompetitionItem | DataCompetitionItem | ErrorCompetitionItem;

export const fetchCompetitionItem = (id: FetchCompetitionItem['id']) => ({
	type: COMPETITION_ITEM_FETCH,
	id,
});

export const dataCompetitionItem = (
	payload: DataCompetitionItem['payload'],
	loading: DataCompetitionItem['loading'],
): DataCompetitionItem => ({
	payload,
	loading,
	type: COMPETITION_ITEM_DATA,
});

export const errorCompetitionItem = (error: ErrorCompetitionItem['error']): ErrorCompetitionItem => ({
	type: COMPETITION_ITEM_ERROR,
	error,
});
