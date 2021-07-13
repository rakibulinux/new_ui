import classNames from 'classnames';
import { ConvertUsd, Decimal, mapValues } from 'components';
import { accumulateVolume, calcMaxVolume } from 'helpers';
import get from 'lodash/get';
import millify from 'millify';
import {
	selectCurrentMarket,
	selectCurrentPrice,
	selectDepthAsks,
	selectDepthBids,
	selectMarketTickers,
	setCurrentPrice,
} from 'modules';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

// tslint:disable-next-line: no-empty-interface
interface OrderBookProps {
	horizontal?: boolean;
}

const DEFAULT_TICKER = { amount: 0, low: 0, last: '0.00', high: 0, volume: 0, price_change_percent: '+0.00%' };

const OrderBookComponent: React.FC<OrderBookProps> = props => {
	const intl = useIntl();
	const dispatch = useDispatch();
	const currentMarket = useSelector(selectCurrentMarket);
	const bids = useSelector(selectDepthBids);
	const asks = useSelector(selectDepthAsks);
	const currentPrice = useSelector(selectCurrentPrice);
	const marketTickers = useSelector(selectMarketTickers);
	const renderOrderBook = (array: string[][], side: string, message: string): Array<[string, string]> => {
		let total = accumulateVolume(array);
		const priceFixed = currentMarket ? currentMarket.price_precision : 0;
		const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

		return array.length > 0
			? array.map((item, i) => {
					const [price] = item;

					switch (side) {
						case 'asks':
							total = accumulateVolume(array).slice(0).reverse();
							const volumnCustom =
								total[i] > 10000000
									? millify(total[i], {
											precision: 2,
									  })
									: Decimal.formatRemoveZero(total[i], amountFixed);

							return [Decimal.formatRemoveZero(price, priceFixed), volumnCustom];
						default:
							const volumnCustomBid =
								total[i] > 10000000
									? millify(total[i], {
											precision: 2,
									  })
									: Decimal.formatRemoveZero(total[i], amountFixed);

							return [Decimal.formatRemoveZero(price, priceFixed), volumnCustomBid];
					}
			  })
			: [[message, '']];
	};

	const renderHeader = (): [string, string] => {
		const formattedBaseUnit = currentMarket && currentMarket.base_unit ? `(${currentMarket.base_unit.toUpperCase()})` : '';
		const formattedQuoteUnit = currentMarket && currentMarket.quote_unit ? `(${currentMarket.quote_unit.toUpperCase()})` : '';

		return [
			`${intl.formatMessage({ id: 'page.body.trade.orderbook.header.price' })}\n${formattedQuoteUnit}`,
			`${intl.formatMessage({ id: 'page.body.trade.orderbook.header.amount' })}\n${formattedBaseUnit}`,
		];
	};

	const handleOnSelectBids = (index: string) => {
		const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
		if (currentPrice !== priceToSet) {
			dispatch(setCurrentPrice(priceToSet));
		}
	};

	const handleOnSelectAsks = (index: string) => {
		const asksData = props.horizontal ? asks : asks.slice(0).reverse();
		const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);
		if (currentPrice !== priceToSet) {
			dispatch(setCurrentPrice(priceToSet));
		}
	};

	const getTickerValue = (value: string) => {
		return currentMarket && (marketTickers[currentMarket.id] || DEFAULT_TICKER)[value];
	};

	const header = renderHeader();
	const dataAsks = React.useMemo(() => {
		const data = renderOrderBook(asks.slice(0).reverse(), 'asks', intl.formatMessage({ id: 'page.noDataToShow' }));

		return props.horizontal ? data.slice(0).reverse() : data;
	}, [asks, props.horizontal]);
	const dataBids = React.useMemo(() => renderOrderBook(bids, 'bids', intl.formatMessage({ id: 'page.noDataToShow' })), [bids]);
	const maxVolume = calcMaxVolume(bids, asks);
	const orderBookEntryAsks = accumulateVolume(asks);
	const orderBookEntryBids = accumulateVolume(bids);
	const bgDataAsks = props.horizontal
		? mapValues(maxVolume, orderBookEntryAsks)
		: mapValues(maxVolume, orderBookEntryAsks).slice(0).reverse();
	const bgDataBids = mapValues(maxVolume, orderBookEntryBids);

	const getRowWidth = (side: 'bid' | 'ask', index: number) => {
		const resultData = side === 'bid' ? bgDataBids : bgDataAsks;

		if (resultData && resultData.length) {
			return {
				width: `${resultData[index].value}%`,
			};
		}

		return {
			display: 'none',
		};
	};

	const headerElm = (num: number) => (
		<div
			className={classNames('td-mobile-cpn-order-book__header', {
				[`td-mobile-cpn-order-book__header--grid-item-${num}`]: props.horizontal,
			})}
		>
			<div className="td-mobile-cpn-order-book__header__item">{header[0]}</div>
			<div className="td-mobile-cpn-order-book__header__item text-right">{header[1]}</div>
		</div>
	);

	return (
		<div
			className={classNames('td-mobile-cpn-order-book', {
				'td-mobile-cpn-order-book--horizontal': props.horizontal,
			})}
		>
			{headerElm(1)}
			<div
				className={classNames('td-mobile-cpn-order-book__combined', {
					'td-mobile-cpn-order-book__combined--reverse': !props.horizontal,
					'td-mobile-cpn-order-book__combined--grid-item-1': props.horizontal,
				})}
			>
				<table>
					<tbody>
						{dataAsks.map((data, i) => (
							<tr key={i} onClick={() => handleOnSelectAsks(i.toString())}>
								{data.map((elm, j) => {
									const classnames = classNames({
										'td-mobile-cpn-order-book__combined--ask-color': data[1] && j === 0,
									});

									return (
										<td key={j} className={classnames}>
											{j === 0 && (
												<div
													className="td-mobile-cpn-order-book__combined--bg-ask-row"
													style={getRowWidth('ask', i)}
												></div>
											)}
											{elm}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="td-mobile-cpn-order-book__market">
				<span className="td-mobile-cpn-order-book__market__last-price">
					{Decimal.formatRemoveZero(getTickerValue('last'), get(currentMarket, 'price_precision', 6))}
				</span>
				<span className="td-mobile-cpn-order-book__market__convert-usd">
					≈ $ <ConvertUsd value={Number(getTickerValue('last'))} symbol={get(currentMarket, 'quote_unit', '')} />
				</span>
			</div>
			{props.horizontal && headerElm(2)}
			<div
				className={classNames('td-mobile-cpn-order-book__combined', {
					'td-mobile-cpn-order-book__combined--grid-item-2': props.horizontal,
				})}
			>
				<table>
					<tbody>
						{dataBids.map((data, i) => (
							<tr key={i} onClick={() => handleOnSelectBids(i.toString())}>
								{data.map((elm, j) => {
									const classnames = classNames({
										'td-mobile-cpn-order-book__combined--bid-color': data[1] && j === 0,
									});

									return (
										<td key={j} className={classnames}>
											{j === 0 && (
												<div
													className="td-mobile-cpn-order-book__combined--bg-bid-row"
													style={getRowWidth('bid', i)}
												></div>
											)}
											{elm}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export const NewOrderBook = React.memo(OrderBookComponent, isEqual);