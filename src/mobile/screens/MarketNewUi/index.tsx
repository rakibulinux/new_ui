import React from 'react';
import { NewUiMarket } from '../../components';

const MarketNewUiComponent = () => {
	return (
		<div>
			<NewUiMarket />
		</div>
	);
};

export const MarketNewUi = React.memo(MarketNewUiComponent);
