import { NewTabPanel } from 'components';
import { selectUserLoggedIn } from 'modules';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { useDepthFetch, useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../../hooks';
import { NewCurrentMarketInfo, NewOrders } from '../../components';

const HistoryOrder: React.FC = () => {
	const userLoggedIn = useSelector(selectUserLoggedIn);

	return userLoggedIn ? <NewOrders /> : null;
};

const TradingComponent: React.FC = () => {
	useMarketsFetch();
	useMarketsTickersFetch();
	useRangerConnectFetch();
	useDepthFetch();
	const [tabKeyActiveState, setTabkeyActiveState] = React.useState<string>('Normal');

	const TAB_LIST_INFO = [
		{
			label: 'Normal',
			content: tabKeyActiveState === 'Normal' ? <NewCurrentMarketInfo /> : null,
		},
		{
			label: 'Sport',
			content: tabKeyActiveState === 'Sport' ? <h1>Sport</h1> : null,
			disabled: true,
		},
	];

	const onChangeTabKey: TabsProps['onChange'] = key => {
		setTabkeyActiveState(key);
	};

	return (
		<div className="td-mobile-screen-trading">
			<div className="td-mobile-screen-trading__main-content">
				<NewTabPanel onChange={onChangeTabKey}>
					{TAB_LIST_INFO.map(tabInfo => (
						<TabPane key={tabInfo.label} tab={tabInfo.label} disabled={tabInfo.disabled}>
							{tabInfo.content}
						</TabPane>
					))}
				</NewTabPanel>
			</div>
			<div className="td-mobile-screen-trading__main-history">
				<HistoryOrder />
			</div>
		</div>
	);
};

export const NewTradingScreenMobile = React.memo(TradingComponent);
