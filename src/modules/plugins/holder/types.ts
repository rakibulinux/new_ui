export interface Holder {
	uid: string;
	amount: number;
}

export interface HolderListState {
	payload: Holder[];
	loading: boolean;
}
