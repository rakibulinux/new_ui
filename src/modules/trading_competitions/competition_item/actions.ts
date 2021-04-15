import { CommonError } from '../../../modules/types';
import {
    COMPETITION_ITEM_DATA,
    COMPETITION_ITEM_ERROR,
    COMPETITION_FIND_BY_ID
} from './constants';
import {
    CompetitionItemState,
} from './types';

export interface FindCompetitionById {
    type: typeof COMPETITION_FIND_BY_ID;
    payload: {
        id: number | string;
    }
}

export interface CompetitionItemData {
    type: typeof COMPETITION_ITEM_DATA;
    payload: CompetitionItemState;
}

export interface CompetitionItemError {
    type: typeof COMPETITION_ITEM_ERROR;
    error: CommonError;
}

export type CompetitionItemActions =
FindCompetitionById
    | CompetitionItemData
    | CompetitionItemError;

export const findCompetitionbyId = (payload: FindCompetitionById['payload']): FindCompetitionById => ({
    type: COMPETITION_FIND_BY_ID,
    payload
});

export const competitionItemData = (payload: CompetitionItemData['payload']): CompetitionItemData => ({
    type: COMPETITION_ITEM_DATA,
    payload,
});

export const competitionItemError = (error: CompetitionItemError['error']): CompetitionItemError => ({
    type: COMPETITION_ITEM_ERROR,
    error,
});
