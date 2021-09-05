import { RootState } from '../../../index';
import { CompetitionVolumeState } from './types';

export const selectVolumeCompetition = (state: RootState): CompetitionVolumeState => state.competitions.competitionVolume;
