import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { incrementalOrderBook } from '../../../../api';
import { OrderComponent, TradingChart } from '../../../../containers';
import { setDocumentTitle } from '../../../../helpers';
import { depthFetch, marketsFetch, selectCurrentMarket, selectMarkets, selectUserLoggedIn } from '../../../../modules';
import { rangerConnectFetch } from '../../../../modules/public/ranger';
import { selectRanger } from '../../../../modules/public/ranger/selectors';
import { HeaderToolbar } from '../../containers/HeaderToolbar';
import { MarketTrading } from '../../containers/MarketTrading';
import { OrderBook } from '../../containers/OrderBook';
import { RecentTrades } from '../../containers/TradeHistory';
import { TradingScreenStyle } from './styles';

import { Order } from '../../containers/Order';

// tslint:disable-next-line: no-empty-interface
interface TradingScreenProps {}

export const TradingScreen: React.FC<TradingScreenProps> = ({}) => {
  const dispatch = useDispatch();
  const currentMarket = useSelector(selectCurrentMarket);
  const markets = useSelector(selectMarkets);
  const rangerState = useSelector(selectRanger);
  const userLoggedIn = useSelector(selectUserLoggedIn);

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
        <div className="col-sm-9 d-flex flex-column p-0">
          <div className="row">
            <div className="col-md-12 border-container" style={{ paddingLeft: 'unset' }}>
              <HeaderToolbar />
            </div>
          </div>

          <div className="row  flex-fill">
            <div className="col-sm-4 border-container" style={{ paddingLeft: 'unset' }}>
              <OrderBook />
            </div>
            <div className="col-sm-8 p-0">
              <div
                className="row"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                }}
              >
                <div className="col-md-12 border-container" style={{ paddingBottom: '8px', flex: 'none' }}>
                  <TradingChart hideHeaderContent />
                </div>
                <div className="col-md-12 border-container" style={{ flex: 1 }}>
                  <Order />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3 p-0">
          <div
            className="row"
            style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <div className="col-md-12 border-container" style={{ paddingRight: 'unset', flex: 'none' }}>
              <MarketTrading />
            </div>
            <div className="col-md-12 border-container" style={{ paddingRight: 'unset', flex: 1 }}>
              <RecentTrades />
            </div>
          </div>
        </div>
      </div>
    </TradingScreenStyle>
  );
};
