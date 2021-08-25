import { RootState } from '../../../index';
import { CompetitionAwardState } from './types';

export const selectCompetitionAward = (state: RootState): CompetitionAwardState => state.competitions.competitionAward;
