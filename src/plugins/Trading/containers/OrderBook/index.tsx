import * as React from 'react';
import { Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import isEqual from 'react-fast-compare';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { accumulateVolume } from '../../../../helpers';
import {
  Market,
  selectCurrentMarket,
  selectCurrentPrice,
  selectDepthAsks,
  selectDepthBids,
  selectMarketTickers,
  selectMobileDeviceState,
  setCurrentPrice,
  Ticker,
} from '../../../../modules';
import downSvg from '../../assets/down.svg';
import upSvg from '../../assets/up.svg';
import { OrderBookBuySvg, OrderBookSellSvg, OrderBookSvg } from '../../components/Icon/OrderBookSvg';
import { OrderBookTableRow } from './OrderBookTableRow';
import { OrderBookStyle, TrStyle } from './styles';

const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, price_change_percent: '+0.00%' };

export const OrderBookContainer = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [tabState, setTabState] = React.useState<'all' | 'buy' | 'sell'>('all');
  const [width, setWidth] = React.useState(0);
  const orderRef = React.useRef<HTMLDivElement>(null);

  const bids = useSelector(selectDepthBids, isEqual);
  const asks = useSelector(selectDepthAsks, isEqual);
  const currentMarket = useSelector(selectCurrentMarket, isEqual);
  const currentPrice = useSelector(selectCurrentPrice, isEqual);
  const marketTickers = useSelector(selectMarketTickers, isEqual);
  const isMobileDevice = useSelector(selectMobileDeviceState, isEqual);

  const getTickerValue = React.useCallback((cMarket: Market, tickers: { [key: string]: Ticker }) => {
    return tickers[cMarket.id] || defaultTicker;
  }, []);

  const renderOrderBook = React.useCallback((array: string[][], side: string, currentM?: Market) => {
    // tslint:disable-next-line: no-shadowed-variable
    const maxVolume = Math.max(...array.map((a) => Number(a[1])));
    let total = accumulateVolume(array);
    const priceFixed = currentM ? currentM.price_precision : 0;
    const amountFixed = currentM ? currentM.amount_precision : 0;
    if (side === 'asks') {
      total = accumulateVolume(array.slice(0).reverse()).slice(0).reverse();
    }

    return array.map((item, i) => {
      const [price, volume] = item;

      return [
        <OrderBookTableRow type="price" prevValue={array[i - 1] ? array[i - 1][0] : 0} price={price} fixed={priceFixed} />,
        <OrderBookTableRow total={volume} fixed={amountFixed} />,
        <OrderBookTableRow total={total[i]} fixed={amountFixed} />,
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

  // eslint-disable-next-line
  React.useEffect(() => {
    const { current } = orderRef;
    if (current && current.clientWidth !== width) {
      setWidth(current.clientWidth);
    }
  });

  const arrAsksElm = renderOrderBook(asks, 'asks', currentMarket);
  const arrBidsElm = renderOrderBook(bids, 'bids', currentMarket);
  const noDataElm = (
    <div className="td-order-book-table__empty_data text-center">{formatMessage({ id: 'page.noDataToShow' })}</div>
  );

  const infoTabs: Array<{
    labelTooltip: string;
    key: typeof tabState;
    Component: typeof OrderBookSvg;
  }> = [
    {
      labelTooltip: 'Order Book',
      key: 'all',
      Component: OrderBookSvg,
    },
    {
      labelTooltip: 'Buy',
      key: 'buy',
      Component: OrderBookBuySvg,
    },
    {
      labelTooltip: 'Sell',
      key: 'sell',
      Component: OrderBookSellSvg,
    },
  ];

  const elementTabs = infoTabs.map(({ key, labelTooltip, Component }) => (
    <OverlayTrigger
      key={key}
      placement="bottom"
      overlay={
        <Tooltip className="td-order-book-tooltip" id="td-order-book-header-all">
          {labelTooltip}
        </Tooltip>
      }
    >
      <Component
        active={key === tabState}
        className="mr-2"
        onClick={() => {
          setTabState(key);
        }}
      />
    </OverlayTrigger>
  ));

  const isPositive =
    currentMarket && /\+/.test(currentMarket && (marketTickers[currentMarket.id] || defaultTicker)['price_change_percent']);
  const cls = isPositive ? 'positive' : 'negative';

  return (
    <OrderBookStyle tabState={tabState}>
      <Row className="h-100">
        <Col className="h-100 td-order-book-wrapper p-0" xs={12}>
          <div className="td-order-book">
            <Row className="td-order-book-header">
              <Col className="d-flex align-items-center">{elementTabs}</Col>
              <Col className="d-flex align-items-center"></Col>
            </Row>
            <Row className="td-order-book-tbheader">
              <Col className="p-0">
                {`${formatMessage({ id: 'page.body.trade.header.recentTrades.content.price' })}${
                  currentMarket ? `(${currentMarket.quote_unit.toUpperCase()})` : ''
                }`}
              </Col>
              <Col className="p-0 text-right">
                {`${formatMessage({ id: 'page.body.trade.header.recentTrades.content.amount' })}${
                  currentMarket ? `(${currentMarket.base_unit.toUpperCase()})` : ''
                }`}
              </Col>
              <Col className="p-0 text-right">Total</Col>
            </Row>
            {tabState === 'all' || tabState === 'sell' ? (
              <table className="td-order-book-table td-reverse-table-body">
                <tbody>
                  {arrAsksElm.length > 0
                    ? arrAsksElm.map((item, i) => (
                        <TrStyle
                          color="rgba(47,182,126,0.4)"
                          placement="left"
                          percentwidth={(item[3] as number) || 0}
                          key={i}
                          onClick={() => handleOnSelectAsks(i.toString())}
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
            <Row className="td-order-book-ticker">
              <Col className={`p-0  td-order-book-ticker__last-price d-flex align-items-center td-order-book-item__${cls}`}>
                55,041.30
                <img src={cls === 'positive' ? upSvg : downSvg} style={{ color: 'red' }} />
              </Col>
              <Col className="p-0  td-order-book-ticker__volume d-flex align-items-center justify-content-end">$55,046.05</Col>
              <Col className="p-0 text-right"></Col>
            </Row>
            {tabState === 'all' || tabState === 'buy' ? (
              <table className="td-order-book-table">
                <tbody>
                  {arrBidsElm.length > 0
                    ? arrBidsElm.map((item, i) => (
                        <TrStyle
                          color="rgba(224,30,90,0.2)"
                          placement="right"
                          percentwidth={(item[3] as number) || 0}
                          key={i}
                          onClick={() => handleOnSelectBids(i.toString())}
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
          </div>
        </Col>
      </Row>
    </OrderBookStyle>
  );
};

export const OrderBook = OrderBookContainer;
