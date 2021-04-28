import { Slider } from 'antd';
import get from 'lodash/get';
import floor from 'lodash/floor';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { FormType, WalletItemProps } from '../../../../components';
import { cleanPositiveFloatInput, precisionRegExp } from '../../../../helpers';
import { selectCurrentMarket, selectMarketTickers, selectOrderExecuteLoading, selectWallets, Wallet } from '../../../../modules';
import moneySvg from '../../assets/money.svg';
import { OrderStyle } from './styles';

// tslint:disable-next-line: no-empty-interface
interface OrderProps {}

const defaultFormState = {
  priceField: undefined,
  amountBuy: 0,
  amountSell: 0,
  priceBuy: 0,
  priceSell: 0,
  percentBuyMyBalance: 0,
  percentSellMyBalance: 0,
};

export const Order: React.FC<OrderProps> = ({}) => {
  const intl = useIntl();
  const dispatch = useDispatch();

  const executeLoading = useSelector(selectOrderExecuteLoading, isEqual);
  const wallets = useSelector(selectWallets, isEqual);
  const currentMarket = useSelector(selectCurrentMarket, isEqual);
  const marketTickers = useSelector(selectMarketTickers, isEqual);

  const TABS_LIST_KEY = [
    intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.limit' }),
    intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.orderType.market' }),
  ];

  const [tabTypeSelectedState, setTabTypeSelectedState] = React.useState<string>(TABS_LIST_KEY[0]);
  const [formState, setFormState] = React.useState(defaultFormState);

  React.useEffect(() => {
    setFormState(defaultFormState);
  }, [currentMarket && currentMarket.id]);

  const changeAmount = (value: string, type: FormType) => {
    console.log(value);
    const convertedValue = cleanPositiveFloatInput(String(value));
    if (convertedValue.match(precisionRegExp(get(currentMarket, 'amount_precision', 6)))) {
      const amount = Number(convertedValue);
      console.log('🚀 ~ file: index.tsx ~ line 45 ~ changeAmount ~ amount', amount);
      if (type === 'sell') {
        setFormState((prev) => ({
          ...prev,
          amountSell: amount,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          amountBuy: amount,
        }));
      }
    }
  };

  const changePrice = (value: string, type: FormType) => {
    const convertedValue = cleanPositiveFloatInput(String(value));
    if (convertedValue.match(precisionRegExp(get(currentMarket, 'price_precision', 6)))) {
      const price = Number(convertedValue);
      if (type === 'sell') {
        setFormState((prev) => ({
          ...prev,
          priceSell: price,
        }));
      } else {
        setFormState((prev) => ({
          ...prev,
          priceBuy: price,
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

  const renderForm = () => {
    if (!currentMarket) {
      return null;
    }

    const walletBase = getWallet(currentMarket.base_unit, wallets);
    const walletQuote = getWallet(currentMarket.quote_unit, wallets);
    const currentTicker = marketTickers[currentMarket.id];
    const defaultCurrentTicker = { last: '0' };
    const priceMarket = Number(Number((currentTicker || defaultCurrentTicker).last).toFixed(currentMarket.price_precision));
    console.log(walletBase, walletQuote, priceMarket, tabTypeSelectedState, currentMarket);
    console.log(formState.amountBuy);

    return (
      <div className="content-form-wrapper">
        <div className="row">
          <div className="col p-0">
            <form className="content-form-bid">
              <div className="d-flex title-block mb-3">
                <div className="flex-fill title-block-left">
                  {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.title.buy' })}{' '}
                  {currentMarket && currentMarket.quote_unit.toUpperCase()}
                </div>
                <div className="flex-fill text-right title-block-right">
                  <img src={moneySvg} />
                  {' - '}
                  {currentMarket && currentMarket.base_unit.toUpperCase()}
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
                    type="number"
                    value={formState.priceBuy || ''}
                    onChange={(e) => changePrice(e.target.value, 'buy')}
                    className="form-control text-right"
                  />
                ) : (
                  <input type={'text'} value={`≈${priceMarket}`} className="form-control text-right" disabled />
                )}

                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {(currentMarket && currentMarket.quote_unit.toUpperCase()) || 'NONE'}</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text d-flex align-items-center text-right">
                    {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' })}
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control text-right"
                  value={formState.amountBuy || ''}
                  onChange={(e) => changeAmount(e.target.value, 'buy')}
                />
                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {(currentMarket && currentMarket.base_unit.toUpperCase()) || 'NONE'}</span>
                </div>
              </div>
              <Slider
                tipFormatter={(e) => `${e}%`}
                marks={marks}
                step={null}
                defaultValue={0}
                value={formState.percentBuyMyBalance}
                onChange={(value: number) => {
                  setFormState((prev) => ({
                    ...prev,
                    percentBuyMyBalance: value,
                  }));
                  changeAmount(
                    floor((Number(walletQuote.balance) / 100) * value, currentMarket.amount_precision).toString(),
                    'buy',
                  );
                }}
              />
              <button className="btn submit-order w-100" disabled={executeLoading}>
                {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.title.buy' })}
              </button>
            </form>
          </div>
          <div className="col p-0">
            <div className="content-form-ask">
              <div className="d-flex title-block mb-3">
                <div className="flex-fill title-block-left">
                  {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.title.sell' })}{' '}
                  {currentMarket && currentMarket.base_unit.toUpperCase()}
                </div>
                <div className="flex-fill text-right title-block-right">
                  <img src={moneySvg} />
                  {' - '}
                  {currentMarket && currentMarket.quote_unit.toUpperCase()}
                </div>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text d-flex align-items-center text-right">
                    {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.price' })}
                  </span>
                </div>
                <input type="number" className="form-control text-right" />
                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {(currentMarket && currentMarket.quote_unit.toUpperCase()) || 'NONE'}</span>
                </div>
              </div>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text d-flex align-items-center text-right">
                    {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.amount' })}
                  </span>
                </div>
                <input type="number" className="form-control text-right" />
                <div className="input-group-append d-flex justify-content-end align-items-center">
                  <span className="input-group-text"> {(currentMarket && currentMarket.base_unit.toUpperCase()) || 'NONE'}</span>
                </div>
              </div>
              <Slider tipFormatter={(e) => `${e}%`} marks={marks} step={null} defaultValue={0} />
              <button className="btn submit-order w-100">
                {intl.formatMessage({ id: 'page.body.trade.header.newOrder.content.title.sell' })}
              </button>
            </div>
          </div>
        </div>
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
