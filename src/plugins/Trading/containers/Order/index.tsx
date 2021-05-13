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
  totalBuy: '',
  totalSell: '',
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

  const changeAmountTotalSlider = (type: FormType, field: 'amount' | 'slider' | 'total' | 'price') => {
    if (currentMarket) {
      const walletQuote = getWallet(currentMarket.quote_unit, wallets);
      const { balance } = walletQuote;
      if (balance) {
        if (type === 'sell') {
          switch (field) {
            case 'amount':
              setFormState((prev) => {
                const percentSellMyBalance = prev.amountSell ? floor(+prev.amountSell / (+balance / 100)) : 0;
                const totalSell =
                  prev.amountSell && prev.priceSell ? floor(+prev.amountSell * +prev.priceSell, 8).toString() : '';

                return {
                  ...prev,
                  percentSellMyBalance,
                  totalSell,
                };
              });
              break;
            case 'slider':
              setFormState((prev) => {
                let amountSell = prev.percentSellMyBalance
                  ? floor(prev.percentSellMyBalance * (+balance / 100), currentMarket.amount_precision).toString()
                  : '';
                amountSell =
                  prev.percentSellMyBalance && prev.priceSell
                    ? floor(
                        (+balance / +prev.priceSell / 100) * prev.percentSellMyBalance,
                        currentMarket.amount_precision,
                      ).toString()
                    : amountSell;
                const totalSell = amountSell && prev.priceSell ? floor(+amountSell * +prev.priceSell, 8).toString() : '';

                return {
                  ...prev,
                  amountSell,
                  totalSell,
                };
              });
              break;
            case 'total':
              setFormState((prev) => {
                const amountSell =
                  prev.totalSell && prev.priceSell
                    ? floor(+prev.totalSell / +prev.priceSell, currentMarket.amount_precision).toString()
                    : '';
                const percentSellMyBalance = amountSell ? floor(+amountSell / (+balance / 100)) : 0;

                return {
                  ...prev,
                  amountSell,
                  percentSellMyBalance: percentSellMyBalance > 100 ? 100 : percentSellMyBalance,
                };
              });
              break;
            case 'price':
              setFormState((prev) => {
                const totalSell =
                  prev.amountSell && prev.priceSell
                    ? floor(+prev.amountSell * +prev.priceSell, 8).toString()
                    : defaultFormState.totalSell;
                const percentSellMyBalance = totalSell ? floor(+totalSell / (+balance / 100)) : 0;

                return {
                  ...prev,
                  totalSell,
                  percentSellMyBalance: percentSellMyBalance > 100 ? 100 : percentSellMyBalance,
                };
              });
              break;
            default:
              break;
          }
        } else {
          switch (field) {
            case 'amount':
              setFormState((prev) => {
                const percentBuyMyBalance = prev.amountBuy ? floor(+prev.amountBuy / (+balance / 100)) : 0;
                const totalBuy = prev.amountBuy && prev.priceBuy ? floor(+prev.amountBuy * +prev.priceBuy, 8).toString() : '';

                return {
                  ...prev,
                  percentBuyMyBalance,
                  totalBuy,
                };
              });
              break;
            case 'slider':
              setFormState((prev) => {
                let amountBuy = prev.percentBuyMyBalance
                  ? floor(prev.percentBuyMyBalance * (+balance / 100), currentMarket.amount_precision).toString()
                  : '';
                amountBuy =
                  prev.percentBuyMyBalance && prev.priceBuy
                    ? floor(
                        (+balance / +prev.priceBuy / 100) * prev.percentBuyMyBalance,
                        currentMarket.amount_precision,
                      ).toString()
                    : amountBuy;
                const totalBuy = amountBuy && prev.priceBuy ? floor(+amountBuy * +prev.priceBuy, 8).toString() : '';

                return {
                  ...prev,
                  amountBuy,
                  totalBuy,
                };
              });
              break;
            case 'total':
              setFormState((prev) => {
                const amountBuy =
                  prev.totalBuy && prev.priceBuy
                    ? floor(+prev.totalBuy / +prev.priceBuy, currentMarket.amount_precision).toString()
                    : '';
                const percentBuyMyBalance = amountBuy ? floor(+amountBuy / (+balance / 100)) : 0;

                return {
                  ...prev,
                  amountBuy,
                  percentBuyMyBalance: percentBuyMyBalance > 100 ? 100 : percentBuyMyBalance,
                };
              });
              break;
            case 'price':
              setFormState((prev) => {
                const totalBuy =
                  prev.amountBuy && prev.priceBuy
                    ? floor(+prev.amountBuy * +prev.priceBuy, 8).toString()
                    : defaultFormState.totalBuy;
                const percentBuyMyBalance = totalBuy ? floor(+totalBuy / (+balance / 100)) : 0;

                return {
                  ...prev,
                  totalBuy,
                  percentBuyMyBalance: percentBuyMyBalance > 100 ? 100 : percentBuyMyBalance,
                };
              });
              break;
            default:
              break;
          }
        }
      }
    }
  };

  const changeAmount = (value: string, type: FormType) => {
    const convertedValue = cleanPositiveFloatInput(String(value));
    if (convertedValue.match(precisionRegExp(get(currentMarket, 'amount_precision', 6)))) {
      if (type === 'sell') {
        setFormState((prev) => ({
          ...prev,
          amountSell: convertedValue,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          amountBuy: convertedValue,
        }));
      }
      changeAmountTotalSlider(type, 'amount');
    }
  };

  const changeTotal = (value: string, type: FormType) => {
    const convertedValue = cleanPositiveFloatInput(String(value));
    if (convertedValue.match(precisionRegExp(get(currentMarket, 'amount_precision', 8)))) {
      if (type === 'sell') {
        setFormState((prev) => ({
          ...prev,
          totalSell: convertedValue,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          totalBuy: convertedValue,
        }));
      }
      changeAmountTotalSlider(type, 'total');
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
      changeAmountTotalSlider(type, 'price');
    }
  };

  const onChangeSlider = (value: number, type: FormType) => {
    if (currentMarket) {
      const walletBase = getWallet(currentMarket.base_unit, wallets);
      setFormState((prev) => ({
        ...prev,
        percentBuyMyBalance: type === 'buy' ? value : prev.percentBuyMyBalance,
        percentSellMyBalance: type === 'sell' ? value : prev.percentSellMyBalance,
      }));

      changeAmountTotalSlider(type, 'slider');
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

    const walletBase = getWallet(currentMarket.base_unit, wallets);
    const walletQuote = getWallet(currentMarket.quote_unit, wallets);
    const currentTicker = marketTickers[currentMarket.id];

    const amount = Number(type === 'sell' ? formState.amountSell : formState.amountBuy);
    const priceType = type === 'buy' ? formState.priceBuy : formState.priceSell;
    const price = tabTypeSelectedState === TABS_LIST_KEY[0] ? priceType : currentTicker.last;
    const available = getAvailableValue(walletQuote);

    const resultData: OrderExecution = {
      market: currentMarket.id,
      side: type,
      volume: amount.toString(),
      ord_type: tabTypeSelectedState.toLowerCase(),
    };

    const order = tabTypeSelectedState === TABS_LIST_KEY[0] ? { ...resultData, price: price } : resultData;
    let orderAllowed = true;

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

    if (tabTypeSelectedState === TABS_LIST_KEY[0]) {
      if (
        (available < +formState.totalBuy && order.side === 'buy') ||
        (available < +formState.totalSell && order.side === 'sell')
      ) {
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
    } else {
      if ((available < amount && order.side === 'buy') || (available < amount && order.side === 'sell')) {
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
        const balance =
          type === 'buy'
            ? floor(+get(walletBase, 'balance', '0'), get(walletBase, 'fixed', 6))
            : floor(+get(walletQuote, 'balance', '0'), get(walletQuote, 'fixed', 6));

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
                  {currentMarket.quote_unit.toUpperCase()}
                </div>
                <div className="flex-fill text-right title-block-right">
                  <img src={moneySvg} />
                  {` ${balance || '-'} `}
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
                  onChange={(e) => changeAmount(e.target.value, type)}
                />
                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {currentMarket.base_unit.toUpperCase() || 'NONE'}</span>
                </div>
              </div>
              <Slider
                disabled={!isLoggedIn || !get(walletBase, 'balance', null)}
                tipFormatter={(e) => `${e}%`}
                marks={marks}
                step={1}
                value={type === 'buy' ? formState.percentBuyMyBalance : formState.percentSellMyBalance}
                onChange={(value: number) => {
                  onChangeSlider(value, type);
                }}
              />
              {isLoggedIn && tabTypeSelectedState === TABS_LIST_KEY[0] ? (
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text d-flex align-items-center text-right">
                      {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.total' })}
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control text-right"
                    value={(type === 'buy' ? formState.totalBuy : formState.totalSell).toString()}
                    onChange={(e) => changeTotal(e.target.value, type)}
                  />
                  <div className="input-group-append d-flex justify-content-end align-items-center">
                    <span className="input-group-text"> {currentMarket.quote_unit.toUpperCase() || 'NONE'}</span>
                  </div>
                </div>
              ) : null}
              {isLoggedIn ? (
                <button
                  type="submit"
                  className={`btn submit-order btn-block mr-1 mt-1 btn-lg btn-${
                    type === 'buy' ? 'success' : 'danger'
                  } btn-block btn-lg w-100 mt-2`}
                  disabled={isDisabled}
                >
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
        <button>{currentMarket && currentMarket.quote_unit.toUpperCase()}</button>
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
