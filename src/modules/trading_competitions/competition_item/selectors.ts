import { RootState } from '../../index';
import { CompetitionItemState } from './types';

export const selectCompetitionItem = (state: RootState): CompetitionItemState => state.trading_competitions.competition_item;
