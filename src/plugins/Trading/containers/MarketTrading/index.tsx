import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import { connect, MapStateToProps, useSelector } from 'react-redux';
import { MarketsListTrading as MarketsListTrading1 } from '../../../../containers/MarketTrading/MarketsList';
import { Market, RootState, selectCurrentMarket, selectMarketSelectorState } from '../../../../modules';
import { MarketsListTrading } from './MarketsListTrading';

import { MarketsTab1s } from './MarketsTab1s';

import { MarketTradingStyle, SearchBlockStyle, StarBlockStyle } from './styles';

import classnames from 'classnames';
import searchSvg from '../../assets/search.svg';
import starSvg from '../../assets/star.svg';

const TAB_LIST_KEYS = ['All'];
const STAR_LIST_KEYS = ['CX', 'BTC', 'ETH'];

const MarketTradingContainer: React.FC = () => {
  const [searchFieldState, setSearchFieldState] = React.useState<string>('');
  const [marketsTabsSelectedState, setMarketsTabsSelectedState] = React.useState<string>('');
  const [starSelectedState, setStarSelectedState] = React.useState<string>('');

  const currentMarket = useSelector(selectCurrentMarket);
  const isOpen = useSelector(selectMarketSelectorState);

  const searchFieldChangeHandler: React.InputHTMLAttributes<HTMLInputElement>['onChange'] = (e) => {
    setSearchFieldState(e.target.value);
  };

  const marketsTabsSelectHandler: TabsProps['onChange'] = (activeKey) => {
    setMarketsTabsSelectedState(activeKey);
  };

  const renderSearch = () => {
    return (
      <SearchBlockStyle>
        <div className="search-wrapper">
          <img className="search-icon" src={searchSvg} />
          <input className="search-input" type="text" placeholder="Search" />
        </div>
      </SearchBlockStyle>
    );
  };

  const renderTabs = () => {
    return (
      <Tabs defaultActiveKey="0" onChange={marketsTabsSelectHandler}>
        {TAB_LIST_KEYS.map((key, i) => (
          <TabPane tab={key} key={i}>
            {renderSearch()}
            <MarketsListTrading search={searchFieldState} currencyQuote={marketsTabsSelectedState} />
          </TabPane>
        ))}
      </Tabs>
    );
  };

  const handleSelectedStar = (key: string, isElmActive: boolean) => {
    if (isElmActive) {
      setStarSelectedState('');
    } else {
      setStarSelectedState(key);
    }
  };

  const renderStarList = () => {
    return (
      <StarBlockStyle>
        <img src={starSvg} />
        {STAR_LIST_KEYS.map((key, i) => (
          <button
            className={classnames({
              active: starSelectedState === key,
            })}
            onClick={() => handleSelectedStar(key, starSelectedState === key)}
            key={i}
          >
            {key}
          </button>
        ))}
      </StarBlockStyle>
    );
  };

  return (
    <React.Fragment>
      <MarketTradingStyle>
        {renderStarList()}
        {renderTabs()}
      </MarketTradingStyle>
      <div>
        <div className="pg-markets">
          <div className="pg-trading-header-selector-search-trading">
            <div className="pg-trading-header-selector-search-trading-icon">
              <img alt="" src={require('../../../../containers/MarketTrading/icon/search.svg')} />
            </div>
            <input
              className="pg-trading-header-selector-search-trading-field"
              onChange={searchFieldChangeHandler}
              value={searchFieldState}
            />
          </div>

          <MarketsTab1s onSelect={marketsTabsSelectHandler} />
          <MarketsListTrading1 search={searchFieldState} currencyQuote={marketsTabsSelectedState} />
        </div>
      </div>
    </React.Fragment>
  );
};

export const MarketTrading = MarketTradingContainer;
