import * as React from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router';
import { BuyConfirmModal } from '../BuyConfirmModal';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
	currenciesFetch,
	selectCurrencies,
	selectWallets,
	selectPrice,
	getPrice,
	walletsFetch,
	BuyIEO,
	buyIEOItem,
	selectBuyIEO,
	resetBuyResponse,
} from '../../../../modules';
import NP from 'number-precision';
import { notification } from 'antd';

interface BuyIEOProps {
	coins: Array<string>;
	currencyID: string;
	priceIEO: number;
	type: string;
	minBuy: number;
	uid: string;
	id: string;
	bonus: string;
}

export const BuyIEOComponent: React.FC<BuyIEOProps> = props => {
	const history = useHistory();
	const [selectedCurrencyState, setSelectedCurrencyState] = React.useState(props.coins[0] || '');
	const [coinActive, setCoinActive] = React.useState(0);
	const [quantityState, setQuantityState] = React.useState<number>(Number(props.minBuy));
	const [priceState, setPriceState] = React.useState(0);
	const [totalPriceState, setTotalPriceState] = React.useState<number>(0);
	const [isShowBuyConfirmModalState, setIsShowBuyConfirmModalState] = React.useState<boolean>(false);
	const [checkedRegulationState, setCheckRegulationSate] = React.useState<boolean>(false);
	const [isCitizenState, setIsCitizenState] = React.useState<boolean>(false);
	const currencies = useSelector(selectCurrencies);
	const wallets = useSelector(selectWallets);
	const priceSelector = useSelector(selectPrice);
	const [isLoadingState, setIsLoadingState] = React.useState<boolean>(false);

	const filteredWallets = wallets.filter(wallet => props.coins.includes(wallet.currency));
	const baseWallet = wallets.find(wallet => wallet.currency === props.currencyID);
	const baseBalance = baseWallet ? Number(baseWallet.balance) : 0;
	React.useEffect(() => {
		setSelectedCurrencyState(props.coins[0]);
	}, [props.coins[0]]);

	const dispatch = useDispatch();
	const dispatchBuy = React.useCallback((buyInfo: BuyIEO) => dispatch(buyIEOItem(buyInfo)), [dispatch]);

	const dispatchFetchCurrencies = () => dispatch(currenciesFetch());
	const dispatchGetPrice = React.useCallback((priceConfig: any) => dispatch(getPrice(priceConfig)), [dispatch]);
	const dispatchWalletsFetch = React.useCallback(() => dispatch(walletsFetch()), [dispatch]);

	React.useEffect(() => {
		dispatchFetchCurrencies();
	}, []);
	React.useEffect(() => {
		dispatchWalletsFetch();
		dispatchGetPrice({
			fsym: 'USD',
			tsyms: props.coins,
		});
	}, []);

	const buyResponse = useSelector(selectBuyIEO, shallowEqual);
	const handleGetBalance = React.useCallback(
		currency => {
			const foundedWallet = filteredWallets.find(wallet => wallet.currency === currency);

			if (foundedWallet) {
				if (foundedWallet.balance) return Number(foundedWallet.balance);
				return 0;
			}

			return 0;
		},
		[filteredWallets],
	);
	const [quoteBalanceState, setQuoteBalanceState] = React.useState<number>(handleGetBalance(selectedCurrencyState));

	const loadingBuyIEO = () => {
		return (
			<div className="d-flex justify-content-center" style={{ position: 'absolute', top: '45%', left: '50%' }}>
				<div className="spinner-border text-primary" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	};
	const returnLoginScreen = () => {
		return (
			<button
				type="button"
				className="btn-buy-ieo btn"
				onClick={() => {
					const location = {
						pathname: '/login',
					};
					history.push(location);
				}}
			>
				Please Login For Buy
			</button>
		);
	};
	const buyIEOButton = () => {
		const checkSatisfy =
			checkedRegulationState &&
			isCitizenState &&
			quantityState !== 0 &&
			props.minBuy <= quantityState &&
			handleGetBalance(selectedCurrencyState) !== 0 &&
			props.type === 'ongoing';
		return (
			<button
				type="button"
				className="btn-buy-ieo btn"
				onClick={() => {
					setIsShowBuyConfirmModalState(true);
				}}
				disabled={!checkSatisfy}
			>
				{`Buy ${props.currencyID}`}
			</button>
		);
	};
	const hiddenBuyConfirmModal = () => {
		setIsShowBuyConfirmModalState(false);
	};
	React.useEffect(() => {
		if (!buyResponse.loading) {
			setIsLoadingState(false);
			if (buyResponse.success) {
				dispatch(resetBuyResponse());
				setQuantityState(Number(props.minBuy));
				setIsCitizenState(false);
				setCheckRegulationSate(false);
			}
		}
	}, [buyResponse.loading]);
	const handleBuy = () => {
		setIsLoadingState(true);
		const uid = props.uid;
		if (
			priceState &&
			priceState > 0 &&
			quantityState > 0 &&
			totalPriceState &&
			totalPriceState > 0 &&
			selectedCurrencyState
		) {
			const buyInfo: BuyIEO = {
				ieo_id: props.id,
				uid: uid,
				quantity: quantityState,
				total_purchase: totalPriceState,
				quote_currency: selectedCurrencyState.toLowerCase(),
			};
			dispatchBuy(buyInfo);
			setIsShowBuyConfirmModalState(false);
		} else {
			notification.error({
				message: 'Something went wrong.',
			});
		}
	};
	const showBuyConfirmModalView = () => {
		const check =
			isShowBuyConfirmModalState &&
			totalPriceState &&
			selectedCurrencyState &&
			quantityState >= props.minBuy &&
			priceState &&
			priceState > 0;

		return check ? (
			<BuyConfirmModal
				visible={isShowBuyConfirmModalState}
				onHiddenModal={hiddenBuyConfirmModal}
				onBuy={handleBuy}
				quantity={quantityState}
				ieoID={props.id.toString()}
				baseBalance={baseBalance}
				baseCurrency={String(props.currencyID).toUpperCase()}
				quoteBalance={quoteBalanceState}
				quoteCurrency={String(selectedCurrencyState).toUpperCase()}
				quoteTotal={totalPriceState}
				bonus={Number(props.bonus)}
			/>
		) : (
			<></>
		);
	};
	const showCloseView = () => {
		return (
			<div className="buy-ieo-close-view">
				<div className="buy-ieo-close-view-content">
					<span>STARTING PRICE:</span>
					<p>${props.priceIEO} USD</p>
					<span>STARTS AFTER:</span>
					<p style={{ color: 'rgb(248, 83, 113)' }}>{props.type.toUpperCase()}</p>
				</div>
			</div>
		);
	};
	const findIcon = (code: string): string => {
		const currency = currencies.find(currencyParam => currencyParam.id === code);
		try {
			return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
		} catch (err) {
			if (currency) {
				return currency.icon_url;
			}
			return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
		}
	};
	const calculatePrice = (basePrice: number, quotePrice: number) => {
		switch (selectedCurrencyState.toLowerCase()) {
			case 'cx':
				return NP.divide(NP.divide(1, quotePrice), NP.divide(1, basePrice));
			default:
				return NP.divide(quotePrice, NP.divide(1, basePrice));
		}
	};
	React.useEffect(() => {
		if (priceSelector.payload && selectedCurrencyState && priceSelector.payload[selectedCurrencyState.toUpperCase()]) {
			const convertedPrice = calculatePrice(props.priceIEO, priceSelector.payload[selectedCurrencyState.toUpperCase()]);
			setPriceState(convertedPrice);
			setTotalPriceState(NP.strip(NP.times(quantityState, convertedPrice)));
		}
	}, [quantityState, priceSelector, selectedCurrencyState]);
	const nonActiveCoinClassNames = classNames('buy-ieo-coin', 'non_active');
	const activeBuyCoinClassNames = classNames('buy-ieo-coin', 'active');
	const disabledBuyClassName = classNames('disabledBuy');
	return (
		<div id="buy-ieo">
			{showBuyConfirmModalView()}
			{isLoadingState ? loadingBuyIEO() : <></>}
			{props.type !== 'ongoing' ? showCloseView() : <></>}
			<div
				id="buy-ieo-container"
				className={`col-md-12  ${
					props.type !== 'ongoing' || isShowBuyConfirmModalState || isLoadingState ? disabledBuyClassName : ''
				}`}
			>
				<div id="buy-ieo-coins">
					{props.coins.map((coin, index) => (
						<button
							key={index}
							className={coinActive === index ? activeBuyCoinClassNames : nonActiveCoinClassNames}
							onClick={() => {
								setCoinActive(index);
								setSelectedCurrencyState(coin);
								setQuoteBalanceState(handleGetBalance(coin));
								setQuantityState(props.minBuy);
								if (priceSelector.payload[coin.toUpperCase()]) {
									setTotalPriceState(calculatePrice(props.priceIEO, priceSelector.payload[coin.toUpperCase()]));
								}
							}}
						>
							{coin}
						</button>
					))}
				</div>
				<div id="buy-ieo-body" className="d-flex flex-wrap">
					<div className="col-12 d-flex justify-content-between" style={{ padding: '0' }}>
						<div id="buy-ieo-body-available" style={{ textAlign: 'right', width: '100%' }}>
							<p className="buy-ieo-available-amount">
								Available {props.currencyID.toUpperCase()}: <span>{baseBalance}</span>{' '}
								{`${props.currencyID.toUpperCase()}`}
							</p>
							<p className="buy-ieo-available-amount">
								Available {selectedCurrencyState.toUpperCase()}:{' '}
								<span>{handleGetBalance(selectedCurrencyState)}</span> {`${selectedCurrencyState.toUpperCase()}`}
							</p>
						</div>
					</div>
					<label htmlFor="quantityToBuy" className="mt-5">
						Quantity to buy :
					</label>
					<div id="buy-ieo-body-payment" style={{ padding: '0' }} className="d-flex flex-wrap input-group-body">
						<div id="buy-ieo-body-coin-avt">
							<img src={findIcon(props.currencyID)} alt="iconCoin"></img>
						</div>
						<input
							type="number"
							value={quantityState}
							onChange={event => {
								if (Number(event.target.value) >= 0) setQuantityState(Number(event.target.value));
							}}
							id="buy-ieo-body-input"
							name="quantityToBuy"
						></input>
						<span id="denominations-coin">{props.currencyID}</span>
					</div>

					{props.minBuy > quantityState ? (
						<span style={{ color: 'rgb(218 50 58)', fontWeight: 'bold', width: '100%' }}>
							** Quantity must be larger {`${Number(props.minBuy)} ${selectedCurrencyState.toUpperCase()}`}
						</span>
					) : (
						''
					)}
					<label htmlFor="buy-ieo-body-input-price" className="mt-5">
						At The Price :
					</label>
					<div id="buy-ieo-body-price" style={{ padding: '0' }} className="d-flex flex-wrap input-group-body">
						<div id="buy-ieo-body-coin-avt">
							<img src={findIcon(selectedCurrencyState)} alt="iconCoin"></img>
						</div>
						<input
							type="number"
							id="buy-ieo-body-input"
							value={priceState}
							placeholder="0"
							style={{
								background: 'rgb(61 55 81 / 40%)',
								borderRight: '1px solid #848e9c',
								cursor: 'not-allowed',
							}}
							disabled
						></input>
						<span id="denominations-coin">{selectedCurrencyState}</span>
					</div>
					<label htmlFor="quantityToBuy" className="mt-5">
						Total :
					</label>
					<div id="buy-ieo-body-total" style={{ padding: '0' }} className="d-flex flex-wrap input-group-body">
						<div id="buy-ieo-body-coin-avt">
							<img src={findIcon(selectedCurrencyState)} alt="iconCoin"></img>
						</div>
						<input
							type="number"
							id="buy-ieo-body-input"
							value={totalPriceState}
							style={{
								background: 'rgb(61 55 81 / 40%)',
								borderRight: '1px solid #848e9c',
								cursor: 'not-allowed',
							}}
							placeholder="0"
							disabled
						></input>
						<span id="denominations-coin">{selectedCurrencyState}</span>
					</div>

					<div id="regulations">
						<div className="input-group d-flex">
							<input
								type="checkbox"
								name="regulations-view-items"
								id="regulations-view-items"
								className="regulations-law"
								defaultChecked={checkedRegulationState}
								onClick={() => {
									setCheckRegulationSate(!checkedRegulationState);
								}}
							></input>
							<label htmlFor="regulations-view-items" className="ml-2" style={{ color: ' #848e9c' }}>
								I agree with the token purchasing terms .
								<a style={{ textDecoration: 'underline', cursor: 'pointer' }}>View Terms</a>
							</label>
						</div>
						<div className="input-group d-flex">
							<input
								type="checkbox"
								className="regulations-law"
								name="check-citizen-ban"
								id="isCitizenState"
								defaultChecked={isCitizenState}
								onClick={() => {
									setIsCitizenState(!isCitizenState);
								}}
							></input>
							<label htmlFor="check-citizen-ban" className="ml-2" style={{ color: ' #848e9c' }}>
								I'm not a citizen of one of the countries that bans ICO trading.
							</label>
						</div>
					</div>
					{props.uid ? buyIEOButton() : returnLoginScreen()}
				</div>
			</div>
		</div>
	);
};
