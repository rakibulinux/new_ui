import { RootState } from '../../index';
import { CompetionListState } from './types';

export const selectCompetionsList = (state: RootState): CompetionListState => state.trading_competitions.competitions;
