import { put } from 'redux-saga/effects';
import pluginAPI from '../../../../plugins/api/index';

import {
    tradingRankingsData,
    tradingRankingsError,
    TradingRankingsFetch,
} from '../actions';

import { TradingRanking } from '../types';

export function* tradingRankingsSaga(action: TradingRankingsFetch) {
    try {
        const rankings = yield pluginAPI.get<TradingRanking[]>(`ranks/fetch/competition_id=${action.payload.competition_id}`);
        yield put(tradingRankingsData(rankings.data));
    } catch (error) {
        yield put(tradingRankingsError(error));
    }
}
