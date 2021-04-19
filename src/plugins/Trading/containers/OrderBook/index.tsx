import classNames from 'classnames';
import * as React from 'react';
import { Spinner } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { CombinedOrderBook, Decimal, OrderBook as OrderBookCpn } from '../../../../components';
import { colors } from '../../../../constants';
import { accumulateVolume, calcMaxVolume } from '../../../../helpers';
import {
  Market,
  selectCurrentColorTheme,
  selectCurrentMarket,
  selectCurrentPrice,
  selectDepthAsks,
  selectDepthBids,
  selectDepthLoading,
  selectMarketTickers,
  selectMobileDeviceState,
  setCurrentPrice,
  Ticker,
} from '../../../../modules';
import { OrderBookTableRow } from './OrderBookTableRow';
import { OrderBookStyle } from './styles';
// render big/small breakpoint
const breakpoint = 448;

export const OrderBookContainer = (props) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [width, setWidth] = React.useState(0);
  const orderRef = React.useRef<HTMLDivElement>(null);

  const bids = useSelector(selectDepthBids);
  const asks = useSelector(selectDepthAsks);
  const colorTheme = useSelector(selectCurrentColorTheme);
  const orderBookLoading = useSelector(selectDepthLoading);
  const currentMarket = useSelector(selectCurrentMarket);
  const currentPrice = useSelector(selectCurrentPrice);
  const marketTickers = useSelector(selectMarketTickers);
  const isMobileDevice = useSelector(selectMobileDeviceState);

  const isLarge = React.useMemo(() => props.forceLarge || width > breakpoint, [props.forceLarge, width]);
  const asksData = React.useMemo(() => (isLarge ? asks : asks.slice(0).reverse()), [isLarge, asks]);

  const getTickerValue = React.useCallback((cMarket: Market, tickers: { [key: string]: Ticker }) => {
    const defaultTicker = { amount: 0, low: 0, last: 0, high: 0, volume: 0, open: 0, price_change_percent: '+0.00%' };

    return tickers[cMarket.id] || defaultTicker;
  }, []);

  const lastPrice = React.useCallback(() => {
    const currentTicker = currentMarket && getTickerValue(currentMarket, marketTickers);

    if (currentMarket && currentTicker) {
      const classnames = classNames('', {
        'cr-combined-order-book__market-negative': currentTicker.price_change_percent.includes('-'),
        'cr-combined-order-book__market-positive': currentTicker.price_change_percent.includes('+'),
      });

      return (
        <React.Fragment>
          <span className={classnames}>
            {Decimal.format(+currentTicker.last, currentMarket.price_precision)}&nbsp;
            {isMobileDevice ? null : currentMarket.quote_unit.toUpperCase()}
          </span>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <span className={'cr-combined-order-book__market-negative'}>0</span>
        </React.Fragment>
      );
    }
  }, [currentMarket, formatMessage, getTickerValue, isMobileDevice, marketTickers]);

  const renderHeaders = React.useCallback(() => {
    const formattedBaseUnit = currentMarket && currentMarket.base_unit ? `(${currentMarket.base_unit.toUpperCase()})` : '';
    const formattedQuoteUnit = currentMarket && currentMarket.quote_unit ? `(${currentMarket.quote_unit.toUpperCase()})` : '';

    if (isMobileDevice) {
      return [
        `${formatMessage({ id: 'page.body.trade.orderbook.header.price' })}\n${formattedQuoteUnit}`,
        `${formatMessage({ id: 'page.body.trade.orderbook.header.amount' })}\n${formattedBaseUnit}`,
      ];
    }

    return [
      `${formatMessage({ id: 'page.body.trade.orderbook.header.price' })}\n${formattedQuoteUnit}`,
      `${formatMessage({ id: 'page.body.trade.orderbook.header.amount' })}\n${formattedBaseUnit}`,
      `${formatMessage({ id: 'page.body.trade.orderbook.header.volume' })}\n${formattedBaseUnit}`,
    ];
  }, [currentMarket, formatMessage, isMobileDevice]);

  const renderOrderBook = React.useCallback(
    (array: string[][], side: string, message: string, currentM?: Market) => {
      let total = accumulateVolume(array);
      const priceFixed = currentM ? currentM.price_precision : 0;
      const amountFixed = currentM ? currentM.amount_precision : 0;
      if (side === 'asks') {
        total = isLarge ? total : accumulateVolume(array.slice(0).reverse()).slice(0).reverse();
      }

      return array.length > 0
        ? array.map((item, i) => {
            const [price, volume] = item;

            return [
              <OrderBookTableRow type="price" prevValue={array[i - 1] ? array[i - 1][0] : 0} price={price} fixed={priceFixed} />,
              <OrderBookTableRow total={volume} fixed={amountFixed} />,
              <OrderBookTableRow total={total[i]} fixed={amountFixed} />,
            ];
          })
        : [[[''], message, ['']]];
    },
    [isLarge, isMobileDevice],
  );

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
      const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);
      if (currentPrice !== priceToSet) {
        dispatch(setCurrentPrice(priceToSet));
      }
    },
    [currentPrice, dispatch, asksData],
  );

  // eslint-disable-next-line
  React.useEffect(() => {
    const { current } = orderRef;
    if (current && current.clientWidth !== width) {
      setWidth(current.clientWidth);
    }
  });

  const maxVolume = calcMaxVolume(bids, asks);

  return (
    <OrderBookStyle>
      <div className="cr-new-combined-order-book" ref={orderRef}>
        {/* <div className={'cr-table-header__content head-text'}>{formatMessage({ id: 'page.body.trade.orderbook' })}</div> */}
        {/* <div
          className="col-12"
          style={{
            padding: '0px',
            paddingBottom: '3px',
          }}
        >
          <div className="cr-new-combined-order-book-asks">
            <OrderBookCpn
              side={'right'}
              headers={renderHeaders()}
              data={renderOrderBook(asksData, 'asks', formatMessage({ id: 'page.noDataToShow' }), currentMarket) as any}
              rowBackgroundColor={colors[colorTheme].orderBook.asks}
              maxVolume={maxVolume}
              orderBookEntry={accumulateVolume(asks).reverse()}
              onSelect={handleOnSelectAsks}
            />
          </div>
        </div>
        <div
          className="col-12"
          style={{
            padding: '0px',
            paddingTop: '3px',
          }}
        >
          <div className="cr-new-combined-order-book-bids">1</div>
        </div> */}
        {orderBookLoading ? (
          <div className="pg-combined-order-book-loader">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <div className="cr-combined-order-book">
            <div className="cr-combined-order-book__small">
              <OrderBookCpn
                side={'right'}
                headers={renderHeaders()}
                data={renderOrderBook(asksData, 'asks', formatMessage({ id: 'page.noDataToShow' }), currentMarket) as any}
                rowBackgroundColor={colors[colorTheme].orderBook.asks}
                maxVolume={maxVolume}
                orderBookEntry={accumulateVolume(asks).reverse()}
                onSelect={handleOnSelectAsks}
              />
              <OrderBookCpn
                side={'right'}
                data={renderOrderBook(bids, 'bids', formatMessage({ id: 'page.noDataToShow' }), currentMarket) as any}
                rowBackgroundColor={colors[colorTheme].orderBook.bids}
                maxVolume={maxVolume}
                orderBookEntry={accumulateVolume(bids)}
                onSelect={handleOnSelectBids}
              />
            </div>
          </div>
        )}
      </div>
    </OrderBookStyle>
  );
};

export const OrderBook = OrderBookContainer;
