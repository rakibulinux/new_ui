import React from 'react';
import { useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../../hooks';
import { NewMarkets } from './../../components';

const NewMarketsComponent = () => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();

	return <NewMarkets />;
};

export const NewMarketsScreenMobile = React.memo(NewMarketsComponent);
