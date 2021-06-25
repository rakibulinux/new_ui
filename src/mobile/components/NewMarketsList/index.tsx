import { Market } from 'modules';
import React from 'react';
import { RowTable } from './RowTable';

interface ListMarket {
	listMarket: Market[];
	childOfTBody?: React.ReactNode;
	childOfTHead?: React.ReactNode;
	isShowTHead: Boolean;
}

export const MarketList: React.FC<ListMarket> = ({ listMarket, childOfTHead, childOfTBody, isShowTHead }) => {
	const renderRowTable = () => {
		return listMarket.map((e, index) => <RowTable key={index} market={e} />);
	};

	return (
		<div className="td-mobile-cpn-market-list">
			<table>
				{isShowTHead ? <thead>{childOfTHead}</thead> : ''}

				<tbody className="td-mobile-cpn-market-list__body__markets">
					{childOfTBody}
					{renderRowTable()}
				</tbody>
			</table>
		</div>
	);
};
