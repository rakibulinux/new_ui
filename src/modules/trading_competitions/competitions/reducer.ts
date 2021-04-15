// import { sliceArray } from '../../../../helpers';
import { CompetionsListActions } from './actions';
import {
    COMPETITION_LIST_DATA,
    COMPETITION_LIST_ERROR,
    COMPETITION_LIST_FETCH,
} from './constants';
import {
    CompetionListState,
} from './types';

export const initialCompetionsList: CompetionListState = {
    payload: {
        ongoing: [],
        upcoming: [],
        ended: []
    },
    loading: false,
};

export const competitionsListReducer = (state = initialCompetionsList, action: CompetionsListActions): CompetionListState => {
    switch (action.type) {
        case COMPETITION_LIST_FETCH:
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        case COMPETITION_LIST_DATA:
            const { payload } = action.payload;

            return {
                ...state,
                payload: payload,
                loading: false,
                error: undefined,
            };
        case COMPETITION_LIST_ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        default:
            return state;
    }
};
