import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import pluginsAPI from '../../../../plugins/api/index';

import { competitionItemData, competitionItemError, FindCompetitionById } from '../actions';

import { Competition } from '../types';

export function* findCompetitionByIdSaga(action: FindCompetitionById) {
	try {
		const competitionItem = yield pluginsAPI.get<Competition>(`competitions/fetch/competition_id=${action.payload.id}`);
		yield put(competitionItemData(competitionItem.data));
	} catch (error) {
		yield put(competitionItemError(error));
	}
}
