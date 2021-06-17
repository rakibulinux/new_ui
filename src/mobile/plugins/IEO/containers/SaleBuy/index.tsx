import { Button, Input, message, notification } from 'antd';
import NP from 'number-precision';
import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import {
	Buy,
	buySaleItem,
	currenciesFetch,
	findSalebyId,
	getPrice,
	getTotalBuyers,
	resetBuyResponse,
	SaleItem,
	selectBuy,
	selectCurrencies,
	selectPrice,
	selectWallets,
	walletsFetch,
} from '../../../../../modules';
import { BuyConfirmModal } from '../BuyConfirmModal';

import './SaleBuy.css';
interface SaleBuyProps {
	uid: string;
	sale: SaleItem;
}

export const SaleBuy: React.FC<SaleBuyProps> = (props: SaleBuyProps) => {
	const { id, currency_id, currency_available, type } = props.sale;

	const priceSelector = useSelector(selectPrice);
	const buyResponse = useSelector(selectBuy, shallowEqual);

	// dispatch Fetch Wallets Of User Action
	const history = useHistory();
	const dispatch = useDispatch();
	const dispatchWalletsFetch = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);
	const dispatchBuy = React.useCallback((buyInfo: Buy) => dispatch(buySaleItem(buyInfo)), [dispatch]);
	const dispatchGetPrice = React.useCallback((priceConfig: any) => dispatch(getPrice(priceConfig)), [dispatch]);
	const dispatchResetBuyResponse = React.useCallback(() => dispatch(resetBuyResponse()), [dispatch]);
	const dispatchGetTotalBuyers = React.useCallback(
		(ieoID: string) =>
			dispatch(
				getTotalBuyers({
					ieo_id: ieoID,
				}),
			),
		[dispatch],
	);
	const dispatchFetchSaleItemByID = React.useCallback(
		(ieoID: string) =>
			dispatch(
				findSalebyId({
					id: ieoID,
				}),
			),
		[dispatch],
	);

	const dispatchcFetchCurrencies = React.useCallback(() => dispatch(currenciesFetch()), [dispatch]);

	React.useEffect(() => {
		dispatchcFetchCurrencies();
	}, [dispatchcFetchCurrencies]);

	const currencies = useSelector(selectCurrencies);
	// filter Wallets that have currency in currency_available Of Sale Item
	const wallets = useSelector(selectWallets);
	const filteredWallets = wallets.filter(wallet => currency_available.includes(wallet.currency));
	const baseWallet = wallets.find(wallet => wallet.currency === currency_id);
	const baseBalance = baseWallet ? Number(baseWallet.balance) : 0;

	const defaultSelectedCurrency = props.sale.currency_available[0];
	// get Balance By Currency_ID
	const handleGetBalance = React.useCallback(
		currency => {
			const foundedWallet = filteredWallets.find(wallet => wallet.currency === currency);

			if (foundedWallet) {
				return Number(foundedWallet.balance);
			}

			return 0;
		},
		[filteredWallets],
	);

	// state
	const [quoteCurrencyState, setQuoteCurrencyState] = React.useState<string>(defaultSelectedCurrency);
	const [quoteBalanceState, setQuoteBalanceState] = React.useState<number>(handleGetBalance(defaultSelectedCurrency));
	const [priceState, setPriceState] = React.useState<number | undefined>(0);
	const [bonusState, setBonusState] = React.useState<number>(0);
	const [quantityInputState, setQuantityInputState] = React.useState<number>(props.sale.min_buy);
	const [quoteTotalState, setQuoteTotalState] = React.useState<number>(0);
	const [isShowBuyConfirmModalState, setIsBuyConfirmModalVisibleState] = React.useState<boolean>(false);

	const calculatePrice = React.useCallback(
		(basePrice: number, quotePrice: number) => {
			switch (quoteCurrencyState.toLowerCase()) {
				case 'kobe':
					return NP.divide(NP.divide(1, quotePrice), NP.divide(1, basePrice));
				case 'esc':
					return NP.divide(NP.divide(1, quotePrice), NP.divide(1, basePrice));
				case 'swp':
					return NP.divide(NP.divide(1, quotePrice), NP.divide(1, basePrice));
				default:
					return NP.divide(quotePrice, NP.divide(1, basePrice));
			}
		},
		[quoteCurrencyState],
	);

	// handle Select Currency
	const handleSelectCurrency = event => {
		const selectedCurrency = event.target.value;
		setQuoteCurrencyState(selectedCurrency);
		setQuoteBalanceState(handleGetBalance(selectedCurrency));
		setQuantityInputState(props.sale.min_buy);
		if (priceSelector.payload[quoteCurrencyState.toUpperCase()]) {
			setQuoteTotalState(calculatePrice(props.sale.price, priceSelector.payload[quoteCurrencyState.toUpperCase()]));
		}
	};

	const updateBonusState = React.useCallback(
		(quantity: number) => {
			const { bonus } = props.sale;
			const arrayOfBonus = bonus;
			const foundedBonus = arrayOfBonus.find(bonusParam => {
				const bonusRange = String(Object.keys(bonusParam)).split('-');
				const startPoint = Number(bonusRange[0]);
				const endPoint = Number(bonusRange[1]);
				if (quantity >= startPoint && quantity <= endPoint) {
					return true;
				}

				return false;
			});
			if (foundedBonus) {
				const bonusValue = Object.entries(foundedBonus)[0][1];
				setBonusState(Number(bonusValue));
			} else {
				setBonusState(0);
			}
		},
		[props.sale],
	);
	const handleQuantityInput = event => {
		const quantity = event.target.value;
		const { price } = props.sale;

		setQuantityInputState(quantity);
		setQuoteTotalState(
			NP.times(NP.strip(calculatePrice(price, priceSelector.payload[quoteCurrencyState.toUpperCase()] || 0)), quantity),
		);

		updateBonusState(quantity);
	};

	const findIcon = (code: string): string => {
		const currency = currencies.find((currencyParam: any) => currencyParam.id === code);
		try {
			return require(`../../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}

			return require('../../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};

	React.useEffect(
		() => {
			dispatchWalletsFetch();
			dispatchGetPrice({
				fsym: 'USD',
				tsyms: props.sale.currency_available,
			});
			updateBonusState(quantityInputState);
			setQuoteBalanceState(handleGetBalance(props.sale.currency_available[0]));
		},
		[
			// dispatchGetPrice,
			// dispatchWalletsFetch,
			// handleGetBalance,
			// props.sale.currency_available,
			// quantityInputState,
			// updateBonusState,
		],
	);

	React.useEffect(() => {
		setQuoteBalanceState(handleGetBalance(quoteCurrencyState));
	}, [filteredWallets.length, quoteCurrencyState, handleGetBalance]);

	React.useEffect(() => {
		if (priceSelector.payload && quoteCurrencyState && priceSelector.payload[quoteCurrencyState.toUpperCase()]) {
			const convertedPrice = calculatePrice(props.sale.price, priceSelector.payload[quoteCurrencyState.toUpperCase()]);
			setPriceState(convertedPrice);
			setQuoteTotalState(NP.strip(NP.times(quantityInputState, convertedPrice)));
		}
	}, [quoteCurrencyState, priceSelector.loading, calculatePrice, priceSelector.payload, props.sale.price, quantityInputState]);

	const hiddenBuyConfirmModal = () => {
		setIsBuyConfirmModalVisibleState(false);
	};

	const showBuyConfirmModal = () => {
		setIsBuyConfirmModalVisibleState(true);
	};

	React.useEffect(
		() => {
			if (buyResponse.error) {
				notification.error({
					message: buyResponse.error.message,
				});
			}

			if (buyResponse.payload) {
				if (buyResponse.payload.success) {
					notification.success({
						message: `Buy ${currency_id.toUpperCase()} successfully`,
					});
					dispatchResetBuyResponse();
					dispatchGetTotalBuyers(props.sale.id); // update Total Buyers in Sale Info
					setTimeout(() => {
						dispatchFetchSaleItemByID(props.sale.id);
					}, 3000);
				}
			}

			if (buyResponse.loading) {
				const hide = message.loading('Buying in progress..', 0);
				// dismiss manually and asynchronously
				setTimeout(hide, 2500);
			}
		},
		[
			// buyResponse.error,
			// buyResponse.payload.success,
			// buyResponse.loading,
			// buyResponse.payload,
			// currency_id,
			// dispatchFetchSaleItemByID,
			// dispatchGetTotalBuyers,
			// dispatchResetBuyResponse,
			// props.sale.id,
		],
	);

	const handleBuy = () => {
		const uid = props.uid;
		const quantity = quantityInputState;
		const totalPurchase = quoteTotalState;
		const quoteCurrency = quoteCurrencyState;
		if (priceState && priceState > 0 && quantity > 0 && totalPurchase && totalPurchase > 0 && quoteCurrency) {
			const buyInfo: Buy = {
				ieo_id: id,
				uid: uid,
				quantity: quantity,
				total_purchase: totalPurchase,
				quote_currency: quoteCurrency,
			};
			dispatchBuy(buyInfo);
			setIsBuyConfirmModalVisibleState(false);
		} else {
			notification.error({
				message: 'Something went wrong.',
			});
		}
	};

	const handleNavigateLoginPage = () => {
		const location = {
			pathname: '/signin',
		};
		history.push(location);
	};

	const handleBuyDisabled = () => {
		return quoteBalanceState < quoteTotalState || quantityInputState < props.sale.min_buy || !priceState || priceState <= 0;
	};

	let buyButton;
	if (props.uid) {
		buyButton = (
			<Button
				type="primary"
				size="large"
				block
				style={{ height: '3rem' }}
				disabled={handleBuyDisabled()}
				onClick={showBuyConfirmModal}
			>
				Buy
			</Button>
		);
	} else {
		buyButton = (
			<Button type="primary" size="large" block style={{ height: '3rem' }} onClick={handleNavigateLoginPage}>
				Login
			</Button>
		);
	}

	const showBuyForm = () => {
		if (quoteCurrencyState) {
			return (
				<React.Fragment>
					<div className="quantity">
						<span>Quantity to buy:</span>
						<Input
							size="large"
							autoFocus={type === 'ongoing'}
							value={quantityInputState}
							type="number"
							disabled={quoteBalanceState <= 0}
							onChange={handleQuantityInput}
							addonBefore={<img className="currency-icon" src={findIcon(currency_id)} alt="currency_buy" />}
							addonAfter={currency_id.toUpperCase()}
						/>
						{quantityInputState < props.sale.min_buy ? (
							<span style={{ color: '#e63946', fontWeight: 'bold', fontSize: '14px' }}>
								** Quantiy must be larger {props.sale.min_buy}
							</span>
						) : (
							''
						)}
					</div>
					<div className="price">
						<span>At the price:</span>
						<Input
							size="large"
							disabled
							value={priceState}
							type="number"
							addonBefore={<img className="currency-icon" src={findIcon(quoteCurrencyState)} alt="price_icon" />}
							addonAfter={quoteCurrencyState.toUpperCase()}
						/>
					</div>
					<div className="total">
						<span>Total</span>
						<Input
							size="large"
							disabled
							max="1000000"
							value={quoteTotalState}
							type="number"
							addonBefore={<img className="currency-icon" src={findIcon(quoteCurrencyState)} alt="" />}
							addonAfter={quoteCurrencyState.toUpperCase()}
						/>
					</div>
					<div className="buy-button" style={{ marginTop: '3rem' }}>
						{buyButton}
					</div>
				</React.Fragment>
			);
		} else {
			return '';
		}
	};

	const showSelectCurrencyForm = () => {
		return (
			<div className="select-currency-box-mobile">
				<span>Select currency</span>
				<select onChange={handleSelectCurrency} value={quoteCurrencyState}>
					{currency_available.map(currency => {
						let optiontring = currency.toUpperCase();
						const balance = handleGetBalance(currency);
						optiontring += ` | Available: ${balance}`;

						return <option value={currency}>{optiontring}</option>;
					})}
				</select>
			</div>
		);
	};

	const showCloseView = () => {
		if (type !== 'ongoing') {
			return (
				<div id="sale-buy-mobile__closed">
					<span>STARTING PRICE:</span>
					<p>${props.sale.price} USD</p>
					<span>STARTS AFTER:</span>
					<p style={{ color: 'rgb(248, 83, 113)' }}>{type.toUpperCase()}</p>
				</div>
			);
		}

		return '';
	};

	const showBuyConfirmModalView = () => {
		if (quoteTotalState && quoteCurrencyState && quantityInputState >= props.sale.min_buy && priceState && priceState > 0) {
			return (
				<BuyConfirmModal
					visible={isShowBuyConfirmModalState}
					onHiddenModal={hiddenBuyConfirmModal}
					onBuy={handleBuy}
					quantity={quantityInputState}
					ieoID={id}
					baseBalance={baseBalance}
					baseCurrency={String(currency_id).toUpperCase()}
					quoteBalance={quoteBalanceState}
					quoteCurrency={String(quoteCurrencyState).toUpperCase()}
					quoteTotal={quoteTotalState}
					bonus={bonusState}
				/>
			);
		}

		return '';
	};

	return (
		<React.Fragment>
			<div id="sale-buy-mobile" style={{ height: '100%' }}>
				<h2 className="sale-buy-mobile__title">Buy {currency_id.toUpperCase()}</h2>
				<h3 className="sale-buy-mobile__subtitle">{`Available: ${baseBalance} ${currency_id.toUpperCase()}`}</h3>
				<div className="buy-box">
					{showSelectCurrencyForm()}
					{showBuyForm()}
				</div>
			</div>
			{showCloseView()}
			{showBuyConfirmModalView()}
		</React.Fragment>
	);
};
