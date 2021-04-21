import * as React from 'react';
import { setDocumentTitle } from '../../../../helpers';
import {
  depthFetch,
  marketsFetch,
  // RootState,
  selectCurrentMarket,
  selectMarkets,
  selectMarketTickers,
  selectUserInfo,
  selectUserLoggedIn,
  // setCurrentMarket,
  // setCurrentPrice,
  // Ticker,
  // User,
} from '../../../../modules';
import { HeaderToolbar } from '../../containers/HeaderToolbar';
import { MarketTrading } from '../../containers/MarketTrading';
import { OrderBook } from '../../containers/OrderBook';
import { TradingScreenStyle } from './styles';

import { incrementalOrderBook } from '../../../../api';

// import { WidthProvider, Responsive } from 'react-grid-layout';
import { useDispatch, useSelector } from 'react-redux';
import { OrderComponent, TradingChart } from '../../../../containers';
import { selectGridLayoutState } from '../../../../modules/public/gridLayout';
import { rangerConnectFetch } from '../../../../modules/public/ranger';
import { selectRanger } from '../../../../modules/public/ranger/selectors';

import { RecentTrades } from '../../containers/TradeHistory';

// const breakpoints = {
//   lg: 1200,
//   md: 996,
//   sm: 768,
//   xs: 480,
//   xxs: 0,
// };

// const cols = {
//   lg: 24,
//   md: 24,
//   sm: 12,
//   xs: 12,
//   xxs: 12,
// };

// tslint:disable-next-line: no-empty-interface
interface TradingScreenProps {}

export const TradingScreen: React.FC<TradingScreenProps> = ({}) => {
  const dispatch = useDispatch();
  const currentMarket = useSelector(selectCurrentMarket);
  const markets = useSelector(selectMarkets);
  const user = useSelector(selectUserInfo);
  const rangerState = useSelector(selectRanger);
  const userLoggedIn = useSelector(selectUserLoggedIn);
  const rgl = useSelector(selectGridLayoutState);
  const tickers = useSelector(selectMarketTickers);

  React.useEffect(() => {
    const { connected, withAuth } = rangerState;
    setDocumentTitle('Trading');
    if (markets.length < 1) {
      dispatch(marketsFetch());
    }

    if (currentMarket && !incrementalOrderBook()) {
      dispatch(depthFetch(currentMarket));
    }

    if (!connected) {
      dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
    }

    if (userLoggedIn && !withAuth) {
      dispatch(rangerConnectFetch({ withAuth: userLoggedIn }));
    }
  }, []);

  return (
    <TradingScreenStyle>
      <div className="row">
        <div className="col-sm-9 p-0">
          <div className="row">
            <div className="col-md-12 border-container">
              <HeaderToolbar />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 border-container">
              <OrderBook />
            </div>
            <div className="col-sm-8 border-container">
              <TradingChart hideHeaderContent />
              <OrderComponent size={5} />
            </div>
          </div>
        </div>
        <div className="col-sm-3 p-0">
          <div className="row">
            <div className="col-md-12 border-container">
              <MarketTrading />
            </div>
            <div className="col-md-12 border-container">
              <RecentTrades />
            </div>
          </div>
        </div>
      </div>
    </TradingScreenStyle>
  );
};
