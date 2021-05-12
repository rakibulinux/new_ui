import { put } from 'redux-saga/effects';
// import { API, RequestOptions } from '../../../../../api';
import pluginsAPI from '../../../../plugins/api/index';
import { Competition } from '../../competition_item';

import { CompetionListFetch, competitionListData, competitionListError } from '../actions';

export function* competionsListFetchSaga(action: CompetionListFetch) {
	try {
		const competitionsList = yield pluginsAPI.get<Competition[]>('competitions/fetch/all');
		yield put(competitionListData(competitionsList.data));
	} catch (error) {
		yield put(competitionListError(error));
	}
}
