import { RootState } from '../../index';
import { LunarsState } from './types';

export const selectLunarAwards = (state: RootState): LunarsState['awards'] => state.events.lunar.awards;
export const selectLunarLots = (state: RootState): LunarsState['lots'] => state.events.lunar.lots;
