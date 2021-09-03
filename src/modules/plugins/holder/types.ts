export interface Holder {
	volume: number;
	rank: number;
}

export interface HolderListState {
	payload: Holder[];
	loading: boolean;
}
