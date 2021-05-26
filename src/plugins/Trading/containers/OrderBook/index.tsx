import get from 'lodash/get';
import * as React from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Decimal } from '../../../../components';
import { useOrderBookFetch } from '../../../../hooks';
import {
	Market,
	selectCurrentMarket,
	selectCurrentPrice,
	selectDepthAsks,
	selectDepthBids,
	selectMarketTickers,
	setCurrentPrice,
	Ticker,
} from '../../../../modules';
import downSvg from '../../assets/down.svg';
import upSvg from '../../assets/up.svg';
import { OrderBookBuySvg, OrderBookSellSvg, OrderBookSvg } from '../../components/Icon/OrderBookSvg';
import { OrderBookTableRow } from './OrderBookTableRow';
import { OrderBookStyle, TrStyle } from './styles';

const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

export const OrderBookContainer = props => {
	useOrderBookFetch();
	const { formatMessage } = useIntl();
	const dispatch = useDispatch();
	const [tabState, setTabState] = React.useState<'all' | 'buy' | 'sell'>('all');
	const [width, setWidth] = React.useState(0);
	const orderRef = React.useRef<HTMLDivElement>(null);

	const bids = useSelector(selectDepthBids);
	const asks = useSelector(selectDepthAsks);
	const currentMarket = useSelector(selectCurrentMarket, isEqual);
	const currentPrice = useSelector(selectCurrentPrice, isEqual);
	const marketTickers = useSelector(selectMarketTickers, isEqual);

	const getTickerValue = React.useCallback((cMarket: Market, tickers: { [key: string]: Ticker }) => {
		return tickers[cMarket.id] || defaultTicker;
	}, []);

	// eslint-disable-next-line
	React.useEffect(() => {
		const { current } = orderRef;
		if (current && current.clientWidth !== width) {
			setWidth(current.clientWidth);
		}
	});

	const currentTicker = currentMarket && getTickerValue(currentMarket, marketTickers);
	const quoteUnit = get(currentMarket, 'quote_unit', '').toUpperCase();
	const baseUnit = get(currentMarket, 'base_unit', '').toUpperCase();

	const renderOrderBook = React.useCallback((array: string[][], side: string, currentM?: Market) => {
		// tslint:disable-next-line: no-shadowed-variable
		const maxVolume = Math.max(...array.map(a => Number(a[1])));
		const priceFixed = currentM ? currentM.price_precision : 0;
		const amountFixed = currentM ? currentM.amount_precision : 0;

		return array.map((item, i) => {
			const [price, volume] = item;

			return [
				<OrderBookTableRow
					type="price"
					prevValue={array[i - 1] ? array[i - 1][0] : 0}
					price={price}
					fixed={priceFixed}
				/>,
				<OrderBookTableRow total={volume} fixed={amountFixed} />,
				<OrderBookTableRow total={+price * +volume} fixed={priceFixed} />,
				Number((Number(volume) / (maxVolume / 100)).toFixed(2)),
			];
		});
	}, []);

	const handleOnSelectBids = React.useCallback(
		(index: string) => {
			const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
			if (currentPrice !== priceToSet) {
				dispatch(setCurrentPrice(priceToSet));
			}
		},
		[bids, currentPrice, dispatch],
	);

	const handleOnSelectAsks = React.useCallback(
		(index: string) => {
			const priceToSet = asks[Number(index)] && Number(asks[Number(index)][0]);
			if (currentPrice !== priceToSet) {
				dispatch(setCurrentPrice(priceToSet));
			}
		},
		[currentPrice, dispatch, asks],
	);

	const arrAsksElm = renderOrderBook(asks, 'asks', currentMarket);
	const arrBidsElm = renderOrderBook(bids, 'bids', currentMarket);
	const noDataElm = (
		<tr>
			<td className="td-order-book-table__empty_data text-center" style={{ width: '100%' }}>
				{formatMessage({ id: 'page.noDataToShow' })}
			</td>
		</tr>
	);

	const infoTabs: Array<{
		labelTooltip: string;
		key: typeof tabState;
		render: () => JSX.Element;
	}> = [
		{
			labelTooltip: 'Order Book',
			key: 'all',
			render: () => (
				<OrderBookSvg
					active={tabState === 'all'}
					className="mr-2"
					onClick={() => {
						setTabState('all');
					}}
				/>
			),
		},
		{
			labelTooltip: 'Buy',
			key: 'buy',
			render: () => (
				<OrderBookBuySvg
					active={tabState === 'buy'}
					className="mr-2"
					onClick={() => {
						setTabState('buy');
					}}
				/>
			),
		},
		{
			labelTooltip: 'Sell',
			key: 'sell',
			render: () => (
				<OrderBookSellSvg
					active={tabState === 'sell'}
					className="mr-2"
					onClick={() => {
						setTabState('sell');
					}}
				/>
			),
		},
	];

	const elementTabs = infoTabs.map(({ key, labelTooltip, render }) => (
		<OverlayTrigger
			key={key}
			placement="bottom"
			overlay={
				<Tooltip className="td-order-book-tooltip" id="td-order-book-header-all">
					{labelTooltip}
				</Tooltip>
			}
		>
			{render()}
		</OverlayTrigger>
	));

	const isPositive =
		currentMarket && /\+/.test(currentMarket && (marketTickers[currentMarket.id] || defaultTicker).price_change_percent);
	const cls = isPositive ? 'positive' : 'negative';

	return (
		<OrderBookStyle tabState={tabState}>
			<Row className="h-100">
				<Col className="h-100 td-order-book-wrapper p-0" xs={12}>
					<div className="td-order-book">
						<Row className="td-order-book-header">
							<Col className="p-0 d-flex align-items-center">{elementTabs}</Col>
							<Col className="p-0 d-flex align-items-center"></Col>
						</Row>
						<Row className="td-order-book-tbheader">
							<Col className="p-0">
								{`${formatMessage({ id: 'page.body.trading.header.orderBook.header.title.price' })}${
									currentMarket ? `(${quoteUnit})` : ''
								}`}
							</Col>
							<Col className="p-0 text-right">
								{`${formatMessage({ id: 'page.body.trading.header.orderBook.header.title.amount' })}${
									currentMarket ? `(${baseUnit})` : ''
								}`}
							</Col>
							<Col className="p-0 text-right">
								{`${formatMessage({ id: 'page.body.trading.header.orderBook.header.title.sum' })}${
									currentMarket ? `(${quoteUnit})` : ''
								}`}
							</Col>
						</Row>
						{tabState === 'all' || tabState === 'sell' ? (
							<table className="td-order-book-table td-reverse-table-body">
								<tbody>
									{arrAsksElm.length > 0
										? arrAsksElm.map((item, i) => (
												<TrStyle
													color="rgba(224,30,90,0.2)"
													placement="left"
													percentWidth={(item[3] as number) || 0}
													key={i}
													onClick={() => handleOnSelectAsks(i.toString())}
												>
													<td className="td-order-book-item__negative">{item[0]}</td>
													<td>{item[1]}</td>
													<td>{item[2]}</td>
												</TrStyle>
										  ))
										: noDataElm}
								</tbody>
							</table>
						) : null}
						<Row className="td-order-book-ticker">
							<Col
								className={`p-0  td-order-book-ticker__last-price d-flex align-items-center justify-content-center td-order-book-item__${cls}`}
							>
								{cls === 'positive' ? <img src={upSvg} /> : <img src={downSvg} />}
								{Decimal.format(+get(currentTicker, 'last', 0), get(currentMarket, 'price_precision', 0))}
								{` ${quoteUnit}`}
							</Col>
						</Row>
						{tabState === 'all' || tabState === 'buy' ? (
							<table className="td-order-book-table">
								<tbody>
									{arrBidsElm.length > 0
										? arrBidsElm.map((item, i) => (
												<TrStyle
													color="rgba(47,182,126,0.4)"
													placement="right"
													percentWidth={(item[3] as number) || 0}
													key={i}
													onClick={() => handleOnSelectBids(i.toString())}
												>
													<td className="td-order-book-item__positive">{item[0]}</td>
													<td>{item[1]}</td>
													<td>{item[2]}</td>
												</TrStyle>
										  ))
										: noDataElm}
								</tbody>
							</table>
						) : null}
					</div>
				</Col>
			</Row>
		</OrderBookStyle>
	);
};

export const OrderBook = OrderBookContainer;
