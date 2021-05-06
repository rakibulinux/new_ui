import { Slider } from 'antd';
import floor from 'lodash/floor';
import get from 'lodash/get';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FormType, WalletItemProps } from '../../../../components';
import { cleanPositiveFloatInput, precisionRegExp } from '../../../../helpers';
import {
  alertPush,
  orderExecuteFetch,
  OrderExecution,
  selectCurrentMarket,
  selectCurrentPrice,
  selectMarketTickers,
  selectOrderExecuteLoading,
  selectUserLoggedIn,
  selectWallets,
  setCurrentPrice,
  Wallet,
  walletsFetch,
} from '../../../../modules';
import moneySvg from '../../assets/money.svg';
import { OrderStyle } from './styles';

// tslint:disable-next-line: no-empty-interface
interface OrderProps {}

const defaultFormState = {
  amountBuy: '',
  amountSell: '',
  priceBuy: '',
  priceSell: '',
  percentBuyMyBalance: 0,
  percentSellMyBalance: 0,
};

const defaultCurrentTicker = { last: '0' };

export const Order: React.FC<OrderProps> = ({}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const executeLoading = useSelector(selectOrderExecuteLoading, isEqual);
  const wallets = useSelector(selectWallets, isEqual);
  const currentPrice = useSelector(selectCurrentPrice, isEqual);
  const currentMarket = useSelector(selectCurrentMarket, isEqual);
  const marketTickers = useSelector(selectMarketTickers, isEqual);
  const isLoggedIn = useSelector(selectUserLoggedIn, isEqual);

  const TABS_LIST_KEY = [
    intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit' }),
    intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market' }),
  ];

  const [tabTypeSelectedState, setTabTypeSelectedState] = React.useState<string>(TABS_LIST_KEY[0]);
  const [formState, setFormState] = React.useState(defaultFormState);

  React.useEffect(() => {
    if (!wallets.length) {
      dispatch(walletsFetch());
    }
  }, []);

  React.useEffect(() => {
    if (isLoggedIn && !wallets.length) {
      dispatch(walletsFetch());
    }
  }, [isLoggedIn, wallets]);

  React.useEffect(() => {
    if (currentPrice) {
      setFormState((prev) => ({ ...prev, priceBuy: currentPrice.toString(), priceSell: currentPrice.toString() }));
    }
  }, [currentPrice]);

  React.useEffect(() => {
    setFormState(defaultFormState);
  }, [currentMarket && currentMarket.id, tabTypeSelectedState]);

  const changeAmount = (value: string, type: FormType, typeInput?: 'slider' | 'input') => {
    const convertedValue = cleanPositiveFloatInput(String(value));
    if (convertedValue.match(precisionRegExp(get(currentMarket, 'amount_precision', 6)))) {
      if (type === 'sell') {
        setFormState((prev) => ({
          ...prev,
          amountSell: convertedValue,
          percentSellMyBalance: typeInput === 'input' ? defaultFormState.percentSellMyBalance : prev.percentSellMyBalance,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          amountBuy: convertedValue,
          percentBuyMyBalance: typeInput === 'input' ? defaultFormState.percentBuyMyBalance : prev.percentBuyMyBalance,
        }));
      }
    }
  };

  const changePrice = (value: string, type: FormType) => {
    const convertedValue = cleanPositiveFloatInput(String(value));
    if (convertedValue.match(precisionRegExp(get(currentMarket, 'price_precision', 6)))) {
      if (type === 'sell') {
        setFormState((prev) => ({
          ...prev,
          priceSell: convertedValue,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          priceBuy: convertedValue,
        }));
      }
    }
  };

  const handelTabSelected: TabsProps['onChange'] = (key) => {
    if (tabTypeSelectedState !== key) {
      setTabTypeSelectedState(key);
    }
  };

  const marks = {
    0: '',
    25: '',
    50: '',
    75: '',
    100: '',
  };

  const getWallet = (currency: string, walletsParam: WalletItemProps[]) => {
    const currencyLower = currency.toLowerCase();

    return walletsParam.find((w) => w.currency === currencyLower) as Wallet;
  };

  const getAvailableValue = (wallet: Wallet | undefined) => {
    return wallet && wallet.balance ? Number(wallet.balance) : 0;
  };

  const handleSubmit = (type: FormType) => {
    if (!currentMarket) {
      return;
    }

    dispatch(setCurrentPrice(0));

    const amount = Number(type === 'sell' ? formState.amountSell : formState.amountBuy);
    const walletBase = getWallet(currentMarket.base_unit, wallets);
    const walletQuote = getWallet(currentMarket.quote_unit, wallets);
    const currentTicker = marketTickers[currentMarket.id];
    const price = Number(Number((currentTicker || defaultCurrentTicker).last).toFixed(currentMarket.price_precision));
    const available = (type === 'sell' ? getAvailableValue(walletBase) : getAvailableValue(walletQuote)) | 0;

    const resultData: OrderExecution = {
      market: currentMarket.id,
      side: type,
      volume: amount.toString(),
      ord_type: tabTypeSelectedState.toLowerCase(),
    };

    const order =
      tabTypeSelectedState === TABS_LIST_KEY[0]
        ? { ...resultData, price: type === 'buy' ? formState.priceBuy : formState.priceSell }
        : resultData;
    let orderAllowed = true;

    if (Number(resultData.volume) < Number(currentMarket.min_amount)) {
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

    if (price < Number(currentMarket.min_price)) {
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

    if (Number(currentMarket.max_price) && price > Number(currentMarket.max_price)) {
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

    if ((available < amount * +price && order.side === 'buy') || (available < amount && order.side === 'sell')) {
      dispatch(
        alertPush({
          message: [
            intl.formatMessage(
              { id: 'error.order.create.available' },
              {
                available: available,
                currency: order.side === 'buy' ? currentMarket.quote_unit.toUpperCase() : currentMarket.base_unit.toUpperCase(),
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

  const renderForm = () => {
    if (!currentMarket) {
      return (
        <div className="h-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      );
    }

    const walletBase = getWallet(currentMarket.base_unit, wallets);
    const walletQuote = getWallet(currentMarket.quote_unit, wallets);
    const currentTicker = marketTickers[currentMarket.id];
    const priceMarket = Number(Number((currentTicker || defaultCurrentTicker).last).toFixed(currentMarket.price_precision));

    const arrType: FormType[] = ['buy', 'sell'];
    const FormActionsElm = () =>
      arrType.map((type, i) => {
        const available = (type === 'sell' ? getAvailableValue(walletBase) : getAvailableValue(walletQuote)) | 0;
        const isDisabled =
          executeLoading ||
          (type === 'buy'
            ? !(formState.priceBuy || tabTypeSelectedState !== TABS_LIST_KEY[0]) ||
              !formState.amountBuy ||
              Number(formState.amountBuy) === 0
            : !(formState.priceSell || tabTypeSelectedState !== TABS_LIST_KEY[0]) ||
              !formState.amountSell ||
              Number(formState.amountSell) === 0);

        return (
          <div className="col p-0" key={i}>
            <form
              className={`content-form-${type}`}
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(type);
              }}
            >
              <div className="d-flex title-block mb-3">
                <div className="flex-fill title-block-left">
                  {intl.formatMessage({ id: `page.body.trade.header.newOrder.content.title.${type}` })}{' '}
                  {type === 'buy' ? currentMarket.quote_unit.toUpperCase() : currentMarket.base_unit.toUpperCase()}
                </div>
                <div className="flex-fill text-right title-block-right">
                  <img src={moneySvg} />
                  {' - '}
                  {type === 'buy' ? currentMarket.base_unit.toUpperCase() : currentMarket.quote_unit.toUpperCase()}
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text d-flex align-items-center text-right">
                    {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price' })}
                  </span>
                </div>
                {tabTypeSelectedState === TABS_LIST_KEY[0] ? (
                  <input
                    type="text"
                    value={type === 'buy' ? formState.priceBuy : formState.priceSell}
                    onChange={(e) => changePrice(e.target.value, type)}
                    className="form-control text-right"
                  />
                ) : (
                  <input type={'text'} value={`≈${priceMarket}`} className="form-control text-right" disabled />
                )}

                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {currentMarket.quote_unit.toUpperCase() || 'NONE'}</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text d-flex align-items-center text-right">
                    {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' })}
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control text-right"
                  value={(type === 'buy' ? formState.amountBuy : formState.amountSell).toString()}
                  onChange={(e) => changeAmount(e.target.value, type, 'input')}
                />
                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {currentMarket.base_unit.toUpperCase() || 'NONE'}</span>
                </div>
              </div>
              <Slider
                disabled={!isLoggedIn || !get(walletBase, 'balance', null)}
                tipFormatter={(e) => `${e}%`}
                marks={marks}
                step={null}
                value={type === 'buy' ? formState.percentBuyMyBalance : formState.percentSellMyBalance}
                onChange={(value: number) => {
                  setFormState((prev) => ({
                    ...prev,
                    percentBuyMyBalance: type === 'buy' ? value : prev.percentBuyMyBalance,
                    percentSellMyBalance: type === 'sell' ? value : prev.percentSellMyBalance,
                  }));
                  changeAmount(
                    floor(
                      walletBase.balance ? (Number(walletBase.balance) / 100) * value : 0,
                      currentMarket.amount_precision,
                    ).toString(),
                    type,
                  );
                }}
              />
              {isLoggedIn ? (
                <button type="submit" className="btn submit-order w-100" disabled={isDisabled}>
                  <span> {intl.formatMessage({ id: `page.body.trade.header.newOrder.content.title.${type}` })}</span>
                </button>
              ) : (
                <div className="logger-order w-100 d-flex justify-content-center align-item-center">
                  <Link to="/login"> {intl.formatMessage({ id: 'page.body.user.loggin' })}</Link>
                  <span>or</span>
                  <Link to="/register"> {intl.formatMessage({ id: 'page.body.user.register' })}</Link>
                </div>
              )}
            </form>
          </div>
        );
      });

    return (
      <div className="content-form-wrapper">
        <div className="row">{FormActionsElm()}</div>
      </div>
    );
  };

  const renderTabs = () => {
    const mapTabs = TABS_LIST_KEY.map((key) => (
      <TabPane tab={key} key={key}>
        {tabTypeSelectedState === key ? renderForm() : null}
      </TabPane>
    ));

    const elmExtra = (
      <React.Fragment>
        <span>{intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.buyWith' })}</span>
        <button>{currentMarket && currentMarket.base_unit.toUpperCase()}</button>
      </React.Fragment>
    );

    return (
      <Tabs tabBarExtraContent={elmExtra} defaultActiveKey="1" onChange={handelTabSelected}>
        {mapTabs}
      </Tabs>
    );
  };

  return <OrderStyle>{renderTabs()}</OrderStyle>;
};
