import { Market } from 'modules';
import React from 'react';
import { RowTable } from './RowTable';

interface ListMarket {
	listMarket: Market[];
	child?: React.ReactNode;
}

export const MarketList: React.FC<ListMarket> = ({ listMarket, child }) => {
	const renderRowTable = () => {
		return listMarket.map((e, index) => <RowTable key={index} market={e} />);
	};

	return (
		<tbody className="td-mobile-new-market__body__markets">
			{child}
			{renderRowTable()}
		</tbody>
	);
};
