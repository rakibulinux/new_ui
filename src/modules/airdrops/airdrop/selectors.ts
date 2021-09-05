import { RootState } from '../../index';
import { AirdropState } from './types';

export const selectAirdrop = (state: RootState): AirdropState => state.airdrops.airdrops;
