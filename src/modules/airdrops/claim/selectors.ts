import { RootState } from '../../index';
import { ClaimState } from './types';

export const selectClaim = (state: RootState): ClaimState => state.airdrops.claims;
