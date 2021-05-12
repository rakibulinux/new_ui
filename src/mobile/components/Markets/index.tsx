import * as React from 'react';
import { useSelector } from 'react-redux';
import { Table } from '../';
import { TabPanel } from '../../../components';
import { Market, selectMarkets } from '../../../modules/public/markets';

export interface MarketsProps {
	/**
	 * List of headers for table
	 */
	headers?: string[];
}

const MarketsComponent: React.FC<MarketsProps> = ({ headers }) => {
	const markets = useSelector(selectMarkets);

	const [currentTabIndex, setCurrentTabIndex] = React.useState(0);
	const [currentMarketsFilter, setCurrentMarketsFilter] = React.useState<Market[]>(markets);

	let currentBidUnitsList: string[] = [''];

	React.useEffect(() => {
		const marketsFilter =
			currentTabIndex === 0
				? markets
				: markets.filter(market => market.quote_unit === currentBidUnitsList[currentTabIndex]);
		setCurrentMarketsFilter(marketsFilter);
	}, [currentTabIndex, markets]);

	const defaultHeader = ['Name', 'Current', 'Chg'];

	const formatFilteredMarkets = (list: string[], market: Market) => {
		if (!list.includes(market.quote_unit)) {
			list.push(market.quote_unit);
		}

		return list;
	};

	if (markets.length > 0) {
		currentBidUnitsList = markets.reduce(formatFilteredMarkets, currentBidUnitsList);
	}

	const renderTabs = () =>
		currentBidUnitsList.map((name, i) => ({
			content: currentTabIndex === i ? renderTab() : null,
			label: name ? name.toUpperCase() : 'ALL',
		}));

	const renderTab = () => {
		return <Table headers={headers ? headers : defaultHeader} markets={currentMarketsFilter} />;
	};

	return (
		<div className="cr-mobile-market">
			{markets ? (
				<TabPanel panels={renderTabs()} currentTabIndex={currentTabIndex} onCurrentTabChange={setCurrentTabIndex} />
			) : null}
		</div>
	);
};

export const Markets = React.memo(MarketsComponent);
