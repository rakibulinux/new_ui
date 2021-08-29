import { CommonError } from 'modules/types';
import { COMPETITION_VOLUME_DATA, COMPETITION_VOLUME_ERROR, COMPETITION_VOLUME_FETCH } from './constants';
import { CompetitionVolume } from './types';

export interface FetchCompetitionVolume {
	type: typeof COMPETITION_VOLUME_FETCH;
	id: number;
}

export interface GetDataCompetitionVolume {
	type: typeof COMPETITION_VOLUME_DATA;
	payload: CompetitionVolume;
	loading: boolean;
}

export interface CatchErrorCompetitionVolume {
	type: typeof COMPETITION_VOLUME_ERROR;
	error: CommonError;
}

export type CompetitionVolumeActions = FetchCompetitionVolume | GetDataCompetitionVolume | CatchErrorCompetitionVolume;

export const fetchCompetitionVolume = (id: FetchCompetitionVolume['id']): FetchCompetitionVolume => ({
	type: COMPETITION_VOLUME_FETCH,
	id,
});

export const getDataCompetitionVolume = (
	payload: GetDataCompetitionVolume['payload'],
	loading: GetDataCompetitionVolume['loading'],
): GetDataCompetitionVolume => ({
	type: COMPETITION_VOLUME_DATA,
	loading,
	payload,
});
export const catchErrorCompetitionVolume = (error: CatchErrorCompetitionVolume['error']): CatchErrorCompetitionVolume => ({
	type: COMPETITION_VOLUME_ERROR,
	error,
});
