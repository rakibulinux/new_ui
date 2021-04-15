import { CommonError } from '../../../modules/types';
import {
    COMPETITION_LIST_DATA,
    COMPETITION_LIST_ERROR,
    COMPETITION_LIST_FETCH,
} from './constants';
import {
    CompetionListState,
} from './types';

export interface CompetionListFetch {
    type: typeof COMPETITION_LIST_FETCH;
}

export interface CompetionListData {
    type: typeof COMPETITION_LIST_DATA;
    payload: CompetionListState;
}

export interface CompetionListError {
    type: typeof COMPETITION_LIST_ERROR;
    error: CommonError;
}

export type CompetionsListActions =
CompetionListFetch
    | CompetionListData
    | CompetionListError;

export const competionListFetch = (): CompetionListFetch => ({
    type: COMPETITION_LIST_FETCH,
});


export const competitionListData = (payload: CompetionListData['payload']): CompetionListData => ({
    type: COMPETITION_LIST_DATA,
    payload,
});

export const competitionListError = (error: CompetionListError['error']): CompetionListError => ({
    type: COMPETITION_LIST_ERROR,
    error,
});
