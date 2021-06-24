/* tslint:disable */
import { useConvertToUSD } from 'hooks';
import get from 'lodash/get';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Order, OrderProps, WalletItemProps } from '../../components';
import { createOrderConfig } from '../../constants';
import {
	alertPush,
	selectCurrentPrice,
	selectDepthAsks,
	selectDepthBids,
	selectUserLoggedIn,
	selectWallets,
	setCurrentPrice,
	Wallet,
	walletsFetch,
} from '../../modules';
import { selectCurrentMarket, selectMarketTickers } from '../../modules/public/markets';
import { orderExecuteFetch, selectOrderExecuteLoading } from '../../modules/user/orders';
interface OrderComponentProps {
	defaultTabIndex?: number;
}

export const OrderComponent: React.FC<OrderComponentProps> = props => {
	const dispatch = useDispatch();
	const intl = useIntl();

	const bids = useSelector(selectDepthBids);
	const asks = useSelector(selectDepthAsks);
	const currentMarket = useSelector(selectCurrentMarket);
	const executeLoading = useSelector(selectOrderExecuteLoading);
	const marketTickers = useSelector(selectMarketTickers);
	const wallets = useSelector(selectWallets);
	const currentPrice = useSelector(selectCurrentPrice);
	const userLoggedIn = useSelector(selectUserLoggedIn);

	const setOrderSide = React.useState('buy')[1];
	const [priceLimit, setPriceLimit] = React.useState<number | undefined>(undefined);
	const [width, setWidth] = React.useState(0);
	const orderRef = React.useRef<HTMLDivElement | null>(null);

	const exchangeRate = useConvertToUSD(1, get(currentMarket, 'quote_unit'))[1];

	React.useEffect(() => {
		if (!wallets.length) {
			dispatch(walletsFetch());
		}
	}, []);

	React.useEffect(() => {
		if (orderRef.current && width !== orderRef.current.clientWidth) {
			setWidth(orderRef.current.clientWidth);
		}
	}, [orderRef.current, width]);

	React.useEffect(() => {
		if (userLoggedIn && !wallets.length) {
			dispatch(walletsFetch());
		}
	}, [userLoggedIn, wallets.length]);

	React.useEffect(() => {
		if (currentPrice && currentPrice !== priceLimit) {
			setPriceLimit(currentPrice);
		}
	}, [currentPrice]);

	const getListOfTranslations = () => {
		return {
			labelFirst: intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.buy' }),
			labelSecond: intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.tabs.sell' }),
		};
	};

	const handleSubmit = (value: OrderProps) => {
		if (!currentMarket) {
			return;
		}

		const { amount, available, orderType, price, type } = value;

		dispatch(setCurrentPrice(0));

		const resultData = {
			market: currentMarket.id,
			side: type,
			volume: amount.toString(),
			ord_type: (orderType as string).toLowerCase(),
		};

		const order = orderType === 'Limit' ? { ...resultData, price: price.toString() } : resultData;
		let orderAllowed = true;

		//custom check
		if (createOrderConfig.status) {
			if (+amount * +price * exchangeRate < 10) {
				dispatch(
					alertPush({
						message: [
							intl.formatMessage(
								{ id: 'error.order.create.minTotal' },
								// tslint:disable-next-line: radix
								{
									total: createOrderConfig.minimumTotal,
									totalUsd: parseInt(`${+amount * +price * exchangeRate || 0}`),
								},
							),
						],
						type: 'error',
					}),
				);

				orderAllowed = false;
			}
		}

		if (+resultData.volume < +currentMarket.min_amount) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minAmount' },
							{ amount: currentMarket.min_amount, currency: currentMarket.base_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+price < +currentMarket.min_price) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.minPrice' },
							{ price: currentMarket.min_price, currency: currentMarket.quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (+currentMarket.max_price && +price > +currentMarket.max_price) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.maxPrice' },
							{ price: currentMarket.max_price, currency: currentMarket.quote_unit.toUpperCase() },
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if ((+available < +amount * +price && order.side === 'buy') || (+available < +amount && order.side === 'sell')) {
			dispatch(
				alertPush({
					message: [
						intl.formatMessage(
							{ id: 'error.order.create.available' },
							{
								available: available,
								currency:
									order.side === 'buy'
										? currentMarket.quote_unit.toUpperCase()
										: currentMarket.base_unit.toUpperCase(),
							},
						),
					],
					type: 'error',
				}),
			);

			orderAllowed = false;
		}

		if (orderAllowed) {
			dispatch(orderExecuteFetch(order));
		}
	};

	const getWallet = (currency: string, wallets: WalletItemProps[]) => {
		const currencyLower = currency.toLowerCase();

		return wallets.find(w => w.currency === currencyLower) as Wallet;
	};

	const getOrderType = (index: number, label: string) => {
		setOrderSide(label.toLowerCase());
	};

	const getAvailableValue = (wallet: Wallet | undefined) => {
		return wallet && wallet.balance ? Number(wallet.balance) : 0;
	};

	const listenInputPrice = () => {
		setPriceLimit(undefined);
		dispatch(setCurrentPrice(0));
	};

	const { defaultTabIndex } = props;
	if (!currentMarket) {
		return null;
	}

	const walletBase = getWallet(currentMarket.base_unit, wallets);
	const walletQuote = getWallet(currentMarket.quote_unit, wallets);

	const currentTicker = marketTickers[currentMarket.id];
	const defaultCurrentTicker = { last: '0' };
	const headerContent = (
		<div className="cr-table-header__content">
			<div className="cr-title-component">
				<FormattedMessage id="page.body.trade.header.newOrder" />
			</div>
		</div>
	);

	const translations = getListOfTranslations();
	return (
		<div className={'pg-order'} ref={ref => (orderRef.current = ref)}>
			{width > 448 ? headerContent : undefined}
			<Order
				asks={asks}
				bids={bids}
				disabled={executeLoading}
				from={currentMarket.quote_unit}
				availableBase={getAvailableValue(walletBase)}
				availableQuote={getAvailableValue(walletQuote)}
				onSubmit={handleSubmit}
				priceMarketBuy={Number((currentTicker || defaultCurrentTicker).last)}
				priceMarketSell={Number((currentTicker || defaultCurrentTicker).last)}
				priceLimit={priceLimit}
				to={currentMarket.base_unit}
				handleSendType={getOrderType}
				currentMarketAskPrecision={currentMarket.amount_precision}
				currentMarketBidPrecision={currentMarket.price_precision}
				width={width}
				listenInputPrice={listenInputPrice}
				defaultTabIndex={defaultTabIndex}
				{...translations}
			/>
			{executeLoading && (
				<div className="pg-order--loading">
					<Spinner animation="border" variant="primary" />
				</div>
			)}
		</div>
	);
};
