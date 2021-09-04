export interface Holder {
	uid: string;
	amount: number;
}

export interface HolderListState {
	payload: [number, Holder[]];
	loading: boolean;
}

export interface Holder {
	uid: string;
	amount: number;
}

export interface HolderInfoState {
	payload: Holder | null;
	loading: boolean;
}
