import classNames from 'classnames';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { PaginationMobile } from '../';
import { Decimal } from '../../../components';
import { Market, selectMarketTickers, setCurrentMarket, Ticker } from '../../../modules/public/markets';

export interface TableProps {
	/**
	 * Data which is used to render Table. The first element
	 * of array is used to render table head unless `noHead`
	 * is true. the rest is used to render Table body.
	 *
	 * All the elements of an array should have the same length.
	 */
	markets: Market[];
	/**
	 * List of headers for table
	 */
	headers?: string[];
}

const defaultTicker: Ticker = {
	amount: '0.0',
	last: '0.0',
	high: '0.0',
	open: '0.0',
	low: '0.0',
	price_change_percent: '+0.00%',
	volume: '0.0',
	avg_price: '0',
};

const TableComponent: React.FC<TableProps> = ({ headers, markets }) => {
	const [tablePagination, setTablePagination] = React.useState({
		current: 1,
		pageSize: 10,
		total: 0,
	});
	const [tableFilterPagination, setTableFilterPagination] = React.useState<Market[]>([]);
	const dispatch = useDispatch();
	const history = useHistory();
	const intl = useIntl();
	const tickers = useSelector(selectMarketTickers);

	React.useEffect(() => {
		if (markets) {
			actionFilterPage();
			setTablePagination(prev => ({
				...prev,
				total: markets.length,
			}));
		}
	}, [markets]);

	React.useEffect(() => {
		actionFilterPage();
	}, [tablePagination]);

	const actionFilterPage = () => {
		const start = tablePagination.pageSize * tablePagination.current - tablePagination.pageSize;
		setTableFilterPagination(markets.slice(start, start + tablePagination.pageSize));
	};

	const redirectToTrading = (paramMarket: Market) => {
		dispatch(setCurrentMarket(paramMarket));
		history.push(`/trading/${paramMarket.id}`);
	};

	const renderHead = (row: string[]) => {
		const cells = row.map((c, index) => <th key={index}>{c}</th>);

		return (
			<thead className={'cr-mobile-table__head'}>
				<tr className={'cr-mobile-table__head-row'}>{cells}</tr>
			</thead>
		);
	};

	const onClickPrevPage = () => {
		setTablePagination(prev => ({
			...prev,
			current: prev.current - 1,
		}));
	};
	const onClickNextPage = () => {
		setTablePagination(prev => ({
			...prev,
			current: prev.current + 1,
		}));
	};
	const onClickToPage = (value: number) => {
		setTablePagination(prev => ({
			...prev,
			current: value,
		}));
	};

	const renderFoot = () => {
		const { current, pageSize, total } = tablePagination;

		return (
			<PaginationMobile
				onClickToPage={onClickToPage}
				page={current}
				onClickNextPage={onClickNextPage}
				onClickPrevPage={onClickPrevPage}
				firstElemIndex={1}
				lastElemIndex={Math.ceil(total / pageSize)}
			/>
		);
	};

	const renderBody = () => {
		const rowElements = tableFilterPagination.map((market, i) => {
			const ticker = tickers[market.id] || defaultTicker;
			const marketTickerChange = +(+ticker.last - +ticker.open).toFixed(market.price_precision);
			const marketChangeClass = classNames('', {
				'change-positive': (+marketTickerChange || 0) >= 0,
				'change-negative': (+marketTickerChange || 0) < 0,
			});
			const marketChangeBtnClass = classNames('btn', {
				'btn-success': (+marketTickerChange || 0) >= 0,
				'btn-danger': (+marketTickerChange || 0) < 0,
			});

			return (
				<tr className="cr-mobile-table-info" key={i} onClick={() => redirectToTrading(market)}>
					<td className="cr-mobile-table-info__name">
						<div>
							<h6>{market.name.split('/')[0]}</h6> <span>/ {market.name.split('/')[1]}</span>
						</div>
						<span>
							{intl.formatMessage({ id: 'page.mobile.currentMarketInfo.volume' })}{' '}
							{Decimal.format(ticker.volume, 6, ',')}
						</span>
					</td>
					<td className="cr-mobile-table-info__current">
						<h6 className={marketChangeClass}>{Decimal.format(ticker.last, market.price_precision, ',')}</h6>
						<span>&asymp;{Decimal.format(ticker.last, 4, ',')}</span>
					</td>
					<td className="cr-mobile-table-info__change">
						<button className={marketChangeBtnClass}>{ticker.price_change_percent}</button>
					</td>
				</tr>
			);
		});

		return <tbody className={'cr-mobile-table__body'}>{rowElements}</tbody>;
	};

	return (
		<div className="cr-mobile-table-container">
			<table className="cr-mobile-table">
				{headers && headers.length && renderHead(headers)}
				{renderBody()}
			</table>
			<div className="cr-mobile-table__pagination">{renderFoot()}</div>
		</div>
	);
};

export const Table = React.memo(TableComponent);
