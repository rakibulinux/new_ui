import classnames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import Tabs, { TabPane, TabsProps } from 'rc-tabs';
import * as React from 'react';
import isEqual from 'react-fast-compare';
import { useSelector } from 'react-redux';
import { Market, selectMarkets } from '../../../../modules';
import searchSvg from '../../assets/search.svg';
import starSvg from '../../assets/star.svg';
import { MarketsListTrading } from './MarketsListTrading';
import { MarketTradingStyle, SearchBlockStyle, StarBlockStyle } from './styles';

const TAB_LIST_KEYS = ['All'];
const STAR_LIST_KEYS = ['All', 'CX', 'BTC', 'ETH'];

const MarketTradingContainer: React.FC = () => {
  const [searchFieldState, setSearchFieldState] = React.useState<string>('');
  const [marketsTabsSelectedState, setMarketsTabsSelectedState] = React.useState<string>(TAB_LIST_KEYS[0]);
  const [starSelectedState, setStarSelectedState] = React.useState<string>(STAR_LIST_KEYS[0]);

  const markets = useSelector(selectMarkets, isEqual);

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
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={searchFieldState}
            onChange={searchFieldChangeHandler}
          />
        </div>
      </SearchBlockStyle>
    );
  };

  const renderTabs = () => {
    const renderContentTabs = (key: string) => {
      let data: Market[] = cloneDeep(markets);
      if (starSelectedState !== STAR_LIST_KEYS[0]) {
        data = data.filter((market) => market.name.toLowerCase().split('/')[0].includes(starSelectedState.toLowerCase()));
      }
      data = data.filter((market) => market.name.toLowerCase().includes(searchFieldState.toLowerCase()));

      return (
        <TabPane tab={key} key={key}>
          {marketsTabsSelectedState === key ? (
            <React.Fragment>
              {renderSearch()}
              <MarketsListTrading data={data} />
            </React.Fragment>
          ) : null}
        </TabPane>
      );
    };

    return (
      <Tabs defaultActiveKey={marketsTabsSelectedState} onChange={marketsTabsSelectHandler}>
        {TAB_LIST_KEYS.map(renderContentTabs)}
      </Tabs>
    );
  };

  const handleSelectedStar = (key: string) => {
    if (starSelectedState !== key) {
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
            onClick={() => handleSelectedStar(key)}
            key={i}
          >
            {key}
          </button>
        ))}
      </StarBlockStyle>
    );
  };

  return (
    <MarketTradingStyle>
      {renderStarList()}
      {renderTabs()}
    </MarketTradingStyle>
  );
};

export const MarketTrading = MarketTradingContainer;
