import { RootState } from '../../../index';
import { NewCompetitionState } from './types';

export const selectItemCompetition = (state: RootState): NewCompetitionState => state.competitions.competitionItem;
