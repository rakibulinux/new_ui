import * as React from 'react';
import { UDON } from './UDON';

interface SaleDetailProps {
	ieoID: number;
}

export const SaleDetail: React.FC<SaleDetailProps> = (props: SaleDetailProps) => {
	let saleDetail;

	switch (props.ieoID) {
		case 1:
			saleDetail = <UDON />;
			break;

		default:
			break;
	}

	return <div>{saleDetail}</div>;
};
