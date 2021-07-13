import { NewTabPanel } from 'components';
import { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { useDepthFetch, useMarketsFetch, useMarketsTickersFetch, useRangerConnectFetch } from '../../../hooks';
import { NewCurrentMarketInfo } from '../../components';

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
		</div>
	);
};

export const NewTradingScreenMobile = React.memo(TradingComponent);
