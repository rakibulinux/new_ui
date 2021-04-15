import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Buy, buySaleItem, SaleItem, selectBuy, selectWallets, walletsFetch, resetBuyResponse, selectPrice, getPrice, getTotalBuyers, findSalebyId, currenciesFetch, selectCurrencies } from '../../../../modules';
import { BuyConfirmModal } from '../BuyConfirmModal';
import { Button, Input, message, notification } from 'antd';
import NP from 'number-precision';
import WalletImage from '../../assets/wallet.png';

import './SaleBuy.css';
interface SaleBuyProps {
    uid: string;
    sale: SaleItem;
}

export const SaleBuy: React.FC<SaleBuyProps> = (props: SaleBuyProps) => {

    const { id, currency_id, currency_available, type } = props.sale;

    const priceSelector = useSelector(selectPrice);
    const buyResponse = useSelector(selectBuy, shallowEqual);

    // Dispatch Fetch Wallets Of User Action
    const history = useHistory();
    const dispatch = useDispatch();
    const dispatchWalletsFetch = () => dispatch(walletsFetch());
    const dispatchBuy = (buyInfo: Buy) => dispatch(buySaleItem(buyInfo));
    const dispatchGetPrice = (priceConfig: any) => dispatch(getPrice(priceConfig));
    const dispatchResetBuyResponse = () => dispatch(resetBuyResponse());
    const dispatchGetTotalBuyers = (ieoID: string) => dispatch(getTotalBuyers({
        ieo_id: ieoID
    }));
    const dispatchFetchSaleItemByID = (ieoID: string) => dispatch(findSalebyId({
        id: ieoID
    }));

    const dispatchcFetchCurrencies = () => dispatch(currenciesFetch());

    React.useEffect(() => {
        dispatchcFetchCurrencies();
    }, []);

    const currencies = useSelector(selectCurrencies);
    // Filter Wallets that have currency in currency_available Of Sale Item
    const wallets = useSelector(selectWallets);
    const filteredWallets = wallets.filter(wallet => currency_available.includes(wallet.currency));
    const baseWallet = wallets.find(wallet => wallet.currency === currency_id);
    const baseBalance = baseWallet ? Number(baseWallet.balance) : 0;

    const defaultSelectedCurrency = props.sale.currency_available[0];
    // Get Balance By Currency_ID
    const handleGetBalance = (currency) => {
        const foundedWallet = filteredWallets.find(wallet => wallet.currency === currency);

        if (foundedWallet) {
            return Number(foundedWallet.balance);
        }
        return 0;
    }

    // State
    const [quoteCurrencyState, setQuoteCurrencyState] = React.useState<string>(defaultSelectedCurrency);
    const [quoteBalanceState, setQuoteBalanceState] = React.useState<number>(handleGetBalance(defaultSelectedCurrency));
    const [priceState, setPriceState] = React.useState<number | undefined>(0);
    const [bonusState, setBonusState] = React.useState<number>(0);
    const [quantityInputState, setQuantityInputState] = React.useState<number>(props.sale.min_buy);
    const [quoteTotalState, setQuoteTotalState] = React.useState<number>(0);
    const [isShowBuyConfirmModalState, setIsBuyConfirmModalVisibleState] = React.useState<boolean>(false);


    const calculatePrice = (base_price: number, quote_price: number) => {
        switch (quoteCurrencyState.toLowerCase()) {
            case 'kobe':
                return NP.divide(NP.divide(1, quote_price), NP.divide(1, base_price));
            case 'esc':
                return NP.divide(NP.divide(1, quote_price), NP.divide(1, base_price));
            case 'swp':
                return NP.divide(NP.divide(1, quote_price), NP.divide(1, base_price));
            default:
                return NP.divide(quote_price, NP.divide(1, base_price));
        }
    }

    // Handle Select Currency
    const handleSelectCurrency = (event) => {
        const selectedCurrency = event.target.value;
        setQuoteCurrencyState(selectedCurrency);
        setQuoteBalanceState(handleGetBalance(selectedCurrency));
        setQuantityInputState(props.sale.min_buy);
        if (priceSelector.payload[quoteCurrencyState.toUpperCase()]) {
            setQuoteTotalState(calculatePrice(props.sale.price, priceSelector.payload[quoteCurrencyState.toUpperCase()]));
        }
    }

    const updateBonusState = (quantity: number) => {
        const { bonus } = props.sale;
        const arrayOfBonus = bonus;
        const foundedBonus = arrayOfBonus.find((bonus) => {
            const bonusRange = String(Object.keys(bonus)).split('-');
            const startPoint = Number(bonusRange[0])
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
    }
    const handleQuantityInput = (event) => {
        const quantity = event.target.value;
        const { price } = props.sale;

        setQuantityInputState(quantity);
        setQuoteTotalState(NP.times(NP.strip(calculatePrice(price, priceSelector.payload[quoteCurrencyState.toUpperCase()] || 0)), quantity));

        updateBonusState(quantity);
    }

    const findIcon = (code: string): string => {
        const currency = currencies.find((currency: any) => currency.id === code);
        try {
            return require(`../../../../../node_modules/cryptocurrency-icons/128/color/${code.toLowerCase()}.png`);
        } catch (err) {
            if (currency) return currency.icon_url;
            return require('../../../../../node_modules/cryptocurrency-icons/svg/color/generic.svg');
        }
    };

    React.useEffect(() => {
        dispatchWalletsFetch();
        dispatchGetPrice({
            fsym: 'USD',
            tsyms: props.sale.currency_available
        });
        updateBonusState(quantityInputState);
        setQuoteBalanceState(handleGetBalance(props.sale.currency_available[0]));
    }, []);

    React.useEffect(() => {
        setQuoteBalanceState(handleGetBalance(quoteCurrencyState));
    }, [filteredWallets.length]);

    React.useEffect(() => {
        if (priceSelector.payload && quoteCurrencyState && priceSelector.payload[quoteCurrencyState.toUpperCase()]) {
            const convertedPrice = calculatePrice(props.sale.price, priceSelector.payload[quoteCurrencyState.toUpperCase()]);
            setPriceState(convertedPrice);
            setQuoteTotalState(NP.strip(NP.times(quantityInputState, convertedPrice)));
        }
    }, [quoteCurrencyState, priceSelector.loading]);

    const hiddenBuyConfirmModal = () => {
        setIsBuyConfirmModalVisibleState(false);
    }

    const showBuyConfirmModal = () => {
        setIsBuyConfirmModalVisibleState(true);
    }

    React.useEffect(() => {
        if (buyResponse.error) {
            notification['error']({
                message: buyResponse.error.message,
            });
        }

        if (buyResponse.payload) {
            if (buyResponse.payload.success) {
                notification['success']({
                    message: `Buy ${currency_id.toUpperCase()} successfully`,
                });
                dispatchResetBuyResponse();
                dispatchGetTotalBuyers(props.sale.id); // Update Total Buyers in Sale Info
                setTimeout(() => {
                    dispatchFetchSaleItemByID(props.sale.id);
                }, 3000);
            }
        }

        if (buyResponse.loading) {
            const hide = message.loading('Buying in progress..', 0);
            // Dismiss manually and asynchronously
            setTimeout(hide, 2500);
        }
    }, [buyResponse.error, buyResponse.payload.success, buyResponse.loading]);

    const handleBuy = () => {
        const { id } = props.sale;
        const uid = props.uid;
        const quantity = quantityInputState;
        const total_purchase = quoteTotalState;
        const quote_currency = quoteCurrencyState;
        if (priceState && priceState > 0 && quantity > 0 && total_purchase && total_purchase > 0 && quote_currency) {
            const buyInfo: Buy = {
                ieo_id: id,
                uid: uid,
                quantity: quantity,
                total_purchase: total_purchase,
                quote_currency: quote_currency
            }
            dispatchBuy(buyInfo);
            setIsBuyConfirmModalVisibleState(false);
        } else {
            notification['error']({
                message: 'Something went wrong.',
            });
        }

    }

    const handleNavigateLoginPage = () => {
        const location = {
            pathname: '/signin'
        }
        history.push(location);
    }

    const handleBuyDisabled = () => {
        return quoteBalanceState < quoteTotalState || quantityInputState < props.sale.min_buy || !priceState || priceState <= 0;
    }

    let buyButton;
    if (props.uid) {
        buyButton =
            <Button
                type="primary"
                size="large"
                block
                style={{ height: '3rem' }}
                disabled={handleBuyDisabled()}
                onClick={showBuyConfirmModal}>
                Buy
            </Button>;
    } else {
        buyButton =
            <Button
                type="primary"
                size="large"
                block
                style={{ height: '3rem' }}
                onClick={handleNavigateLoginPage}>
                Login
            </Button>;
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
                            addonAfter={currency_id.toUpperCase()} />
                        {quantityInputState < props.sale.min_buy ? <span style={{ color: '#e63946', fontWeight: 'bold' }}>** Quantiy must be larger {props.sale.min_buy}</span> : ''}
                    </div>
                    <div className="price">
                        <span>At the price:</span>
                        <Input
                            size="large"
                            disabled
                            value={priceState}
                            type="number"
                            addonBefore={<img className="currency-icon" src={findIcon(quoteCurrencyState)} alt="price_icon" />}
                            addonAfter={quoteCurrencyState.toUpperCase()} />
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
                            addonAfter={quoteCurrencyState.toUpperCase()} />
                    </div>
                    <div className="buy-button" style={{ marginTop: '3rem' }}>
                        {buyButton}
                    </div>
                </React.Fragment>
            );
        } else {
            return '';
        }
    }

    const showSelectCurrencyForm = () => {
        return (
            <div className="select-currency-box">
                <span>Select currency</span>
                <select onChange={handleSelectCurrency} value={quoteCurrencyState}>
                    {currency_available.map(currency => {
                        let optiontring = currency.toUpperCase();
                        const balance = handleGetBalance(currency);
                        optiontring += ' | ' + "Available: " + balance
                        return (
                            <option value={currency}>{optiontring}</option>
                        )
                    })}
                </select>
            </div>
        );
    }

    const showCloseView = () => {
        if (type !== 'ongoing') {
            return (
                <div id="sale-buy__closed">
                    <span>STARTING PRICE:</span>
                    <p>${props.sale.price} USD</p>
                    <span>STARTS AFTER:</span>
                    <p style={{ color: 'rgb(248, 83, 113)' }}>{type.toUpperCase()}</p>
                </div>

            );
        }
        return '';
    }

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
    }

    return (
        <React.Fragment>
            <div id="sale-buy" style={{ height: '100%' }}>
                <h2 className="sale-buy__title">Buy {currency_id.toUpperCase()}</h2>
                <h3 className="sale-buy__subtitle">
                    {`Available: ${baseBalance} ${currency_id.toUpperCase()}`}
                </h3>
                <div className="buy-box">
                    {showSelectCurrencyForm()}
                    {showBuyForm()}
                </div>
                <div className="row">
                    <div className="col-12 text-center" style={{ marginTop: '2rem' }}>
                        <img width="100px" src={WalletImage} alt="wallet-image" />
                    </div>
                </div>
            </div>
            {showCloseView()}
            {showBuyConfirmModalView()}
        </React.Fragment>
    );
}
